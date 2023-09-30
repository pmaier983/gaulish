import {
  ExchangeButton,
  type ExchangeButtonProps,
} from "~/components/Button/ExchangeButton"
import {
  ExitButton,
  type ExitButtonProps,
} from "~/components/Button/ExitButton"
import {
  SailButton,
  type SailButtonProps,
} from "~/components/Button/SailButton"
import {
  SwapButton,
  type SwapButtonProps,
} from "~/components/Button/SwapButton"
import {
  TradeButton,
  type TradeButtonProps,
} from "~/components/Button/TradeButton"

export const BUTTON_TYPES = {
  EXCHANGE_BUTTON: "EXCHANGE_BUTTON",
  EXIT_BUTTON: "EXIT_BUTTON",
  PURCHASE_PRICE_BUTTON: "PURCHASE_PRICE_BUTTON",
  SAIL_BUTTON: "SAIL_BUTTON",
  SWAP_BUTTON: "SWAP_BUTTON",
  TRADE_BUTTON: "TRADE_BUTTON",
} as const

export type ButtonType = keyof typeof BUTTON_TYPES

export type ButtonProps =
  | {
      type: "EXCHANGE_BUTTON"
      buttonProps: ExchangeButtonProps
    }
  | {
      type: "EXIT_BUTTON"
      buttonProps: ExitButtonProps
    }
  | {
      type: "SAIL_BUTTON"
      buttonProps: SailButtonProps
    }
  | {
      type: "SWAP_BUTTON"
      buttonProps: SwapButtonProps
    }
  | {
      type: "TRADE_BUTTON"
      buttonProps: TradeButtonProps
    }

// TODO: This is not really functional... I'm not sure it should be either
// I think this might be a bad pattern
export const Button = (props: ButtonProps) => {
  switch (props.type) {
    case BUTTON_TYPES.EXCHANGE_BUTTON:
      return <ExchangeButton {...props.buttonProps} />
    case BUTTON_TYPES.EXIT_BUTTON:
      return <ExitButton {...props.buttonProps} />
    case BUTTON_TYPES.SAIL_BUTTON:
      return <SailButton {...props.buttonProps} />
    case BUTTON_TYPES.SWAP_BUTTON:
      return <SwapButton {...props.buttonProps} />
    default:
    case BUTTON_TYPES.TRADE_BUTTON:
      return <TradeButton {...props.buttonProps} />
  }
}
