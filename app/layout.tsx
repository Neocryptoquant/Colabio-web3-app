import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { SolanaProviders } from "@/lib/solana-providers"
import { ThemeProvider } from "@/components/theme-provider"

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
})

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
      <body className={roboto.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SolanaProviders>{children}</SolanaProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
