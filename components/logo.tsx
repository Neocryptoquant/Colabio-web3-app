"use client"

import Link from "next/link"
import Image from "next/image"

export function Logo() {
  // Always use the light theme logo
  const logoSrc = "/colabio-logo-light.png"

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src={logoSrc || "/placeholder.svg"} alt="Colabio Logo" width={120} height={40} className="h-8" />
    </Link>
  )
}
