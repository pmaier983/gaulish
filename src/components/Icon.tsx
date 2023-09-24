import { type ComponentPropsWithRef } from "react"

/**
 * WHEN CHANGING ICONS ALSO CHANGE ICONS.SVG & VISA VERSA
 */
export const ICONS = {
  x: "x",
  arrowRight: "arrow-right",
  arrowLeft: "arrow-left",
  "edit-3": "edit-3",
  map: "map",
  trade: "trade",
  arrowRightCircle: "arrow-right-circle",
} as const

export type ICON = keyof typeof ICONS

interface IconProps extends ComponentPropsWithRef<"svg"> {
  id: ICON
  size?: ComponentPropsWithRef<"svg">["width"]
}

// Inspired by this article: https://benadam.me/thoughts/react-svg-sprites/
// TODO: decide if this is the best svg method, or another way would be better?
export const Icon = (props: IconProps) => (
  <svg
    height={props.size ?? 24}
    width={props.size ?? 24}
    strokeWidth={props.strokeWidth ?? "2"}
    {...props}
  >
    <use href={`/icons.svg#${ICONS[props.id]}`} />
  </svg>
)
