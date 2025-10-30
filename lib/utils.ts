import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Return a new array with the item moved from `from` index to `to` index.
 * Keeps original array untouched to preserve React state immutability.
 */
export function arrayMove<T>(input: T[], from: number, to: number): T[] {
  if (from === to) {
    return [...input]
  }

  const next = [...input]
  const target = next.splice(from, 1)[0]
  next.splice(to, 0, target)
  return next
}
