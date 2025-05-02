import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SolanaProviders } from "@/lib/solana-providers"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Colabio - Crowdfund on Solana",
  description: "A platform for crowdfunding green energy projects on Solana",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SolanaProviders>{children}</SolanaProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
