import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// merge Tailwind class names
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
