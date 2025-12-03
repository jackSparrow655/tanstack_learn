import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, timeout: number = 500) => {
  const [input, setInput] = useState<T>(value)
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      setInput(value)
    }, timeout)
    return () => {
      clearTimeout(timeoutRef)
    }
  }, [value, timeout])
  return input
}
