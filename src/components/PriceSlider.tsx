import * as Slider from "@radix-ui/react-slider"

interface PriceSliderProps extends Slider.SliderProps {
  className?: string
}

export const PriceSlider = ({ className, ...rest }: PriceSliderProps) => {
  return (
    <Slider.Root
      className={`relative flex flex-1 touch-none select-none items-center ${className}`}
      {...rest}
    >
      <Slider.Track className="relative h-2 flex-1 rounded bg-slate-400">
        <Slider.Range className="absolute h-full rounded bg-amber-400" />
      </Slider.Track>
      <Slider.Thumb
        className="block h-4 w-4 rounded-full bg-amber-900"
        aria-label="Volume"
      />
    </Slider.Root>
  )
}
