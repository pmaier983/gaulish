import { useEffect, useState } from "react"
import { PRICE_UPDATE_INTERVAL } from "~/components/constants"
import { getRandomNumberWithSeed } from "~/utils/utils"

interface getSpotPriceInputs {
  // Controls the max variation around the midline
  amplitude: number
  // Controls the number the price fluctuates around
  midline: number
  seed: number
}

export const getSpotPrice = ({
  amplitude,
  midline,
  seed,
}: getSpotPriceInputs) => {
  const timeMin = Math.round(new Date().getTime() / PRICE_UPDATE_INTERVAL)

  // const of sin & cos values
  const countOfWaves = 4

  const randomArray = Array(countOfWaves)
    .fill(undefined)
    .map((_, i) => getRandomNumberWithSeed(seed + i))
  const randomSum = randomArray.reduce((acc, val) => acc + val, 0)
  const randomArrayPercent = randomArray.map((val) => val / randomSum)

  let innerValue = 0

  for (let i = 0; i < countOfWaves; i++) {
    const val = timeMin * randomArray[i]! * randomArrayPercent[i]!
    const randomSway = getRandomNumberWithSeed(seed + i * 10)
    if (i % 2 === 0) {
      innerValue += Math.sin(val) * randomSway
    } else {
      innerValue += Math.cos(val) * randomSway
    }
  }

  const finalValue = Math.round(
    amplitude * ((innerValue * 1) / countOfWaves) + midline,
  )

  const minValue = 1
  const maxValue = midline + amplitude

  return Math.min(Math.max(finalValue, minValue), maxValue)
}

// This function ensure the price is always up-to-date
export const useGetPrice = () => {
  const [, setTimer] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(new Date().getTime())
    }, PRICE_UPDATE_INTERVAL)
    return () => clearInterval(intervalId)
  })

  return { getPrice: getSpotPrice }
}
