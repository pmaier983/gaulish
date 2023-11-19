import type { Tile } from "schema"
import type { SetMapCreationMode } from "~/components/map/MapCreation/constants"

interface MapToppingsProps {
  className?: string
  mapArray: Tile[]
  setMapCreationMode: SetMapCreationMode
  setMapArray: (newMapArray: Tile[]) => void
  mapSize: number
  setMapSize: (newSize: number) => void
}

export const MapToppings = ({ className }: MapToppingsProps) => {
  return <div className={`${className}`}></div>
}
