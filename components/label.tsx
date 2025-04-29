import type React from "react"
interface LabelProps {
  htmlFor?: string
  className?: string
  children: React.ReactNode
}

export function Label({ htmlFor, className, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 ${className || ""}`}>
      {children}
    </label>
  )
}
