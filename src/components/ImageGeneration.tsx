import Image from "next/image"
import { useState } from "react"
import {
  type Image as OpenAIImage,
  type ImageGenerateParams,
  type ImagesResponse,
} from "openai/resources"

export const ImageGeneration = () => {
  // TODO: use useQuery for all of this.
  const [userPrompt, setUserPrompt] = useState(
    "24px by 24px, No Text, Pixelated, Fully visible, White background, Video Game Sailing aesthetic.",
  )
  const [isLoading, setIsLoading] = useState(false)
  const [imageCount, setImageCount] = useState(1)
  const [images, setImages] = useState<OpenAIImage[]>([])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const request: ImageGenerateParams = {
        prompt: userPrompt,
        n: imageCount,
      }

      const rawResponse = await fetch("/api/openai/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })
      const response = (await rawResponse.json()) as ImagesResponse["data"]

      if (response) {
        setImages(response)
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
          className="rounded-md bg-green-300 p-2 outline-2 outline-green-500"
          onClick={() => {
            fetchData().catch((e) => console.error(e))
          }}
        >
          Query Dall-e
        </button>
        <input
          type="number"
          value={imageCount}
          onChange={(e) => setImageCount(parseInt(e.target.value, 10))}
        />
      </div>
      {isLoading ? "Loading..." : null}
      <div className="flex flex-row">
        {images.map((image, i) => (
          <Image
            key={i}
            src={image.url ?? ""}
            width={100}
            height={100}
            alt="openai generated image"
          />
        ))}
      </div>
    </>
  )
}
