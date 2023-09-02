import { createId } from "@paralleldrive/cuid2"
import { eq } from "drizzle-orm"
import { type Log, log, type Ship, ship, type Tile, city } from "schema"
import {
  LOG_PAGE_SIZE,
  TILE_TYPES,
  TILE_TYPE_ID_TO_TYPE,
} from "~/components/constants"
import { type DatabaseType } from "~/server/db"
import { type RouterOutputs, type QueryClient } from "~/utils/api"
import { getXYFromXYTileId } from "~/utils/utils"

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

interface SailEventTileReveal extends SailEventBase {}

export type SailEvent = SailEventLog | SailEventSink | SailEventTileReveal

interface handleSailingEventsProps {
  data: RouterOutputs["ships"]["sail"]
  queryClient: QueryClient
  setHaveLogsUpdatedState: (newUpdatedState: boolean) => void
}

export const handleSailingEvents = ({
  data,
  queryClient,
  setHaveLogsUpdatedState,
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

export const getEnhancedShipPath = (
  shipPath: string[],
  startTime: Date,
  ship: Ship,
) =>
  shipPath.map((xyTileId, i) => {
    const { x, y } = getXYFromXYTileId(xyTileId)
    const msPerTile = 1 / ship.speed
    return {
      x,
      y,
      xyTileId,
      timeAtTileEnd: startTime.getTime() + msPerTile * (i + 1),
    }
  })

interface TilesObject {
  [key: string]: Tile
}

export const getTileObject = (tiles: Tile[]) =>
  tiles.reduce<TilesObject>((acc, tile) => {
    acc[tile.xyTileId] = tile
    return acc
  }, {})

export interface ValidationProps {
  tiles: Tile[]
  userShip: Ship
  shipPath: string[]
  startTime: Date
  tilesObject: TilesObject

  mutableEvents: SailEvent[]
  mutableEnhancedShipPath: ReturnType<typeof getEnhancedShipPath>

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

      const newLog = {
        id: createId(),
        userId,
        shipId: userShip.id,
        text: logText,
        createdAt: new Date(enhancedShipPathTile.timeAtTileEnd),
      }

      mutableEvents.push({
        type: SAIL_EVENT_TYPES.SINK,
        triggerTime: enhancedShipPathTile.timeAtTileEnd,
        log: newLog,
      })

      // Update the ship to be sunk
      await db
        .update(ship)
        .set({ isSunk: true })
        .where(eq(ship.id, userShip.id))

      // remove all parts of the path after the sinking
      mutableEnhancedShipPath.splice(i + 1)

      // Add sinking event to the logs
      await db.insert(log).values(newLog)
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
   * If there is no destination
   * - Sink the ship
   * - Update the logs
   */
  if (!destination) {
    await db.update(ship).set({ isSunk: true }).where(eq(ship.id, userShip.id))

    const newLog = {
      id: createId(),
      userId,
      shipId: userShip.id,
      text: `Your ship: ${userShip.name} had a final destination that wasn't a city!`,
      createdAt: new Date(finalTile.timeAtTileEnd),
    }

    mutableEvents.push({
      type: SAIL_EVENT_TYPES.SINK,
      triggerTime: finalTile.timeAtTileEnd,
      log: newLog,
    })

    await db.insert(log).values(newLog)

    return userShip.cityId
  }

  const startingCity = await db.query.city.findFirst({
    where: eq(city.id, userShip.cityId),
  })

  const newLog = {
    id: createId(),
    userId,
    shipId: userShip.id,
    text: `Your ship: ${userShip.name} Sailed from ${startingCity?.name} to ${destination.name}}`,
    createdAt: new Date(finalTile.timeAtTileEnd),
  }

  mutableEvents.push({
    type: SAIL_EVENT_TYPES.LOG,
    triggerTime: finalTile.timeAtTileEnd,
    log: newLog,
  })

  await db.insert(log).values(newLog)

  return destination.id
}
