import * as RadixSlider from "@radix-ui/react-slider"

export interface SliderProps extends RadixSlider.SliderProps {
  label: string
}

export const Slider = ({ label, className = "", ...rest }: SliderProps) => {
  return (
    <RadixSlider.Root
      className={`relative flex flex-1 cursor-pointer touch-none select-none items-center ${className}`}
      {...rest}
    >
      <RadixSlider.Track className="relative h-2 flex-1 rounded bg-slate-400 data-[disabled]:opacity-50">
        <RadixSlider.Range className="absolute h-full rounded bg-amber-400" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        aria-label={label}
        className="m-3 block h-5 w-5 rounded-full bg-amber-900 hover:bg-amber-600 active:bg-amber-400 data-[disabled]:opacity-0"
      />
    </RadixSlider.Root>
  )
}
