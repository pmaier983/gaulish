import { useForm, type SubmitHandler } from "react-hook-form"
import dynamic from "next/dynamic"
import type { Tile } from "schema"

import { MapGroupedPixiTileBase } from "~/components/map/MapGroupedBaseTiles"
import { useElementSize } from "~/hooks/useElementSize"
import { useMapCreationStore } from "~/state/mapCreationStore"

const MapWrapper = dynamic(
  () =>
    import("~/components/map/MapWrapper").then(
      (allExports) => allExports.MapWrapper_DO_NOT_USE_DIRECTLY,
    ),
  {
    ssr: false,
  },
)

interface MapToppingsProps {
  className?: string
  mapObject: { [xyTileId: string]: Tile }
}

interface Coordinates {
  x: number
  y: number
}

export const MapToppings = ({ className }: MapToppingsProps) => {
  const { mapWidth, mapHeight, mapArray, setMapToppingAction } =
    useMapCreationStore((state) => ({
      mapWidth: state.mapWidth,
      mapHeight: state.mapHeight,
      mapArray: state.mapArray,

      setMapToppingAction: state.setMapToppingAction,
    }))
  const { register, handleSubmit, formState } = useForm<Coordinates>()
  const { size, sizeRef } = useElementSize()

  const onStartNPC: SubmitHandler<Coordinates> = (data, e) => {
    e?.preventDefault()
    setMapToppingAction("ADD_NPC")
  }

  return (
    <div className={`${className} flex flex-1 flex-row gap-8 p-8`}>
      <div className="flex flex-1" ref={sizeRef}>
        <MapWrapper mapHeight={size.height} mapWidth={size.width}>
          <MapGroupedPixiTileBase mapArray={mapArray} />
        </MapWrapper>
      </div>
      <div className="flex-1">
        {/* form to start submitting the npc stuff */}
        <form
          onSubmit={handleSubmit(onStartNPC)}
          className="flex flex-row items-center gap-2"
        >
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
            className="rounded border-2 border-green-900 bg-green-400 p-1 text-black hover:cursor-pointer hover:bg-green-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  )
}
