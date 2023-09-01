import { createId } from "@paralleldrive/cuid2"
import { eq } from "drizzle-orm"
import { produce } from "immer"
import { type Log, log, type Ship, ship, type Tile } from "schema"
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
        console.log({ now: Date.now(), time: event.triggerTime })
        setTimeout(() => {
          const sinkEvent = event as SailEventSink
          setHaveLogsUpdatedState(true)

          queryClient.logs.getLogs.setData(
            { limit: LOG_PAGE_SIZE, cursor: undefined },
            (oldLogs) => {
              const newLogs = produce(oldLogs, (draftLogs) => {
                draftLogs?.logs?.push(sinkEvent.log)
              })

              return newLogs
            },
          )

          queryClient.ships.getUsersShips.setData(
            undefined,
            (oldUserShipList) => {
              return oldUserShipList?.filter((ship) => ship.id !== data.ship.id)
            },
          )
        }, event.triggerTime - Date.now())
        break
      }
      case SAIL_EVENT_TYPES.LOG: {
        // TODO: avoid asserting type here
        const logEvent = event as SailEventLog

        setHaveLogsUpdatedState(true)
        queryClient.logs.getLogs.setData(
          { limit: LOG_PAGE_SIZE, cursor: undefined },
          (oldLogs) => {
            const newLogs = produce(oldLogs, (draftLogs) => {
              draftLogs?.logs?.push(logEvent.log)
            })

            return newLogs
          },
        )
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

export const getEnhancedShipPath = (
  shipPath: string[],
  startTime: Date,
  ship: Ship,
): ValidationProps["enhancedShipPath"] =>
  shipPath.map((xyTileId, i) => {
    const { x, y } = getXYFromXYTileId(xyTileId)
    const msPerTile = 1 / ship.speed
    return {
      x,
      y,
      xyTileId,
      timeAtTile: startTime.getTime() + msPerTile * i,
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
  shipPath: string[]
  userShip: Ship

  events: SailEvent[]
  startTime: Date

  db: DatabaseType
  userId: string

  tilesObject: TilesObject
  enhancedShipPath: {
    x: number
    y: number
    xyTileId: string
    timeAtTile: number
  }[]
}

export const validateTileConflicts = async ({
  shipPath,
  db,
  userId,
  userShip,
  events,
  tilesObject,
  enhancedShipPath,
}: ValidationProps) => {
  for await (const [i, enhancedShipPathTile] of enhancedShipPath.entries()) {
    // Ignore the first and last tile (presumably they are cities)
    if (i === 0 || i === enhancedShipPath.length - 1) continue

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
      console.log("time at tile", enhancedShipPathTile.timeAtTile)
      const logText = `Your ship ${
        userShip.name
      } sank after sailing into a ${tileType.toLocaleLowerCase()}!`

      const newLog = {
        id: createId(),
        userId,
        shipId: userShip.id,
        text: logText,
        createdAt: new Date(enhancedShipPathTile.timeAtTile),
      }

      events.push({
        type: SAIL_EVENT_TYPES.SINK,
        triggerTime: enhancedShipPathTile.timeAtTile,
        log: newLog,
      })

      // Update the ship to be sunk
      await db
        .update(ship)
        .set({ isSunk: true })
        .where(eq(ship.id, userShip.id))

      // Add sinking event to the logs
      await db.insert(log).values(newLog)
    }
  }
}
