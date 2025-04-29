"use client"

import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProjectCardSkeleton() {
  return (
    <Card className="border-emerald-100 overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />

        <div className="space-y-2">
          <div className="flex justify-between mb-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/3 mb-6" />

        <Skeleton className="h-[400px] w-full mb-4 rounded-lg" />

        <div className="flex space-x-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-24 rounded-md" />
          ))}
        </div>

        <Card className="border-emerald-100 mb-8">
          <CardContent className="p-6">
            <Skeleton className="h-7 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />

            <Skeleton className="h-7 w-1/4 mb-4" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="border-emerald-100 mb-6">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-2 w-full mb-4 rounded-full" />
            <Skeleton className="h-8 w-3/4 mb-6" />

            <Skeleton className="h-[1px] w-full mb-4" />

            <div className="flex justify-between mb-6">
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-12 w-16" />
            </div>

            <Skeleton className="h-12 w-full rounded-md" />
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/2 mb-4" />

            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
    </div>
  )
}
