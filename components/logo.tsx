"use client"

import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src="/colabio-logo.svg" alt="Colabio Logo" width={32} height={32} className="h-8 w-8" />
      <span className="font-medium text-xl text-gray-900">Colabio</span>
    </Link>
  )
}
