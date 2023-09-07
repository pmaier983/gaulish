import { createId } from "@paralleldrive/cuid2"
import { eq } from "drizzle-orm"
import {
  type Log,
  log,
  type Ship,
  ship,
  type Tile,
  city,
  path,
  users,
} from "schema"
import {
  LOG_PAGE_SIZE,
  TILE_TYPES,
  TILE_TYPE_ID_TO_TYPE,
} from "~/components/constants"
import { type DatabaseType } from "~/server/db"
import { type RouterOutputs, type QueryClient } from "~/utils/api"
import {
  getNewKnownTiles,
  getShipCargoSum,
  getXYFromXYTileId,
  hasNpcUserCollision,
} from "~/utils/utils"

/**
 * Sailing Events
 *
 * When a user sets of to sail we run their path through a validation process
 *
 * If anything interesting happens we add it to the events array.
 *
 * Examples of interesting things:
 * - Sinking a ship
 * - Conflicting with an enemy npc
 * - Revealing some Tiles
 *
 */

export const SAIL_EVENT_TYPES = {
  SINK: "SINK",
  LOG: "LOG",
  TILE_REVEAL: "TILE_REVEAL",
} as const

export type SAIL_EVENT_TYPE = keyof typeof SAIL_EVENT_TYPES

interface SailEventBase {
  type: SAIL_EVENT_TYPE
  triggerTime: number
}

interface SailEventLog extends SailEventBase {
  log: Log
}

interface SailEventSink extends SailEventBase {
  log: Log
}

interface SailEventTileReveal extends SailEventBase {
  newKnownTiles: string[]
}

export type SailEvent = SailEventLog | SailEventSink | SailEventTileReveal

interface handleSailingEventsProps {
  data: RouterOutputs["ships"]["sail"]
  queryClient: QueryClient
  setHaveLogsUpdatedState: (newUpdatedState: boolean) => void
  setKnownTilesObject: (tiles: string[]) => void
}

export const handleSailingEvents = ({
  data,
  queryClient,
  setHaveLogsUpdatedState,
  setKnownTilesObject,
}: handleSailingEventsProps) => {
  data.events.forEach((event) => {
    switch (event.type) {
      /**
       * When Sinking a ship
       * - Set Logs to have updated
       * - Add the new log to the logs list
       * - Remove the ship from the ship list
       */
      case SAIL_EVENT_TYPES.SINK: {
        setTimeout(() => {
          const sinkEvent = event as SailEventSink
          setHaveLogsUpdatedState(true)

          addToLogs({ queryClient, newLog: sinkEvent.log })

          queryClient.ships.getUsersShips.setData(
            undefined,
            (oldUserShipList) => {
              return oldUserShipList?.filter((ship) => ship.id !== data.ship.id)
            },
          )
        }, event.triggerTime - Date.now())
        break
      }
      /**
       * When triggering a generic log
       * - Set Logs to have updated
       * - Add the new log to the logs list
       */
      case SAIL_EVENT_TYPES.LOG: {
        setTimeout(() => {
          // TODO: avoid asserting type here
          const logEvent = event as SailEventLog

          setHaveLogsUpdatedState(true)

          addToLogs({ queryClient, newLog: logEvent.log })
        }, event.triggerTime - Date.now())
        break
      }
      case SAIL_EVENT_TYPES.TILE_REVEAL: {
        setTimeout(() => {
          // TODO: avoid asserting type here
          const tileRevealEvent = event as SailEventTileReveal

          setKnownTilesObject(tileRevealEvent.newKnownTiles)
        }, event.triggerTime - Date.now())
        break
      }
      default:
        throw Error("Invalid event type in handleSailingEvents")
    }
  })
}

interface AddToLogsProps {
  queryClient: QueryClient
  newLog: Log
}

export const addToLogs = ({ queryClient, newLog }: AddToLogsProps) => {
  queryClient.logs.getLogs.setInfiniteData(
    { limit: LOG_PAGE_SIZE },
    (oldData) => {
      const newLogPage = { logs: [newLog], nextCursor: 1 }

      if (!oldData)
        return {
          pages: [newLogPage],
          pageParams: [],
        }

      const middlePages = oldData.pages.slice(0, oldData.pages.length - 1)
      const lastPage = oldData.pages.at(-1)!

      return {
        ...oldData,
        pages: [
          newLogPage,
          ...middlePages,
          { ...lastPage, nextCursor: lastPage.nextCursor! + 1 },
        ],
      }
    },
  )
}

interface EnhancedShipPath {
  x: number
  y: number
  xyTileId: string
  timeMsAtTileEnd: number
  timeMsAtTileStart: number
}

export const getEnhancedShipPath = (
  shipPath: string[],
  startTime: Date,
  ship: Ship,
) =>
  shipPath.map<EnhancedShipPath>((xyTileId, i) => {
    const { x, y } = getXYFromXYTileId(xyTileId)
    const msPerTile = 1 / ship.speed
    return {
      x,
      y,
      xyTileId,
      timeMsAtTileEnd: startTime.getTime() + msPerTile * (i + 1),
      timeMsAtTileStart: startTime.getTime() + msPerTile * i,
    }
  })

