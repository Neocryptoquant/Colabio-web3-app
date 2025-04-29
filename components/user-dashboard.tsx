"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BarChart3, PieChart, ArrowUpRight, Bell, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"

// Sample data for the dashboard
const dashboardData = {
  metrics: {
    totalContributed: 23.5,
    projectsBacked: 7,
    co2Saved: 48,
  },
  contributedProjects: [
    {
      id: "1",
      title: "Community Solar Array",
      image: "/project-solar.jpg",
      progress: 65,
      milestone: "Equipment procurement",
      status: "on-track",
    },
    {
      id: "2",
      title: "Wind Farm Expansion",
      image: "/project-wind.jpg",
      progress: 42,
      milestone: "Land acquisition",
      status: "delayed",
    },
    {
      id: "3",
      title: "Micro Hydro Power",
      image: "/project-hydro.jpg",
      progress: 78,
      milestone: "Installation",
      status: "on-track",
    },
    {
      id: "4",
      title: "School Solar Rooftop",
      image: "/project-school.jpg",
      progress: 90,
      milestone: "Grid connection",
      status: "completed",
    },
  ],
  createdProjects: [
    {
      id: "5",
      title: "Community Battery Storage",
      image: "/project-battery.jpg",
      progress: 50,
      status: "active",
      raised: 300,
      goal: 600,
    },
  ],
  notifications: [
    {
      id: "1",
      type: "milestone",
      project: "Community Solar Array",
      message: "Equipment procurement milestone completed",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "update",
      project: "Wind Farm Expansion",
      message: "Project timeline updated due to permit delays",
      time: "1 day ago",
    },
    {
      id: "3",
      type: "platform",
      message: "New validation rewards program launched",
      time: "3 days ago",
    },
  ],
}

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-emerald-600"
      case "delayed":
        return "text-amber-600"
      case "completed":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return <Clock className="h-4 w-4 text-emerald-600" />
      case "delayed":
        return <AlertCircle className="h-4 w-4 text-amber-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "milestone":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case "update":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "platform":
        return <Bell className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <MainNav />

      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Contributed</p>
                  <p className="text-3xl font-bold text-emerald-700">{dashboardData.metrics.totalContributed} SOL</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Projects Backed</p>
                  <p className="text-3xl font-bold text-emerald-700">{dashboardData.metrics.projectsBacked}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">CO₂ Saved</p>
                  <p className="text-3xl font-bold text-emerald-700">{dashboardData.metrics.co2Saved} tons</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 12L10 15L17 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle>Impact Metrics</CardTitle>
                <CardDescription>Visualization of your contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative h-48 w-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Distribution by Type</p>
                          <p className="text-2xl font-bold text-emerald-700">{dashboardData.metrics.projectsBacked}</p>
                        </div>
                      </div>
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="10"
                          strokeDasharray="150.8"
                          strokeDashoffset="30"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="10"
                          strokeDasharray="150.8"
                          strokeDashoffset="105"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="10"
                          strokeDasharray="150.8"
                          strokeDashoffset="180"
                        />
                      </svg>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></div>
                        <span className="text-xs">Solar (45%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                        <span className="text-xs">Wind (30%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-purple-500 mr-1"></div>
                        <span className="text-xs">Hydro (25%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <p className="text-sm text-gray-500 mb-4">Impact Growth Over Time</p>
                    <div className="flex-1 flex items-end gap-2">
                      {[15, 22, 18, 25, 30, 45, 48].map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-emerald-500 rounded-t-sm"
                            style={{ height: `${value * 2}px` }}
                          ></div>
                          <span className="text-xs mt-1">Q{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.notifications.map((notification) => (
                    <div key={notification.id} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div>
                        <p className="text-sm font-medium">
                          {notification.project && `${notification.project}: `}
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="backed" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="backed">Projects You've Backed</TabsTrigger>
            <TabsTrigger value="created">Projects You've Created</TabsTrigger>
          </TabsList>

          <TabsContent value="backed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.contributedProjects.map((project) => (
                <Card key={project.id} className="border-emerald-100 overflow-hidden">
                  <div className="relative h-36">
                    <Image
                      src={`/placeholder.svg?height=144&width=288`}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{project.title}</h3>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs">
                          {getStatusIcon(project.status)}
                          <span className={`ml-1 ${getStatusColor(project.status)}`}>{project.milestone}</span>
                        </div>
                        <Button asChild size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Link href={`/projects/${project.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="created">
            {dashboardData.createdProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardData.createdProjects.map((project) => (
                  <Card key={project.id} className="border-emerald-100 overflow-hidden">
                    <div className="relative h-36">
                      <Image
                        src={`/placeholder.svg?height=144&width=288`}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                        {project.status}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{project.title}</h3>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Funded</span>
                            <span>
                              {project.raised} / {project.goal} SOL
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-100">
                            Edit
                          </Button>
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Link href={`/projects/${project.id}`}>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-emerald-100">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't created any projects yet</p>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/create">Create a Project</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
