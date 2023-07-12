import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

interface Size {
  width: number
  height: number
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

/**
 * Returns the size of the element and a ref to attach to the element.
 *
 * @returns \{\{width, height\}, sizeRef\}
 */
export const useElementSize = <T extends HTMLElement = HTMLDivElement>() => {
  const sizeRef = useRef<T>(null)

  const [isInitialSizeSet, setInitialFlag] = useState(false)
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  })

  const handleSize = useCallback(() => {
    setSize({
      width: sizeRef.current?.offsetWidth || 0,
      height: sizeRef.current?.offsetHeight || 0,
    })
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!isInitialSizeSet) {
      handleSize()
      setInitialFlag(true)
    }

    window.addEventListener("resize", handleSize)
    return () => {
      window.removeEventListener("resize", handleSize)
    }
  }, [handleSize, isInitialSizeSet])

  return { size, sizeRef }
}
