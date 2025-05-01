"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CopyIcon, CheckIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-supabase"

export default function ProfilePage() {
  const { publicKey, wallet, connected, disconnect } = useWallet()
  const { connection } = useConnection()
  const { user, loading: userLoading } = useUser()
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [contributions, setContributions] = useState<any[]>([])
  const router = useRouter()

  // Redirect to login if not connected
  useEffect(() => {
    if (!connected && !loading) {
      router.push("/")
    }
  }, [connected, loading, router])

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const walletBalance = await connection.getBalance(publicKey)
          setBalance(walletBalance / LAMPORTS_PER_SOL)
        } catch (error) {
          console.error("Failed to fetch balance:", error)
          setBalance(0)
        }
      }
      setLoading(false)
    }

    fetchBalance()

    // Set up balance refresh interval
    const intervalId = setInterval(fetchBalance, 30000) // Refresh every 30 seconds

    return () => clearInterval(intervalId)
  }, [publicKey, connection])

  // Fetch user contributions
  useEffect(() => {
    const fetchContributions = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.id}/contributions`)
          if (response.ok) {
            const data = await response.json()
            setContributions(data.contributions || [])
          }
        } catch (error) {
          console.error("Failed to fetch contributions:", error)
        }
      }
    }

    if (user) {
      fetchContributions()
    }
  }, [user])

  const walletAddress = publicKey?.toBase58() || ""
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : ""

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getWalletName = () => {
    if (!wallet) return "Unknown Wallet"
    return wallet.adapter.name
  }

  // Use fetched contributions or fallback to sample data
  const contributionHistory =
    contributions.length > 0
      ? contributions
      : [
          {
            id: 1,
            project: "Community Solar Array",
            amount: "5.2 SOL",
            date: "May 15, 2023",
            status: "Completed",
          },
          {
            id: 2,
            project: "Wind Farm Expansion",
            amount: "3.7 SOL",
            date: "April 2, 2023",
            status: "Completed",
          },
          {
            id: 3,
            project: "Hydro Power Initiative",
            amount: "8.1 SOL",
            date: "March 10, 2023",
            status: "Completed",
          },
        ]

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mb-4" />
          <p className="text-emerald-800">Loading wallet information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Image src="/colabio-logo.svg" alt="Colabio Logo" width={48} height={48} className="mr-3" />
            <h1 className="text-2xl font-bold text-emerald-700">Colabio</h1>
          </div>
          <Button variant="outline" className="border-emerald-200" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800">Wallet</CardTitle>
              <CardDescription>Your connected wallet details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-md">
                <span className="text-sm font-medium">{shortAddress}</span>
                <Button variant="ghost" size="sm" onClick={copyAddress} className="h-8 w-8 p-0">
                  {copied ? <CheckIcon className="h-4 w-4 text-emerald-600" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Connected with {getWalletName()}</p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium">Wallet Balance</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {balance !== null ? balance.toFixed(4) : "0"} SOL
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-lg font-medium text-emerald-700">{user?.username || "Not set"}</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium">Reputation</p>
                  <p className="text-lg font-medium text-emerald-700">{user?.reputation || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="history">Contribution History</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="history">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle className="text-emerald-800">Your Contributions</CardTitle>
                    <CardDescription>Projects you've supported</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {contributionHistory.map((contribution, index) => (
                        <div key={contribution.id} className="relative pl-6 pb-6">
                          {index < contributionHistory.length - 1 && (
                            <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-emerald-200" />
                          )}
                          <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-emerald-500" />
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{contribution.project}</h4>
                              <p className="text-sm text-gray-500">{contribution.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-emerald-700">{contribution.amount}</p>
                              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                                {contribution.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle className="text-emerald-800">Notification Settings</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="project-updates" className="flex-1">
                        Project updates
                        <p className="text-sm font-normal text-gray-500">
                          Receive updates about projects you've funded
                        </p>
                      </Label>
                      <Switch id="project-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="milestone-completions" className="flex-1">
                        Milestone completions
                        <p className="text-sm font-normal text-gray-500">
                          Get notified when project milestones are completed
                        </p>
                      </Label>
                      <Switch id="milestone-completions" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-projects" className="flex-1">
                        New projects
                        <p className="text-sm font-normal text-gray-500">
                          Be the first to know about new green energy projects
                        </p>
                      </Label>
                      <Switch id="new-projects" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing" className="flex-1">
                        Marketing emails
                        <p className="text-sm font-normal text-gray-500">Receive promotional content and offers</p>
                      </Label>
                      <Switch id="marketing" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
