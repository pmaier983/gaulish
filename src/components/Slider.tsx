import * as RadixSlider from "@radix-ui/react-slider"

export interface SliderProps extends RadixSlider.SliderProps {
  label: string
}

export const Slider = ({ label, className = "", ...rest }: SliderProps) => {
  return (
    <RadixSlider.Root
      className={`relative flex flex-1 touch-none select-none items-center ${className}`}
      {...rest}
    >
      <RadixSlider.Track className="relative h-2 flex-1 rounded bg-slate-400 data-[disabled]:opacity-50">
        <RadixSlider.Range className="absolute h-full rounded bg-amber-400" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="block h-4 w-4 rounded-full bg-amber-900 data-[disabled]:opacity-0"
        aria-label={label}
      />
    </RadixSlider.Root>
  )
}
