"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { WalletMultiButton } from "@/components/wallet-multi-button"

export function MainNav() {
  const pathname = usePathname()
  const { connected } = useWallet()

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/discover"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                pathname === "/discover" ? "text-green-600" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Discover
            </Link>
            <Link
              href="/create"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                pathname === "/create" ? "text-green-600" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Create
            </Link>
            <Link
              href="/validate"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                pathname === "/validate" ? "text-green-600" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Validate
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {connected ? (
            <>
              <Button asChild variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
                <Link href="/profile">Profile</Link>
              </Button>
            </>
          ) : (
            <div className="hidden md:block">
              <WalletMultiButton />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
