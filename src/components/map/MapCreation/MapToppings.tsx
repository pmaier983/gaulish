import { useCallback, useEffect, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import dynamic from "next/dynamic"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select"
import * as z from "zod"
import * as Dialog from "@radix-ui/react-dialog"

import { MapGroupedPixiTileBase } from "~/components/map/MapGroupedBaseTiles"
import { useElementSize } from "~/hooks/useElementSize"
import { useMapCreationStore } from "~/state/mapCreationStore"
import { getXYFromXYTileId } from "~/utils"
import type { Tile } from "schema"
import { DumbPixiShipPath } from "~/components/pixi/DumbPixiShipPath"
import { SHIP_TYPES, type ShipType } from "~/components/constants"
import { Select, SelectItem } from "~/components/ui/Select"
import { DumbPixiNpcPath } from "~/components/pixi/DumbPixiNpcPath"
import { CityCreationDialog } from "~/components/map/MapCreation/CityCreationDialog"
import { DumbPixiCity } from "~/components/pixi/DumbPixiCity"

const MapWrapper = dynamic(
  () =>
    import("~/components/map/MapWrapper").then(
      (allExports) => allExports.MapWrapper_DO_NOT_USE_DIRECTLY,
    ),
  {
    ssr: false,
  },
)

const npcCreationFormSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
  npcShipType: z.nativeEnum(SHIP_TYPES),
})

const npcRemovalFormSchema = z.object({
  id: z.number().min(0),
})

