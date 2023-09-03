import { type FormEvent, useState, useEffect } from "react"

import { Icon } from "~/components/Icon"

interface TooltipEditTextProps {
  text: string
  onSubmit: (newText: string) => void
  maxNewTextLength: number
}

export const TooltipEditText = ({
  text,
  maxNewTextLength,
  onSubmit,
}: TooltipEditTextProps) => {
  const [inputText, setInputText] = useState(text)
  const [isEditing, setIsEditing] = useState(false)

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditing(false)

    if (inputText && inputText !== text) {
      onSubmit(inputText)
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
          max={maxNewTextLength}
        />
        <button
          type="submit"
          className="rounded-full bg-green-300 p-1 hover:bg-green-400 disabled:opacity-50"
          disabled={
            !inputText ||
            inputText === text ||
            inputText.length >= maxNewTextLength
          }
        >
          <Icon id={"arrowRight"} size="1rem" />
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
        <Icon id={"edit-3"} size="1rem" />
      </button>
    </div>
  )
}
