"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"

export function Logo() {
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === "dark" ? "/colabio-logo-dark.png" : "/colabio-logo-light.png"

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src={logoSrc || "/placeholder.svg"} alt="Colabio Logo" width={120} height={40} className="h-8" />
    </Link>
  )
}
