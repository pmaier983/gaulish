import { type SVGAttributes } from "react"

/**
 * WHEN CHANGING ICONS ALSO CHANGE ICONS.SVG & VISA VERSA
 */
export const ICONS = {
  x: "x",
  arrowRight: "arrow-right",
} as const

export type ICON = keyof typeof ICONS

interface IconProps extends SVGAttributes<SVGSVGElement> {
  id: ICON
}

// Inspired by this article: https://benadam.me/thoughts/react-svg-sprites/
// TODO: decide if this is the best svg method, or another way would be better?
export const Icon = (props: IconProps) => {
  return (
    <svg height={24} width={24} {...props}>
      <use href={`/icons.svg#${ICONS[props.id]}`} />
    </svg>
  )
}
