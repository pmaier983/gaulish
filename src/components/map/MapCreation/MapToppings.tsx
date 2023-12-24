import { useCallback, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import dynamic from "next/dynamic"
import toast from "react-hot-toast"

import { MapGroupedPixiTileBase } from "~/components/map/MapGroupedBaseTiles"
import { useElementSize } from "~/hooks/useElementSize"
import { useMapCreationStore } from "~/state/mapCreationStore"
import { getXYFromXYTileId } from "~/utils"
import type { Tile } from "schema"
import { DumbPixiShipPath } from "~/components/pixi/DumbPixiShipPath"
import { SHIP_TYPES, type ShipType } from "~/components/constants"
import { Select, SelectItem } from "~/components/ui/Select"
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select"

const MapWrapper = dynamic(
  () =>
    import("~/components/map/MapWrapper").then(
      (allExports) => allExports.MapWrapper_DO_NOT_USE_DIRECTLY,
    ),
  {
    ssr: false,
  },
)

interface NpcCreationForm {
  x: number
  y: number
  npcShipType: ShipType
}

// TODO: consider unifying with whats in useGamestate
const VALID_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "a",
  "s",
  "d",
  "Escape",
  "z",
]

interface MapToppingsProps {
  className?: string
  mapObject: { [xyTileId: string]: Tile }
}

export const MapToppings = ({ className, mapObject }: MapToppingsProps) => {
  const {
    mapWidth,
    mapHeight,
    mapArray,
    mapToppingAction,
    npcPathArray,
    startAddingNpcPath,
    cancelToppingAction,
    removeFromNpcPath,
    addToNpcPath,
  } = useMapCreationStore((state) => ({
    mapWidth: state.mapWidth,
    mapHeight: state.mapHeight,
    mapArray: state.mapArray,
    mapToppingAction: state.mapToppingAction,
    npcPathArray: state.npcPathArray,
    startAddingNpcPath: state.startAddingNpcPath,
    cancelToppingAction: state.cancelToppingAction,
    removeFromNpcPath: state.removeFromNpcPath,
    addToNpcPath: state.addToNpcPath,
  }))

  const { register, handleSubmit, formState } = useForm<NpcCreationForm>()
  const { size, sizeRef } = useElementSize()

  const onStartNPC: SubmitHandler<NpcCreationForm> = (data, e) => {
    e?.preventDefault()
    startAddingNpcPath(`${data.x}:${data.y}`)
  }

  const isMapFocused = mapToppingAction === "ADD_NPC"

  const npcPathHandler = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault()

      const currentTile = npcPathArray.at(-1)
      const { x, y } = getXYFromXYTileId(currentTile ?? "")

      if (!VALID_KEYS.includes(e.key)) {
        toast.error(
          "Use WASD or arrow keys to navigate the ship (or push ESC to cancel)",
        )
      }

      if (["ArrowUp", "w"].includes(e.key)) {
        const northTileId = `${x}:${y - 1}`
        if (mapObject.hasOwnProperty(northTileId)) {
          addToNpcPath(northTileId)
        }
      }
      if (["ArrowLeft", "a"].includes(e.key)) {
        const westTileId = `${x - 1}:${y}`
        if (mapObject.hasOwnProperty(westTileId)) {
          addToNpcPath(westTileId)
        }
      }
      if (["ArrowDown", "s"].includes(e.key)) {
        const southTileId = `${x}:${y + 1}`
        if (mapObject.hasOwnProperty(southTileId)) {
          addToNpcPath(southTileId)
        }
      }
      if (["ArrowRight", "d"].includes(e.key)) {
        const eastTileId = `${x + 1}:${y}`
        if (mapObject.hasOwnProperty(eastTileId)) {
          addToNpcPath(eastTileId)
        }
      }

      // TODO: how to get cmd-z functional
      // If CMD or z is pressed, undo the last move
      if (e.key === "z" || e.ctrlKey || e.metaKey) {
        removeFromNpcPath()
      }

      // If escape is pressed, cancel the ship path
      if (e.key === "Escape") {
        cancelToppingAction()
      }
    },
    [
      npcPathArray,
      mapObject,
      addToNpcPath,
      removeFromNpcPath,
      cancelToppingAction,
    ],
  )

  useEffect(() => {
    if (mapToppingAction === "ADD_NPC") {
      window.addEventListener("keyup", npcPathHandler)

      return () => {
        window.removeEventListener("keyup", npcPathHandler)
      }
    }
  }, [mapToppingAction, npcPathHandler])

  return (
    <div className={`${className} flex flex-1 flex-row gap-8 p-2`}>
      <div className={`relative flex flex-1 flex-col gap-2`} ref={sizeRef}>
        <MapWrapper
          mapHeight={size.height}
          mapWidth={size.width}
          className={`${
            isMapFocused ? "outline outline-8 outline-red-600" : ""
          }`}
        >
          <>
            <MapGroupedPixiTileBase mapArray={mapArray} />
            {npcPathArray.map((npcPath) => {
              const tile = mapObject[npcPath]

              if (!tile) {
                throw Error("mapArray has a tile that mapObject does not!")
              }

              return (
                <DumbPixiShipPath
                  key={`shipPath-${npcPath}`}
                  tile={tile}
                  shipPath={npcPathArray}
                />
              )
            })}
          </>
        </MapWrapper>
        <button
          className="absolute bottom-2 left-2 rounded border-2 border-black bg-red-300 p-2 hover:bg-red-400 disabled:hidden"
          onClick={() => {
            cancelToppingAction()
          }}
          disabled={mapToppingAction === undefined}
        >
          Cancel Map Topping Action
        </button>
        <button
          className="absolute bottom-2 right-2 rounded border-2 border-black bg-green-300 p-2 hover:bg-red-400 disabled:hidden"
          onClick={() => {
            // TODO: flesh out submit functionality
            switch (mapToppingAction) {
              case "ADD_NPC":
                toast.success("Submitted NPC Path")
                break
              default:
                toast.error("No action to submit")
            }
          }}
          disabled={true}
        >
          Submit Map Topping Action
        </button>
      </div>
      <div className="flex-1">
        {/* form to start submitting the npc stuff */}
        <form
          onSubmit={handleSubmit(onStartNPC)}
          className="flex items-center gap-2"
        >
          {/* Random Div to avoid flex messing with Select Styling */}
          <div className="rounded border border-black p-1">
            <Select {...register("npcShipType", { required: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Npc ShipType" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {Object.values(SHIP_TYPES).map((shipType) => (
                  <SelectItem
                    value={shipType}
                    key={shipType}
                    className="hover:cursor-pointer"
                  >
                    {shipType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label htmlFor="x">X:</label>
          <input
            {...register("x", { required: true, max: mapWidth, min: 0 })}
            type="number"
            className="w-12 border-2 border-black p-1"
          />
          <label htmlFor="y">Y:</label>
          <input
            {...register("y", { required: true, max: mapHeight, min: 0 })}
            type="number"
            className="w-12 border-2 border-black p-1"
          />
          <input
            type="submit"
            className="rounded border-2 border-green-900 bg-green-400 p-1 text-black disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  )
}
