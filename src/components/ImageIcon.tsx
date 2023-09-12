import Image, { type ImageProps } from "next/image"

export const IMAGE_ICONS = {
  CARGO: "CARGO",
  GOLD: "GOLD",
  SHIP: "SHIP",
  STONE: "STONE",
  WHEAT: "WHEAT",
  WOOD: "WOOD",
  WOOL: "WOOL",
  FRIGATE: "FRIGATE",
  LONGSHIP: "LONGSHIP",
  PLANK: "PLANK",
  RAFT: "RAFT",
  SLOOP: "SLOOP",
} as const

export type IMAGE_ICON = keyof typeof IMAGE_ICONS

export const IMAGE_ICONS_TO_DETAILS = {
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
  id: IMAGE_ICON
  size?: ImageProps["width"]

  src?: ImageProps["src"]
  alt?: ImageProps["alt"]
  width?: ImageProps["width"]
  height?: ImageProps["height"]
}

export const ImageIcon = ({ id, size }: ImageIconProps) => {
  const details = IMAGE_ICONS_TO_DETAILS[id]
  return (
    <Image
      className="rounded-md outline outline-1 outline-black"
      src={details.path}
      alt={details.alt}
      width={size ?? details.defaultSize}
      height={size ?? details.defaultSize}
    />
  )
}