import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/colabio-logo.svg" alt="Colabio Logo" width={32} height={32} />
      <span className="text-xl font-bold text-emerald-700">Colabio</span>
    </Link>
  )
}
