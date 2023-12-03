import { useState } from "react"

export const LOCAL_STORAGE_KEYS = {
  STORED_MAP_ARRAY: "STORED_MAP_ARRAY",
} as const

export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEYS

export const getLocalStorageValue = <T>(
  key: LocalStorageKey,
  initialValue: T,
): T => {
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : initialValue
  } catch (error) {
    console.error(error)
    return initialValue
  }
}

export const setLocalStorageValue = <T>(key: LocalStorageKey, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

/**
 * useLocalStorage - A hook to persist state in local storage
 */
export const useLocalStorage = <T>(
  key: LocalStorageKey,
  initialValue: T,
): [T, (val: T) => void] => {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(
    getLocalStorageValue<T>(key, initialValue),
  )

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T) => {
    setStoredValue(value)
    setLocalStorageValue(key, value)
  }

  return [storedValue, setValue]
}
