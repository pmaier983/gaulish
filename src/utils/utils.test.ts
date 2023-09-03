import { SHIP_TYPE_TO_SHIP_PROPERTIES } from "./../components/constants"
import { describe, expect, test } from "@jest/globals"
import { hasNpcUserCollision } from "./utils"
import { type Path, type Npc } from "schema"
import { SHIP_TYPES } from "~/components/constants"

const fakeNpc: Npc = {
  id: 1,
  pathId: null,
  shipType: SHIP_TYPES.PLANK,
  name: "Test Ship",
  speed: SHIP_TYPE_TO_SHIP_PROPERTIES[SHIP_TYPES.PLANK]!.speed,
}

const fakeNpcPath: Omit<Path, "pathArray"> = {
  id: "npcPathTestId",
  createdAt: new Date(0),
}

/**
 * Drawing out a map to make this a bit easier
 *
 * 0:0 1:0 2:0
 * 0:1 1:1 2:1
 *
 */

describe("Utils Tests - ", () => {
  describe("hasNpcUserCollision:", () => {
    describe("resister's NO COLLISION when", () => {
      test("NPC and User are on separate paths", () => {
        const hasCollision = hasNpcUserCollision({
          userStartTimeMsAtTile: 0,
          userEndTimeMsAtTile: 1000,
          userXYTileId: "0:0",
          npc: fakeNpc,
          npcPath: {
            ...fakeNpcPath,
            pathArray: ["0:1", "1:1", "2:1"],
          },
        })
        expect(hasCollision).toBe(false)
      })

      test("NPC and User are on the same path but far apart in time", () => {
        const hasCollision = hasNpcUserCollision({
          userStartTimeMsAtTile: 0,
          userEndTimeMsAtTile: 1000,
          userXYTileId: "1:1",
          npc: fakeNpc,
          npcPath: {
            ...fakeNpcPath,
            pathArray: ["0:1", "1:1", "2:1"],
          },
        })
        expect(hasCollision).toBe(false)
      })

      test("NPC barely misses a User", () => {
        const hasCollision = hasNpcUserCollision({
          userStartTimeMsAtTile: 0,
          userEndTimeMsAtTile: 1000,
          userXYTileId: "1:1",
          npc: fakeNpc,
          npcPath: {
            ...fakeNpcPath,
            pathArray: ["0:1", "1:1", "2:1"],
          },
        })
        expect(hasCollision).toBe(false)
      })

      test("NPC barely misses a distant User", () => {
        const hasCollision = hasNpcUserCollision({
          userStartTimeMsAtTile: 0,
          userEndTimeMsAtTile: 2000,
          userXYTileId: "2:1",
          npc: fakeNpc,
          npcPath: {
            ...fakeNpcPath,
            pathArray: ["0:1", "1:1", "2:1"],
          },
        })
        expect(hasCollision).toBe(false)
      })
    })

    describe("resister's A COLLISION when", () => {
      test("NPC and User are on the same path", () => {
        const hasCollision = hasNpcUserCollision({
          userStartTimeMsAtTile: 0,
          userEndTimeMsAtTile: 1000,
          userXYTileId: "0:1",
          npc: fakeNpc,
          npcPath: {
            ...fakeNpcPath,
            pathArray: ["0:1", "1:1", "2:1"],
          },
        })
        expect(hasCollision).toBe(true)
      })

      test("NPC barely catches a User", () => {
        const hasCollision = hasNpcUserCollision({
          userStartTimeMsAtTile: 0,
          userEndTimeMsAtTile: 1001,
          userXYTileId: "1:1",
          npc: fakeNpc,
          npcPath: {
            ...fakeNpcPath,
            pathArray: ["0:1", "1:1", "2:1"],
          },
        })
        expect(hasCollision).toBe(true)
      })

      test("NPC barely catches a distant User", () => {
        const hasCollision = hasNpcUserCollision({
          userStartTimeMsAtTile: 0,
          userEndTimeMsAtTile: 2001,
          userXYTileId: "2:1",
          npc: fakeNpc,
          npcPath: {
            ...fakeNpcPath,
            pathArray: ["0:1", "1:1", "2:1"],
          },
        })
        expect(hasCollision).toBe(true)
      })
    })
  })
})
