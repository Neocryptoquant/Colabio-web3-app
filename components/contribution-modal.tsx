"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import Image from "next/image"
import { X, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

type ContributionStep = "amount" | "wallet" | "confirm" | "processing" | "success" | "error"

interface ContributionModalProps {
  project: any
  onClose: () => void
}

export function ContributionModal({ project, onClose }: ContributionModalProps) {
  const { publicKey, sendTransaction, connected, wallet } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()
  const [step, setStep] = useState<ContributionStep>("amount")
  const [amount, setAmount] = useState<number | "">("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is connected
  useEffect(() => {
    if (step === "wallet" && connected) {
      setStep("confirm")
    }
  }, [connected, step])

  const handleAmountSelect = (value: number) => {
    setAmount(value)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setAmount("")
    } else {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue) && numValue >= 0) {
        setAmount(numValue)
      }
    }
  }

  const handleContinue = async () => {
    if (step === "amount" && amount !== "") {
      setStep("wallet")

      // If wallet is already connected, skip to confirm
      if (connected) {
        setStep("confirm")
      }
    } else if (step === "wallet") {
      // Open wallet modal
      setVisible(true)
    } else if (step === "confirm") {
      await handleTransaction()
    }
  }

  const handleTransaction = async () => {
    if (!publicKey || !connection || amount === "") return

    try {
      setStep("processing")
      setIsProcessing(true)

      // Create a simple SOL transfer transaction
      // In a real app, this would be a program interaction for the crowdfunding
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("11111111111111111111111111111111"), // Replace with project wallet
          lamports: Number(amount) * LAMPORTS_PER_SOL,
        }),
      )

      // Send the transaction
      const signature = await sendTransaction(transaction, connection)

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed")

      if (confirmation.value.err) {
        throw new Error("Transaction failed")
      }

      // Record the contribution in Supabase
      try {
        await fetch(`/api/projects/${project.id}/contribute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: publicKey.toString(),
            amount: Number(amount),
            transactionSignature: signature,
          }),
        })
      } catch (error) {
        console.error("Error recording contribution:", error)
        // Continue with success flow even if recording fails
      }

      setTransactionSignature(signature)
      setIsProcessing(false)
      setStep("success")
    } catch (err) {
      console.error("Transaction error:", err)
      setError(err instanceof Error ? err.message : "Transaction failed")
      setIsProcessing(false)
      setStep("error")
    }
  }

  const handleBack = () => {
    if (step === "wallet") {
      setStep("amount")
    } else if (step === "confirm") {
      setStep("wallet")
    }
  }

  const getStepContent = () => {
    switch (step) {
      case "amount":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-emerald-800 mb-1">Support {project.title}</h3>
              <p className="text-sm text-gray-600">Choose how much SOL you want to contribute</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={amount === 1 ? "default" : "outline"}
                className={amount === 1 ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-200"}
                onClick={() => handleAmountSelect(1)}
              >
                1 SOL
              </Button>
              <Button
                type="button"
                variant={amount === 5 ? "default" : "outline"}
                className={amount === 5 ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-200"}
                onClick={() => handleAmountSelect(5)}
              >
                5 SOL
              </Button>
              <Button
                type="button"
                variant={amount === 10 ? "default" : "outline"}
                className={amount === 10 ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-200"}
                onClick={() => handleAmountSelect(10)}
              >
                10 SOL
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Custom amount</Label>
              <div className="relative">
                <Input
                  id="custom-amount"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-12 border-emerald-200"
                />
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 font-medium">
                  SOL
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleContinue}
                disabled={amount === "" || amount <= 0}
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case "wallet":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-emerald-800 mb-1">Connect your wallet</h3>
              <p className="text-sm text-gray-600">Choose a wallet to complete your contribution</p>
            </div>

            <div className="space-y-3">
              <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700" onClick={handleContinue}>
                <Image src="/phantom-logo.svg" alt="Phantom" width={24} height={24} className="mr-3" />
                Phantom
              </Button>

              <Button variant="outline" className="w-full justify-start border-emerald-200" onClick={handleContinue}>
                <Image src="/solflare-logo.svg" alt="Solflare" width={24} height={24} className="mr-3" />
                Solflare
              </Button>

              <Button variant="outline" className="w-full justify-start border-emerald-200" onClick={handleContinue}>
                <Image src="/backpack-logo.svg" alt="Backpack" width={24} height={24} className="mr-3" />
                Backpack
              </Button>
            </div>

            <div className="pt-4 flex gap-3">
              <Button variant="outline" className="flex-1 border-emerald-200" onClick={handleBack}>
                Back
              </Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleContinue}>
                Connect
              </Button>
            </div>
          </div>
        )

      case "confirm":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-emerald-800 mb-1">Confirm your contribution</h3>
              <p className="text-sm text-gray-600">Review the details before confirming</p>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Project</span>
                <span className="font-medium">{project.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">{amount} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network fee</span>
                <span className="font-medium">~0.000005 SOL</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">{Number(amount) + 0.000005} SOL</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-emerald-200"
                onClick={handleBack}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleContinue}
                disabled={isProcessing}
              >
                Confirm
              </Button>
            </div>
          </div>
        )

      case "processing":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-medium text-emerald-800 mb-1">Processing Transaction</h3>
              <p className="text-sm text-gray-600">Please wait while your transaction is being processed</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                Please confirm the transaction in your wallet if prompted. Do not close this window.
              </p>
            </div>
          </div>
        )

      case "success":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-100 p-3">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-emerald-800 mb-1">Contribution successful!</h3>
              <p className="text-sm text-gray-600">Thank you for supporting this green energy project</p>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">{amount} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium text-xs truncate">
                  {transactionSignature?.slice(0, 8)}...{transactionSignature?.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impact</span>
                <span className="font-medium">~{(Number(amount) * 0.8).toFixed(1)} tons CO₂ saved</span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              {transactionSignature && (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() =>
                    window.open(`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`, "_blank")
                  }
                >
                  View on Explorer
                </Button>
              )}
              <Button variant="outline" className="w-full border-emerald-200" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )

      case "error":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-red-800 mb-1">Transaction failed</h3>
              <p className="text-sm text-gray-600">There was an error processing your contribution</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-700">
                {error || "Please check your wallet balance and try again. If the problem persists, contact support."}
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setStep("amount")}>
                Try Again
              </Button>
              <Button variant="outline" className="w-full border-emerald-200" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="p-6">{getStepContent()}</div>
      </div>
    </div>
  )
}
