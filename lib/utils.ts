import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCNIC(value: string) {
  if (!value) return ""
  const cnic = value.replace(/\D/g, "").slice(0, 13)
  if (cnic.length > 5) {
    if (cnic.length > 12) {
      return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12)}`
    }
    return `${cnic.slice(0, 5)}-${cnic.slice(5)}`
  }
  return cnic
}
