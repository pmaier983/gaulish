import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import * as z from "zod"

import { DialogWrapper } from "~/components/dialogs/DialogWrapper"

const cityCreationFormSchema = z.object({
  name: z.string().min(3),
})

export const CityCreationDialog = () => {
  const cityCreationForm = useForm<z.infer<typeof cityCreationFormSchema>>({
    resolver: zodResolver(cityCreationFormSchema),
    // For formState.isValid to work, we need to set mode to onChange
    // And also avoid using easy register methods like (min, max, required) etc.
    // Also we need to convert all numbers to actual numbers and not strings (setValueAs seen below)
    mode: "onChange",
  })

  const onCityCreation: SubmitHandler<
    z.infer<typeof cityCreationFormSchema>
  > = (data, e) => {
    e?.preventDefault()
    // TODO: adjust localStorage & state on city creation
  }

  return (
    <DialogWrapper className="flex h-full max-h-[500px] min-h-[300px] w-full min-w-[330px] max-w-[85%] p-3">
      <div className="flex max-w-full flex-1 flex-row justify-between gap-2 max-sm:flex-col">
        <form onSubmit={cityCreationForm.handleSubmit(onCityCreation)}>
          <label htmlFor="name">City Name:</label>
          <input
            {...cityCreationForm.register("name")}
            className="w-12 border-2 border-black p-1"
          />

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
