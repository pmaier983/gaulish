import { type ComponentPropsWithRef } from "react"

interface CityTradeCardProps extends ComponentPropsWithRef<"div"> {}

export const CityTradeCard = ({ className }: CityTradeCardProps) => {
  return (
    <div
      className={`flex min-w-[200px] flex-1 rounded outline outline-1 outline-black ${className}`}
    >
      Hello
    </div>
  )
}
