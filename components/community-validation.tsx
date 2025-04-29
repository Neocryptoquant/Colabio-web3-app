"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ThumbsUp, ThumbsDown, ExternalLink, FileText, CheckCircle, AlertCircle, Users, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"

// Sample data for validation
const validationData = {
  pendingProjects: [
    {
      id: "1",
      title: "Vertical Wind Turbines",
      description:
        "Urban wind turbines for city center with innovative vertical design to maximize energy capture in urban environments.",
      location: "Metropolis, NY",
      image: "/project-vertical.jpg",
      goal: 400,
      votes: {
        approve: 24,
        reject: 5,
      },
      creator: "Elena Rodriguez",
    },
    {
      id: "2",
      title: "Geothermal Heating Network",
      description:
        "Community geothermal heating system that leverages natural underground heat to provide sustainable heating for 50+ homes.",
      location: "Hotsprings, NV",
      image: "/project-geothermal.jpg",
      goal: 750,
      votes: {
        approve: 18,
        reject: 12,
      },
      creator: "Michael Chen",
    },
  ],
  pendingMilestones: [
    {
      id: "1",
      projectId: "3",
      projectTitle: "Community Solar Array",
      milestone: "Equipment procurement",
      evidence: ["/evidence-invoice.jpg", "/evidence-delivery.jpg"],
      description: "All solar panels, inverters, and mounting hardware have been purchased and delivered to the site.",
      creator: "Sarah Johnson",
    },
    {
      id: "2",
      projectId: "4",
      projectTitle: "Micro Hydro Power",
      milestone: "Installation",
      evidence: ["/evidence-installation.jpg"],
      description: "The micro hydro turbine has been installed at the designated location on the river.",
      creator: "David Wilson",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "project_approved",
      projectTitle: "School Solar Rooftop",
      user: "Robert Garcia",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "milestone_verified",
      projectTitle: "Wind Farm Expansion",
      milestone: "Land acquisition",
      user: "Lisa Thompson",
      time: "1 day ago",
    },
    {
      id: "3",
      type: "project_rejected",
      projectTitle: "Tidal Energy Prototype",
      user: "James Wilson",
      time: "2 days ago",
    },
  ],
  topValidators: [
    {
      id: "1",
      name: "Robert Garcia",
      validations: 42,
      reputation: 98,
    },
    {
      id: "2",
      name: "Lisa Thompson",
      validations: 38,
      reputation: 95,
    },
    {
      id: "3",
      name: "James Wilson",
      validations: 31,
      reputation: 92,
    },
    {
      id: "4",
      name: "Maria Sanchez",
      validations: 27,
      reputation: 90,
    },
  ],
}

export function CommunityValidation() {
  const [selectedMilestone, setSelectedMilestone] = useState("")
  const [comment, setComment] = useState("")

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_approved":
        return <ThumbsUp className="h-5 w-5 text-emerald-600" />
      case "milestone_verified":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case "project_rejected":
        return <ThumbsDown className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <MainNav />

      <main className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-1">Community Validation</h1>
            <p className="text-gray-600">Help verify projects and milestones to maintain platform integrity</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center bg-white rounded-lg p-2 border border-emerald-100">
            <div className="flex items-center mr-4">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                <Trophy className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Your Reputation</p>
                <p className="font-medium">85/100</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Validations</p>
                <p className="font-medium">12</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="projects" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="projects">Pending Projects</TabsTrigger>
                <TabsTrigger value="milestones">Milestone Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                <div className="space-y-6">
                  {validationData.pendingProjects.map((project) => (
                    <Card key={project.id} className="border-emerald-100">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1">
                            <div className="relative h-48 rounded-lg overflow-hidden">
                              <Image
                                src={`/placeholder.svg?height=192&width=288`}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold text-emerald-800">{project.title}</h3>
                              <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Link href={`/projects/${project.id}`}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>

                            <p className="text-gray-600 mb-4">{project.description}</p>

                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="bg-emerald-50 rounded-lg px-3 py-1 text-sm">
                                <span className="text-gray-500">Location:</span>{" "}
                                <span className="font-medium text-emerald-800">{project.location}</span>
                              </div>
                              <div className="bg-emerald-50 rounded-lg px-3 py-1 text-sm">
                                <span className="text-gray-500">Goal:</span>{" "}
                                <span className="font-medium text-emerald-800">{project.goal} SOL</span>
                              </div>
                              <div className="bg-emerald-50 rounded-lg px-3 py-1 text-sm">
                                <span className="text-gray-500">Creator:</span>{" "}
                                <span className="font-medium text-emerald-800">{project.creator}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 text-emerald-600 mr-1" />
                                  <span className="text-sm font-medium">{project.votes.approve}</span>
                                </div>
                                <div className="flex items-center">
                                  <ThumbsDown className="h-4 w-4 text-red-600 mr-1" />
                                  <span className="text-sm font-medium">{project.votes.reject}</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="milestones">
                <div className="space-y-6">
                  {validationData.pendingMilestones.map((milestone) => (
                    <Card key={milestone.id} className="border-emerald-100">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1">
                            <h3 className="font-bold text-emerald-800 mb-2">{milestone.projectTitle}</h3>
                            <p className="text-sm text-gray-600 mb-3">Milestone: {milestone.milestone}</p>

                            <div className="space-y-2">
                              {milestone.evidence.map((evidence, index) => (
                                <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                                  <Image
                                    src={`/placeholder.svg?height=96&width=192`}
                                    alt={`Evidence ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" className="text-white">
                                      <FileText className="h-5 w-5 mr-1" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                              <h4 className="font-medium text-emerald-800 mb-1">Milestone Description</h4>
                              <p className="text-gray-700">{milestone.description}</p>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="milestone-select">Select Milestone</Label>
                                <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
                                  <SelectTrigger className="border-emerald-100">
                                    <SelectValue placeholder="Select milestone to verify" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={milestone.milestone}>{milestone.milestone}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="comment">Feedback (optional)</Label>
                                <Textarea
                                  id="comment"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  placeholder="Provide feedback on this milestone..."
                                  className="min-h-20 border-emerald-100"
                                />
                              </div>

                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Dispute
                                </Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Verify
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest validation actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {validationData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                      <div>
                        <p className="text-sm font-medium">
                          {activity.user} {activity.type === "project_approved" && "approved"}
                          {activity.type === "milestone_verified" && "verified"}
                          {activity.type === "project_rejected" && "rejected"}{" "}
                          <span className="font-normal">
                            {activity.projectTitle}
                            {activity.milestone && ` (${activity.milestone})`}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle>Top Validators</CardTitle>
                <CardDescription>Community members with highest reputation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {validationData.topValidators.map((validator, index) => (
                    <div key={validator.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                          <Users className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium">{validator.name}</p>
                          <p className="text-xs text-gray-500">{validator.validations} validations</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {index === 0 && (
                          <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-1">
                            <Trophy className="h-3 w-3 text-yellow-600" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{validator.reputation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle>Validation Process</CardTitle>
                <CardDescription>How community validation works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-emerald-800 mb-1">Project Approval</h3>
                    <p className="text-sm text-gray-600">
                      New projects require community approval before they can receive funding. Projects need a majority
                      of positive votes to be listed.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-emerald-800 mb-1">Milestone Verification</h3>
                    <p className="text-sm text-gray-600">
                      Project creators submit evidence when milestones are completed. Validators review the evidence and
                      verify completion.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-emerald-800 mb-1">Reputation System</h3>
                    <p className="text-sm text-gray-600">
                      Validators earn reputation points for accurate validations. Higher reputation gives your votes
                      more weight in the system.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
