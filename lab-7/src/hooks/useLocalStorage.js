import { useState, useEffect } from 'react'

/**
 * Стан, що зберігається в localStorage під ключем `key` у форматі JSON.
 *
 * Використання, як у useState:
 *   const [value, setValue] = useLocalStorage('grind', 'beans')
 *
 * Вимоги — у тестах tests/useLocalStorage.test.jsx.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallback =
      typeof initialValue === 'function' ? initialValue() : initialValue
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? fallback : JSON.parse(saved)
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