interface TilesObject {
  [key: string]: Tile
}

export const getTilesObject = (tiles: Tile[]) =>
  tiles.reduce<TilesObject>((acc, tile) => {
    acc[tile.xyTileId] = tile
    return acc
  }, {})

interface SinkShipEventProps {
  db: DatabaseType
  logText: string
  mutableEvents: SailEvent[]
  userShip: Ship
  userId: string
  finalEnhancedTileIndex: number
  mutableEnhancedShipPath: EnhancedShipPath[]
}

export const sinkShipEvent = async ({
  db,
  userShip,
  logText,
  userId,
  mutableEvents,
  finalEnhancedTileIndex,
  mutableEnhancedShipPath,
}: SinkShipEventProps) => {
  const finalEnhancedTile = mutableEnhancedShipPath[finalEnhancedTileIndex]

  if (!finalEnhancedTile)
    throw Error("Wrong finalEnhancedTileIndex passed into sinkShipEvent")

  const newLog = {
    id: createId(),
    userId,
    shipId: userShip.id,
    text: logText,
    createdAt: new Date(finalEnhancedTile.timeMsAtTileEnd),
  }

  mutableEvents.push({
    type: SAIL_EVENT_TYPES.SINK,
    triggerTime: finalEnhancedTile.timeMsAtTileEnd,
    log: newLog,
  })

  // Update the ship to be sunk
  await db.update(ship).set({ isSunk: true }).where(eq(ship.id, userShip.id))

  // remove all parts of the path after the sinking
  mutableEnhancedShipPath.splice(finalEnhancedTileIndex + 1)

  // Add sinking event to the logs
  await db.insert(log).values(newLog)
}

export interface ValidationProps {
  tiles: Tile[]
  userShip: Ship
  shipPath: string[]
  startTime: Date
  tilesObject: TilesObject

  mutableEvents: SailEvent[]
  mutableEnhancedShipPath: EnhancedShipPath[]

  db: DatabaseType
  userId: string
}

export const validateTileConflicts = async ({
  shipPath,
  db,
  userId,
  userShip,
  mutableEvents,
  tilesObject,
  mutableEnhancedShipPath,
}: ValidationProps) => {
  for await (const [
    i,
    enhancedShipPathTile,
  ] of mutableEnhancedShipPath.entries()) {
    // Ignore the first and last tile (presumably they are cities)
    if (i === 0 || i === mutableEnhancedShipPath.length - 1) continue

    const tile = tilesObject[enhancedShipPathTile.xyTileId]

    if (!tile)
      throw Error(
        `Ship Path included a non-existent tile! tilesObject + shipPath: ${
          JSON.stringify(tilesObject) + JSON.stringify(shipPath)
        }`,
      )

    const tileType = TILE_TYPE_ID_TO_TYPE[tile.type_id]

    if (!tileType)
      throw Error("invalid tileType passed into TILE_TYPE_TO_TYPE_ID")

    /**
     * Sailing over anything that is not ocean sinks the boat!
     * - Log the sinking event
     * - Add the event to the events list
     * - Update the ship to be sunk
     */
    if (tileType !== TILE_TYPES.OCEAN) {
      const logText = `Your ship ${
        userShip.name
      } sank after sailing into a ${tileType.toLocaleLowerCase()}!`

      await sinkShipEvent({
        db,
        userId,
        mutableEvents,
        userShip,
        finalEnhancedTileIndex: i,
        logText,
        mutableEnhancedShipPath,
      })
      break
    }
  }
}

export const validateFinalDestination = async ({
  db,
  userId,
  userShip,
  mutableEvents,
  mutableEnhancedShipPath,
}: ValidationProps): Promise<number> => {
  const finalTile = mutableEnhancedShipPath.at(-1)

  if (!finalTile) throw new Error("No last tile found in path")

  const destination = await db.query.city.findFirst({
    where: eq(city.xyTileId, finalTile.xyTileId),
  })

  /**
   * If there is no destination (& the ship is not already sunk)
   * - Sink the ship
   * - Update the logs
   */
  if (!destination) {
    const isAlreadySunk = mutableEvents.some((event) => event.type === "SINK")

    if (!isAlreadySunk) {
      await sinkShipEvent({
        db,
        userId,
        mutableEvents,
        userShip,
        finalEnhancedTileIndex: mutableEnhancedShipPath.length - 1,
        logText: `Your ship: ${userShip.name} had a final destination that wasn't a city!`,
        mutableEnhancedShipPath,
      })
    }

    return userShip.cityId
  }

  const startingCity = await db.query.city.findFirst({
    where: eq(city.id, userShip.cityId),
  })

  const newLog = {
    id: createId(),
    userId,
    shipId: userShip.id,
    text: `Your ship: ${userShip.name} Sailed from ${startingCity?.name} to ${destination.name}`,
    createdAt: new Date(finalTile.timeMsAtTileEnd),
  }

  mutableEvents.push({
    type: SAIL_EVENT_TYPES.LOG,
    triggerTime: finalTile.timeMsAtTileEnd,
    log: newLog,
  })

  await db.insert(log).values(newLog)

  return destination.id
}

