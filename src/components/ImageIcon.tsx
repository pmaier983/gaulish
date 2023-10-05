import Image, { type ImageProps } from "next/image"
import { forwardRef } from "react"
import { SHIP_TYPES } from "~/components/constants"

const IMAGE_ICONS_PURE = {
  CARGO: "CARGO",
  GOLD: "GOLD",
  SHIP: "SHIP",
  STONE: "STONE",
  WHEAT: "WHEAT",
  WOOD: "WOOD",
  WOOL: "WOOL",
} as const

export const IMAGE_ICONS = { ...IMAGE_ICONS_PURE, ...SHIP_TYPES } as const

export type IMAGE_ICON = keyof typeof IMAGE_ICONS

export const IMAGE_ICONS_TO_DETAILS: {
  [key in IMAGE_ICON]: {
    path: string
    alt: string
    defaultSize: number
  }
} = {
  [IMAGE_ICONS.CARGO]: {
    path: "/assets/icons/cargo.webp",
    alt: "Barrel icon indicating Cargo",
    defaultSize: 24,
  },
  [IMAGE_ICONS.GOLD]: {
    path: "/assets/icons/gold.webp",
    alt: "Small gold coin",
    defaultSize: 24,
  },
  [IMAGE_ICONS.SHIP]: {
    path: "/assets/icons/ship.webp",
    alt: "Generic ship icon",
    defaultSize: 24,
  },
  [IMAGE_ICONS.STONE]: {
    path: "/assets/icons/stone.webp",
    alt: "Two small grey stones",
    defaultSize: 24,
  },
  [IMAGE_ICONS.WHEAT]: {
    path: "/assets/icons/wheat.webp",
    alt: "A single wheat tuft",
    defaultSize: 24,
  },
  [IMAGE_ICONS.WOOD]: {
    path: "/assets/icons/wood.webp",
    alt: "Three logs stacked together",
    defaultSize: 24,
  },
  [IMAGE_ICONS.WOOL]: {
    path: "/assets/icons/wool.webp",
    alt: "A cute little sheep",
    defaultSize: 24,
  },
  [IMAGE_ICONS.FRIGATE]: {
    path: "/assets/ships/frigate.webp",
    alt: "A grey and white british frigate",
    defaultSize: 32,
  },
  [IMAGE_ICONS.LONGSHIP]: {
    path: "/assets/ships/longship.webp",
    alt: "A viking longship with its sail unfurled",
    defaultSize: 32,
  },
  [IMAGE_ICONS.PLANK]: {
    path: "/assets/ships/plank.webp",
    alt: "A singular brown plank",
    defaultSize: 32,
  },
  [IMAGE_ICONS.RAFT]: {
    path: "/assets/ships/raft.webp",
    alt: "Three logs strapped together to form a raft",
    defaultSize: 32,
  },
  [IMAGE_ICONS.SLOOP]: {
    path: "/assets/ships/sloop.webp",
    alt: "A single triangular sailed sloop",
    defaultSize: 32,
  },
}

interface ImageIconProps
  extends Omit<ImageProps, "src" | "alt" | "width" | "height"> {
  icon: IMAGE_ICON
  size?: ImageProps["width"]

  src?: ImageProps["src"]
  alt?: ImageProps["alt"]
  width?: ImageProps["width"]
  height?: ImageProps["height"]
  className?: string
}

export const ImageIcon = forwardRef<HTMLImageElement, ImageIconProps>(
  ({ icon, size, className }, forwardRef) => {
    const details = IMAGE_ICONS_TO_DETAILS[icon]
    const widthAndHeight = size ?? details.defaultSize
    return (
      <Image
        // TODO: handle the min width and height size better then this!
        className={`h-fit rounded-md outline outline-1 outline-black ${className}`}
        src={details.path}
        alt={details.alt}
        width={widthAndHeight}
        height={widthAndHeight}
        ref={forwardRef}
      />
    )
  },
)

ImageIcon.displayName = "ImageIcon"
