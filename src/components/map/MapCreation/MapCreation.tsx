import React, { useState } from "react"
import type { Tile } from "schema"

interface MapCreationProps {
  className?: string
  mapArray: Tile[]
  mapObject: { [xyTileId: string]: Tile }
  setMapArray: (newMapArray: Tile[]) => void
  mapSize: number
  setMapSize: (newSize: number) => void
}

interface ColorData {
  r: number
  g: number
  b: number
  a: number
}

export const MapCreation = ({ className }: MapCreationProps) => {
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
      ctx.drawImage(img, 0, 0)
      // rawPixelData is in the form: [R, G, B, A, R, G, B, A, ...]
      const rawPixelData = ctx.getImageData(0, 0, img.width, img.height).data

      const tempColorsArray = []

      for (let i = 0; i < rawPixelData.length; i += 4) {
        const r = rawPixelData[i]!
        const g = rawPixelData[i + 1]!
        const b = rawPixelData[i + 2]!
        const a = rawPixelData[i + 3]!

        tempColorsArray.push({ r, g, b, a })
      }

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
    <div className={`${className}`}>
      <div className="h-8" />
      <input type="file" onChange={loadImagePixels} accept="image/*" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imageSrc && <img src={imageSrc} alt="Uploaded" />}
    </div>
  )
}
