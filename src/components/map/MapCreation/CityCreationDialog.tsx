import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { produce } from "immer"
import { useForm, type SubmitHandler } from "react-hook-form"
import { CARGO_TYPES_LIST, type CargoTypes } from "schema"
import * as z from "zod"
import * as Dialog from "@radix-ui/react-dialog"

import { DialogWrapper } from "~/components/dialogs/DialogWrapper"
import { Checkbox } from "~/components/ui/checkbox"
import { ImageIcon } from "~/components/ImageIcon"
import { useMapCreationStore } from "~/state/mapCreationStore"
import { getXYFromXYTileId } from "~/utils"

const DEFAULT_CARGO_MIDLINES: { [key in CargoTypes]: number } = {
  STONE: 50,
  WHEAT: 30,
  WOOD: 20,
  WOOL: 10,
}

const DEFAULT_CARGO_AMPLITUDES: { [key in CargoTypes]: number } = {
  STONE: 25,
  WHEAT: 15,
  WOOD: 8,
  WOOL: 5,
}

const cityCreationFormSchema = z.object({
  name: z.string().min(3),
  x: z.number().min(0),
  y: z.number().min(0),
  cargoArray: z
    .array(
      z.object({
        type: z.enum(CARGO_TYPES_LIST),
        midline: z.number().min(1),
        amplitude: z.number().min(1),
      }),
    )
    .min(1),
})