export const validateKnownTiles = async ({
  db,
  mutableEnhancedShipPath,
  mutableEvents,
  tilesObject,
  userId,
}: ValidationProps) => {
  const knownTiles =
    (
      await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          knownTiles: true,
        },
      })
    )?.knownTiles ?? []

  let mutableNewKnownTiles = [...knownTiles]

  for await (const [
    ,
    enhancedShipPathTile,
  ] of mutableEnhancedShipPath.entries()) {
    const possibleNewKnowTiles = getNewKnownTiles({
      centralXYTileId: enhancedShipPathTile.xyTileId,
      visibilityStrength: 3,
      tileListObject: tilesObject,
      knownTiles: knownTiles,
    })

    if (possibleNewKnowTiles.length > 0) {
      mutableNewKnownTiles = [
        ...new Set([...possibleNewKnowTiles, ...mutableNewKnownTiles]),
      ]

      mutableEvents.push({
        type: SAIL_EVENT_TYPES.TILE_REVEAL,
        // TODO: figure out why this is a bit stilted?
        triggerTime: enhancedShipPathTile.timeMsAtTileStart,
        newKnownTiles: mutableNewKnownTiles,
      })
    }
  }

  await db
    .update(users)
    .set({ knownTiles: mutableNewKnownTiles })
    .where(eq(users.id, userId))
}

// TODO: fix visually seeing ships overlap!
export const validateNpcConflicts = async ({
  db,
  userShip,
  userId,
  mutableEvents,
  mutableEnhancedShipPath,
}: ValidationProps) => {
  const npcs = await db.query.npc.findMany({
    with: {
      path: true,
    },
  })

  for await (const [
    enhancedShipPathIndex,
    enhancedShipPathTile,
  ] of mutableEnhancedShipPath.entries()) {
    for await (const [, npc] of npcs.entries()) {
      // if the npc has no path skip that npc
      if (!npc.path) continue
      const hasConflict = hasNpcUserCollision({
        userStartTimeMsAtTile: enhancedShipPathTile.timeMsAtTileStart,
        userEndTimeMsAtTile: enhancedShipPathTile.timeMsAtTileEnd,
        userXYTileId: enhancedShipPathTile.xyTileId,
        npc: npc,
        npcPath: npc.path,
      })

      if (hasConflict) {
        const userShipCargoSum = getShipCargoSum(userShip)

        // If the user has nothing to steal, sink them
        if (userShipCargoSum === 0) {
          await sinkShipEvent({
            db,
            userId,
            mutableEvents,
            userShip,
            finalEnhancedTileIndex: enhancedShipPathIndex,
            logText: `Your ship: ${userShip.name} had nothing to steal so the: ${npc.name} sunk it!`,
            mutableEnhancedShipPath,
          })
          break
        }

        // If the user has something to steal, steal it
        const logText = `${npc.name} stole all the gold and half the cargo from your ship: ${userShip.name}!`

        await db
          .update(ship)
          .set({
            gold: 0,
            stone: Math.floor(userShip.stone / 2),
            wood: Math.floor(userShip.wood / 2),
            wheat: Math.floor(userShip.wheat / 2),
            wool: Math.floor(userShip.wool / 2),
          })
          .where(eq(ship.id, userShip.id))

        const newLog = {
          id: createId(),
          userId,
          shipId: userShip.id,
          text: logText,
          createdAt: new Date(enhancedShipPathTile.timeMsAtTileEnd),
        }

        mutableEvents.push({
          type: SAIL_EVENT_TYPES.LOG,
          triggerTime: enhancedShipPathTile.timeMsAtTileEnd,
          log: newLog,
        })

        await db.insert(log).values(newLog)
      }
    }
  }
}

export const validateShipCurrentSailingStatus = async ({
  db,
  userShip,
}: ValidationProps) => {
  // If the ship has no prev pathId it cannot be sailing, so just return
  if (!userShip.pathId) return

  const possibleCurrentShipPath = await db.query.path.findFirst({
    where: eq(path.id, userShip.pathId),
  })

  if (!possibleCurrentShipPath || !possibleCurrentShipPath.createdAt)
    throw new Error("Ship has a non existent Path ID!")

  const endTime = new Date(
    possibleCurrentShipPath.createdAt.getTime()! +
      possibleCurrentShipPath?.pathArray.length * (1 / userShip.speed),
  )

  if (endTime > new Date()) {
    throw new Error("Ship is already sailing!")
  }
}
