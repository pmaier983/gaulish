import Image from "next/image"
import { useState } from "react"
import { type ImagesResponse } from "openai"

export const ImageGeneration = () => {
  // TODO: use useQuery for all of this.
  const [userPrompt, setUserPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const rawResponse = await fetch("/api/openai/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
        }),
      })
      const response = (await rawResponse.json()) as ImagesResponse

      if (response.data) {
        setImageSrc(response.data.at(0)?.url)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-2 p-2">
        <textarea
          className="w-full bg-blue-200 p-2"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
        />
        <button
          className="rounded-md border-2 border-green-500 bg-green-300 p-2"
          onClick={() => {
            fetchData().catch((e) => console.error(e))
          }}
        >
          Query Dall-e
        </button>
      </div>
      {isLoading ? "Loading..." : null}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="random generated images from openai"
          width={100}
          height={100}
        />
      )}
    </>
  )
}