const cityRemovalFormSchema = z.object({
  id: z.number().min(0),
})

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
  const [isNpcsPathsVisible, setNpcsPathsVisibility] = useState(false)
  const mapCreationState = useMapCreationStore((state) => state)
  const {
    mapArray,
    mapToppingAction,
    npcPathArray,
    npcs,
    cities,
    startAddNpcToppingAction,
    cancelToppingAction,
    removeFromNpcPath,
    addToNpcPath,
    removeNpc,
    removeCity,
    submitAddNpcToppingAction,
  } = mapCreationState

  const createNpcForm = useForm<z.infer<typeof npcCreationFormSchema>>({
    resolver: zodResolver(npcCreationFormSchema),
    // For formState.isValid to work, we need to set mode to onChange
    // And also avoid using easy register methods like (min, max, required) etc.
    // Also we need to convert all numbers to actual numbers and not strings (setValueAs seen below)
    mode: "onChange",
  })

  const removeNpcForm = useForm<z.infer<typeof npcRemovalFormSchema>>({
    resolver: zodResolver(npcRemovalFormSchema),
    // For formState.isValid to work, we need to set mode to onChange
    // And also avoid using easy register methods like (min, max, required) etc.
    // Also we need to convert all numbers to actual numbers and not strings (setValueAs seen below)
    mode: "onChange",
  })

  const cityRemovalForm = useForm<z.infer<typeof cityRemovalFormSchema>>({
    resolver: zodResolver(cityRemovalFormSchema),
    // For formState.isValid to work, we need to set mode to onChange
    // And also avoid using easy register methods like (min, max, required) etc.
    // Also we need to convert all numbers to actual numbers and not strings (setValueAs seen below)
    mode: "onChange",
  })

  const [isCityDialogOpen, setCityDialogOpenState] = useState(false)
  const toggleCityDialogOpenState = (newIsOpenState?: boolean) => {
    if (typeof newIsOpenState === "boolean") {
      setCityDialogOpenState(newIsOpenState)
      return
    }
    setCityDialogOpenState((prevIsOpenState) => !prevIsOpenState)
  }

  const { size, sizeRef } = useElementSize()

  const onStartNPC: SubmitHandler<z.infer<typeof npcCreationFormSchema>> = (
    data,
    e,
  ) => {
    e?.preventDefault()
    startAddNpcToppingAction({
      initialXYTileId: `${data.x}:${data.y}`,
      shipType: data.npcShipType,
    })
  }

  const onRemoveNPC: SubmitHandler<z.infer<typeof npcRemovalFormSchema>> = (
    data,
    e,
  ) => {
    e?.preventDefault()
    removeNpc(data.id)
  }

  const onRemoveCity: SubmitHandler<z.infer<typeof cityRemovalFormSchema>> = (
    data,
    e,
  ) => {
    e?.preventDefault()
    removeCity(data.id)
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
    <div className={`${className} flex flex-1 flex-col-reverse gap-8 p-2`}>
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
            <DumbPixiShipPath shipPath={npcPathArray} />
            {npcs.map((npc) => (
              <DumbPixiNpcPath
                npc={npc}
                key={npc.id}
                isPathVisible={isNpcsPathsVisible}
              />
            ))}
            {cities.map((city) => (
              <DumbPixiCity city={city} key={city.id} />
            ))}
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
                submitAddNpcToppingAction()
                break
              default:
                toast.error("No action to submit")
            }
          }}
          disabled={mapToppingAction === undefined}
        >
          Submit Map Topping Action
        </button>
      </div>
      <div className="flex flex-row flex-wrap gap-10">
        {/* form to start submitting the npc stuff */}
        <form
          onSubmit={createNpcForm.handleSubmit(onStartNPC)}
          className="z isolate flex items-center gap-2"
        >
          {/* Random Div to avoid flex messing with Select Styling */}
          <div className="rounded border border-black p-1">
            <Select
              // TODO: setup validation to ensure 100% of the time this is ShipType
              onValueChange={(value: ShipType) =>
                createNpcForm.setValue("npcShipType", value, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Npc ShipType" />
              </SelectTrigger>
              <SelectContent position="item-aligned" className="bg-white">
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
            {...createNpcForm.register("x", {
              setValueAs: (value: string) => parseInt(value),
            })}
            type="number"
            className="w-12 border-2 border-black p-1"
          />
          <label htmlFor="y">Y:</label>
          <input
            {...createNpcForm.register("y", {
              setValueAs: (value: string) => parseInt(value),
            })}
            type="number"
            className="w-12 border-2 border-black p-1"
          />
          <input
            type="submit"
            className="rounded border-2 border-green-900 bg-green-400 p-1 text-black disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!createNpcForm.formState.isValid}
          />
        </form>
        <button
          onClick={() => {
            setNpcsPathsVisibility(!isNpcsPathsVisible)
          }}
          className="rounded border-2 border-yellow-900 bg-yellow-400 p-1 text-black"
        >
          Toggle NPCs Paths
        </button>
        <form
          onSubmit={removeNpcForm.handleSubmit(onRemoveNPC)}
          className="z isolate flex items-center gap-2"
        >
          <label htmlFor="id">Ship To Remove:</label>
          <input
            {...removeNpcForm.register("id", {
              setValueAs: (value: string) => parseInt(value),
            })}
            type="number"
            className="w-12 border-2 border-black p-1"
          />
          <input
            type="submit"
            className="rounded border-2 border-red-900 bg-red-400 p-1 text-black hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!removeNpcForm.formState.isValid}
          />
        </form>
        <form
          onSubmit={cityRemovalForm.handleSubmit(onRemoveCity)}
          className="z isolate flex items-center gap-2"
        >
          <label htmlFor="id">City To Remove:</label>
          <input
            {...cityRemovalForm.register("id", {
              setValueAs: (value: string) => parseInt(value),
            })}
            type="number"
            className="w-12 border-2 border-black p-1"
          />
          <input
            type="submit"
            className="rounded border-2 border-red-900 bg-red-400 p-1 text-black hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!cityRemovalForm.formState.isValid}
          />
        </form>
        <Dialog.Root
          open={isCityDialogOpen}
          onOpenChange={toggleCityDialogOpenState}
        >
          <Dialog.Trigger className="rounded border-2 border-green-900 bg-green-400 p-1 text-black disabled:cursor-not-allowed disabled:opacity-50">
            Create City
          </Dialog.Trigger>
          <CityCreationDialog
            toggleCityDialogOpenState={toggleCityDialogOpenState}
          />
        </Dialog.Root>
      </div>
    </div>
  )
}
