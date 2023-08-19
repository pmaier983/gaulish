import Tippy, { type TippyProps } from "@tippyjs/react"

import "tippy.js/dist/tippy.css"

export const Tooltip = (props: TippyProps) => {
  return <Tippy {...props} />
}
