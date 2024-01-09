import { type FormEvent, useState, useEffect } from "react"

import { Icon } from "~/components/Icon"
import { MAX_SHIP_NAME_LENGTH } from "~/components/constants"
import { api } from "~/utils/api"

interface TooltipEditTextProps {
  shipId: string
  text: string
}

export const TooltipShipNameEditor = ({
  shipId,
  text,
}: TooltipEditTextProps) => {
  const queryClient = api.useUtils()

  const { mutate } = api.ships.updateShipName.useMutation({
    onSuccess: (newShipData) => {
      // when the ship name is updated update the ship list!
      queryClient.ships.getUsersShips.setData(undefined, (oldShipList) => {
        const newData = oldShipList?.map((currentShip) => {
          if (currentShip.id === newShipData.shipId) {
            return { ...currentShip, name: newShipData.newName }
          }
          return currentShip
        })
        return newData
      })
    },
  })

  const [inputText, setInputText] = useState(text)
  const [isEditing, setIsEditing] = useState(false)

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditing(false)

    if (inputText && inputText !== text) {
      mutate({ shipId: shipId, newName: inputText })
    }
  }

  useEffect(() => {
    const handleEscapeButton = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false)
      }
    }

    document.addEventListener("keydown", handleEscapeButton)

    return () => {
      document.removeEventListener("keydown", handleEscapeButton)
    }
  }, [])

  if (isEditing) {
    return (
      <form className="flex items-center gap-2" onSubmit={onFormSubmit}>
        <input
          autoFocus
          className="p-1 text-black"
          placeholder={inputText}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value)
          }}
          min={1}
          max={MAX_SHIP_NAME_LENGTH}
        />
        <button
          type="submit"
          className="rounded-full bg-green-300 p-1 hover:bg-green-400 disabled:opacity-50"
          disabled={
            !inputText ||
            inputText === text ||
            inputText.length >= MAX_SHIP_NAME_LENGTH
          }
        >
          <Icon icon={"arrowRight"} size="1rem" />
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {inputText}
      <button
        onClick={() => {
          setIsEditing(true)
        }}
        className="rounded-full bg-red-400 p-1  hover:bg-red-600"
      >
        <Icon icon={"edit-3"} size="1rem" />
      </button>
    </div>
  )
}
