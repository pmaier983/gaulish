import { type SVGAttributes } from "react"

/**
 * WHEN CHANGING ICONS ALSO CHANGE ICONS.SVG & VISA VERSA
 */
export const ICONS = {
  x: "x",
  arrowRight: "arrow-right",
  arrowLeft: "arrow-left",
  "edit-3": "edit-3",
} as const

export type ICON = keyof typeof ICONS

interface IconProps extends SVGAttributes<SVGSVGElement> {
  id: ICON
  size?: SVGAttributes<SVGSVGElement>["width"]
}

// Inspired by this article: https://benadam.me/thoughts/react-svg-sprites/
// TODO: decide if this is the best svg method, or another way would be better?
export const Icon = (props: IconProps) => (
  <svg
    height={props.size ?? props.width ?? 24}
    width={props.size ?? props.height ?? 24}
    {...props}
  >
    <use href={`/icons.svg#${ICONS[props.id]}`} />
  </svg>
)
