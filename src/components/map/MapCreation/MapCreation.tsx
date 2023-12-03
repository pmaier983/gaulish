import NextImage from "next/image"
import React, { useState } from "react"
import type { Tile } from "schema"
import { RGB_TO_TILE_TYPE, type ColorData } from "~/components/constants"

import { useMapCreationStore } from "~/state/mapCreationStore"

interface MapCreationProps {
  className?: string
  mapObject: { [xyTileId: string]: Tile }
}

const getIsValidMap = (colorMapData: ColorData[]) => {
  if (colorMapData.length === 0) return false

  // Limit tile max to 100k
  if (colorMapData.length > 100000) return false

  for (let i = 0; i < colorMapData.length; i++) {
    const rgbColor = colorMapData[i]
    if (!rgbColor) return false
    const colorKey = Object.values(rgbColor).join(":")
    if (!RGB_TO_TILE_TYPE[colorKey]) {
      return false
    }
  }
  return true
}

export const MapCreation = ({ className }: MapCreationProps) => {
  const { setMapArray, setMapCreationMode } = useMapCreationStore((state) => ({
    setMapArray: state.setMapArray,
    setMapCreationMode: state.setMapCreationMode,
  }))
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 })
  const [imageSrc, setImageSrc] = useState<string>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colorsArray, setColorsArray] = useState<ColorData[]>()

  const extractPixelData = (imageSrc: string) => {
    if (!imageSrc) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      setMapSize({ width: img.width, height: img.height })
      ctx.drawImage(img, 0, 0)

      // rawPixelData is in the form: [R, G, B, A, R, G, B, A, ...]
      const rawPixelData = ctx.getImageData(0, 0, img.width, img.height).data

      const tempColorsArray = []

      for (let i = 0; i < rawPixelData.length; i += 4) {
        const r = rawPixelData[i]!
        const g = rawPixelData[i + 1]!
        const b = rawPixelData[i + 2]!

        tempColorsArray.push({ r, g, b })
      }

      console.log(tempColorsArray)
      setColorsArray(tempColorsArray)
    }

    img.src = imageSrc
  }

  const loadImagePixels = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    if (!file) {
      throw Error("No file found")
    }

    const reader = new FileReader()

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string)
        extractPixelData(event.target.result as string)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div
      className={`${className} flex flex-1 flex-col items-center justify-center gap-5 p-8`}
    >
      <input type="file" onChange={loadImagePixels} accept="image/*" />
      <div className="relative h-1/2 w-1/2 bg-gray-500">
        {imageSrc && <NextImage src={imageSrc} alt="uploaded image" fill />}
      </div>
      <button
        className="rounded bg-green-500 p-2 hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => {
          if (!colorsArray)
            throw Error("Trying to populate map without a colorArray")
          const newMap = colorsArray.map((rgbColor, i) => {
            const xIndex = i % mapSize.width
            const yIndex = Math.floor(i / mapSize.width)
            const xyTileId = `${xIndex}:${yIndex}`
            const type = RGB_TO_TILE_TYPE[Object.values(rgbColor).join(":")]!

            if (!type) throw Error("Invalid type")

            return {
              type,
              xyTileId,
              x: xIndex,
              y: yIndex,
            }
          })

          setMapCreationMode("MAP_TOPPINGS")
          setMapArray(newMap)
        }}
        disabled={!getIsValidMap(colorsArray || [])}
      >
        Populate Map
      </button>
    </div>
  )
}
