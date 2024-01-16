import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { produce } from "immer"
import { useForm, type SubmitHandler } from "react-hook-form"
import { CARGO_TYPES_LIST, type CargoTypes } from "schema"
import * as z from "zod"

import { DialogWrapper } from "~/components/dialogs/DialogWrapper"
import { Checkbox } from "~/components/ui/checkbox"
import { ImageIcon } from "~/components/ImageIcon"

const cityCreationFormSchema = z.object({
  name: z.string().min(3),
  cargoArray: z.array(
    z.object({
      type: z.enum(CARGO_TYPES_LIST),
      midline: z.number().min(1),
      amplitude: z.number().min(1),
    }),
  ),
})

export const CityCreationDialog = () => {
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
    // TODO: adjust localStorage & state on city creation
  }

  const toggleCargoType = ({ cargoType }: { cargoType: CargoTypes }) => {
    console.log("eh")
    const currentCargoArray = cityCreationForm.getValues().cargoArray

    const hasCargoType =
      currentCargoArray.findIndex((cargo) => cargo.type === cargoType) >= 0

    if (hasCargoType) {
      const newCargoArray = currentCargoArray.filter(
        (cargo) => cargo.type !== cargoType,
      )

      cityCreationForm.setValue("cargoArray", newCargoArray)
    } else {
      const newCargoArray = [
        ...currentCargoArray,
        {
          type: cargoType,
          midline: 1,
          amplitude: 1,
        },
      ]

      cityCreationForm.setValue("cargoArray", newCargoArray)
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

    cityCreationForm.setValue("cargoArray", newCargoArray)
  }

  return (
    <DialogWrapper className="flex h-full max-h-[500px] min-h-[300px] w-full min-w-[330px] max-w-[85%] p-3">
      <div className="flex max-w-full flex-1 flex-row justify-between gap-2 max-sm:flex-col">
        <form
          onSubmit={cityCreationForm.handleSubmit(onCityCreation)}
          className="flex flex-col"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="name">City Name:</label>
            <input
              {...cityCreationForm.register("name")}
              className="w-12 border-2 border-black p-1"
            />
          </div>
          <div className="flex flex-row items-center gap-3 pb-2 pt-2">
            {CARGO_TYPES_LIST.map((cargoType) => {
              const currentCargoArray = cityCreationForm.watch("cargoArray")

              const isEnabled =
                currentCargoArray.findIndex((val) => val.type === cargoType) >=
                0

              return (
                <div
                  key={cargoType}
                  className="flex flex-row items-center gap-2"
                >
                  <Checkbox
                    checked={isEnabled}
                    onCheckedChange={() => {
                      toggleCargoType({ cargoType })
                    }}
                  />
                  <ImageIcon icon={cargoType} />
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
                    className="w-12 border-2 border-black p-1"
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
                    className="w-12 border-2 border-black p-1"
                  />
                </div>
              )
            })}
          </div>
          <input
            type="submit"
            className="rounded border-2 border-red-900 bg-red-400 p-1 text-black hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!cityCreationForm.formState.isValid}
          />
        </form>
      </div>
    </DialogWrapper>
  )
}