export const CityCreationDialog = ({
  toggleCityDialogOpenState,
}: {
  toggleCityDialogOpenState: () => void
}) => {
  const { addCity, cities } = useMapCreationStore((state) => ({
    addCity: state.addCity,
    cities: state.cities,
  }))

  const cityCreationForm = useForm<z.infer<typeof cityCreationFormSchema>>({
    resolver: zodResolver(cityCreationFormSchema),
    // For formState.isValid to work, we need to set mode to onChange
    // And also avoid using easy register methods like (min, max, required) etc.
    // Also we need to convert all numbers to actual numbers and not strings (setValueAs seen below)
    mode: "onChange",
    defaultValues: {
      cargoArray: [],
    },
  })

  const onCityCreation: SubmitHandler<
    z.infer<typeof cityCreationFormSchema>
  > = (data, e) => {
    e?.preventDefault()
    addCity({
      name: data.name,
      xyTileId: `${data.x}:${data.y}`,
      cityCargo: data.cargoArray.map((cargo) => ({
        ...cargo,
        isSelling: true,
      })),
    })
    // Close the dialog
    toggleCityDialogOpenState()
  }

  const toggleCargoType = ({ cargoType }: { cargoType: CargoTypes }) => {
    const currentCargoArray = cityCreationForm.getValues().cargoArray

    const hasCargoType =
      currentCargoArray.findIndex((cargo) => cargo.type === cargoType) >= 0

    if (hasCargoType) {
      const newCargoArray = currentCargoArray.filter(
        (cargo) => cargo.type !== cargoType,
      )

      cityCreationForm.setValue("cargoArray", newCargoArray, {
        shouldValidate: true,
      })
    } else {
      const newCargoArray = [
        ...currentCargoArray,
        {
          type: cargoType,
          midline: DEFAULT_CARGO_MIDLINES[cargoType],
          amplitude: DEFAULT_CARGO_AMPLITUDES[cargoType],
        },
      ]

      cityCreationForm.setValue("cargoArray", newCargoArray, {
        shouldValidate: true,
      })
    }
  }

  const updateCargoType = (newCargo: {
    cargoType: CargoTypes
    label: "midline" | "amplitude"
    value: number
  }) => {
    const currentCargoArray = cityCreationForm.getValues().cargoArray

    const newCargoArray = produce(currentCargoArray, (draftCargoArray) => {
      const cargoTypeIndex = draftCargoArray.findIndex(
        (cargo) => cargo.type === newCargo.cargoType,
      )

      const currentCargo = draftCargoArray[cargoTypeIndex]

      if (!currentCargo) throw Error("Cargo type not found!")

      draftCargoArray[cargoTypeIndex] = {
        ...currentCargo,
        [newCargo.label]: newCargo.value,
      }
    })

    cityCreationForm.setValue("cargoArray", newCargoArray, {
      shouldValidate: true,
    })
  }

  return (
    <DialogWrapper className="flex h-full max-h-[500px] min-h-[300px] w-full min-w-[330px] max-w-[85%] flex-col gap-2 p-3">
      <div className="flex flex-row gap-2">
        {cities.map((city) => {
          const { x, y } = getXYFromXYTileId(city.xyTileId)
          return (
            <button
              className="rounded border-2 border-black p-2"
              onClick={() => {
                cityCreationForm.setValue("name", city.name, {
                  shouldValidate: true,
                })
                cityCreationForm.setValue("x", x, { shouldValidate: true })
                cityCreationForm.setValue("y", y, { shouldValidate: true })
                cityCreationForm.setValue("cargoArray", city.cityCargo, {
                  shouldValidate: true,
                })
              }}
            >
              {city.name}
            </button>
          )
        })}
      </div>
      <div className="flex max-w-full flex-1 flex-row justify-between gap-2 max-sm:flex-col">
        <form
          onSubmit={cityCreationForm.handleSubmit(onCityCreation)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="name">City Name:</label>
            <input
              {...cityCreationForm.register("name")}
              className="rounded border-2 border-black p-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="x">X:</label>
            <input
              {...cityCreationForm.register("x", {
                setValueAs: (value: string) => parseInt(value),
              })}
              type="number"
              className="w-12 border-2 border-black p-1"
            />
            <label htmlFor="y">Y:</label>
            <input
              {...cityCreationForm.register("y", {
                setValueAs: (value: string) => parseInt(value),
              })}
              type="number"
              className="w-12 border-2 border-black p-1"
            />
          </div>
          <div className="flex flex-row flex-wrap items-center gap-2 pb-2 pt-2">
            {CARGO_TYPES_LIST.map((cargoType) => {
              const currentCargoArray = cityCreationForm.watch("cargoArray")

              const isEnabled =
                currentCargoArray.findIndex((val) => val.type === cargoType) >=
                0

              return (
                <div
                  key={cargoType}
                  className="flex flex-row items-center gap-2 border-r-2 border-black p-3"
                >
                  <Checkbox
                    checked={isEnabled}
                    onCheckedChange={() => {
                      toggleCargoType({ cargoType })
                    }}
                    className="h-6 w-6"
                  />
                  <ImageIcon
                    icon={cargoType}
                    className={isEnabled ? "" : "brightness-75 grayscale"}
                  />
                  <label htmlFor={`${cargoType}-midline`}>Midline</label>
                  <input
                    onChange={(e) => {
                      const newMidline = e.target.value

                      updateCargoType({
                        cargoType,
                        label: "midline",
                        value: parseInt(newMidline),
                      })
                    }}
                    type="number"
                    disabled={!isEnabled}
                    defaultValue={DEFAULT_CARGO_MIDLINES[cargoType]}
                    className="w-16 border-2 border-black pl-2 pr-2 disabled:cursor-not-allowed disabled:brightness-50 disabled:grayscale"
                  />
                  <label htmlFor={`${cargoType}-Amplitude`}>Amplitude</label>
                  <input
                    onChange={(e) => {
                      const newAmplitude = e.target.value

                      updateCargoType({
                        cargoType,
                        label: "amplitude",
                        value: parseInt(newAmplitude),
                      })
                    }}
                    type="number"
                    disabled={!isEnabled}
                    defaultValue={DEFAULT_CARGO_AMPLITUDES[cargoType]}
                    className="w-16 border-2 border-black pl-2 pr-2 disabled:cursor-not-allowed disabled:brightness-50 disabled:grayscale"
                  />
                </div>
              )
            })}
          </div>
          <input
            type="submit"
            value="Create/Update City"
            className="rounded border-2 border-red-900 bg-red-400 p-1 text-black hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!cityCreationForm.formState.isValid}
          />
        </form>
      </div>
    </DialogWrapper>
  )
}
