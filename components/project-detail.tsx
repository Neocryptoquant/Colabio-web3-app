"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Clock,
  Star,
  Shield,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { ContributionModal } from "@/components/contribution-modal"

// Sample project data
const projectData = {
  id: "1",
  title: "Community Solar Array - Greenville",
  description:
    "This project aims to install a community-owned solar array that will provide clean, renewable energy to the rural community of Greenville. The installation will reduce electricity costs for local residents and decrease carbon emissions in the region.",
  location: "Greenville, CA",
  images: [
    "/project-solar-main.jpg",
    "/project-solar-1.jpg",
    "/project-solar-2.jpg",
    "/project-solar-3.jpg",
    "/project-solar-4.jpg",
  ],
  progress: 65,
  goal: 500,
  raised: 325,
  backers: 124,
  daysRemaining: 18,
  risk: {
    overall: 76,
    technical: 82,
    financial: 70,
    regulatory: 78,
    environmental: 90,
  },
  milestones: [
    {
      title: "Land acquisition",
      description: "Purchase of 2-acre plot for solar installation",
      status: "completed",
      date: "March 15, 2023",
    },
    {
      title: "Equipment procurement",
      description: "Purchase of solar panels, inverters, and mounting hardware",
      status: "current",
      date: "May 20, 2023",
    },
    {
      title: "Installation",
      description: "Physical installation of solar array and connection equipment",
      status: "upcoming",
      date: "July 10, 2023",
    },
    {
      title: "Grid connection",
      description: "Connection to local power grid and system testing",
      status: "upcoming",
      date: "August 5, 2023",
    },
  ],
  team: [
    {
      name: "Sarah Johnson",
      role: "Project Lead",
      bio: "Renewable energy engineer with 10+ years of experience in solar installations",
      image: "/team-sarah.jpg",
    },
    {
      name: "Michael Chen",
      role: "Technical Director",
      bio: "Electrical engineer specializing in grid integration and energy storage",
      image: "/team-michael.jpg",
    },
    {
      name: "Elena Rodriguez",
      role: "Community Liaison",
      bio: "Local resident and community organizer focused on sustainable development",
      image: "/team-elena.jpg",
    },
  ],
  endorsements: {
    rating: 4.7,
    count: 42,
    testimonials: [
      {
        name: "David Wilson",
        text: "This project is exactly what our community needs. The team has been transparent and responsive throughout the planning phase.",
        rating: 5,
      },
      {
        name: "Lisa Thompson",
        text: "I'm impressed by the detailed planning and community involvement. Looking forward to seeing this completed!",
        rating: 5,
      },
      {
        name: "Robert Garcia",
        text: "Good project overall, though I have some concerns about the timeline. The team seems competent though.",
        rating: 4,
      },
    ],
  },
  relatedProjects: [
    {
      id: "2",
      title: "Wind Farm Expansion",
      image: "/project-wind.jpg",
      progress: 42,
    },
    {
      id: "5",
      title: "School Solar Rooftop",
      image: "/project-school.jpg",
      progress: 90,
    },
  ],
}

export function ProjectDetail({ id }: { id: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContributionModal, setShowContributionModal] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1 >= projectData.images.length ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 < 0 ? projectData.images.length - 1 : prevIndex - 1))
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-emerald-500" />
      case "current":
        return <Circle className="h-6 w-6 text-blue-500 fill-blue-500" />
      default:
        return <Circle className="h-6 w-6 text-gray-300" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <MainNav />

      <main className="container px-4 py-8">
        <div className="mb-6">
          <Link href="/discover" className="text-emerald-600 hover:underline inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to projects
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Hero section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-emerald-800 mb-2">{projectData.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{projectData.location}</span>
              </div>

              {/* Main image with gallery */}
              <div className="relative rounded-lg overflow-hidden mb-4">
                <div className="aspect-video relative">
                  <Image
                    src={`/placeholder.svg?height=480&width=854`}
                    alt={projectData.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 border-emerald-100 z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 border-emerald-100 z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Thumbnail gallery */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {projectData.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-16 w-24 rounded-md overflow-hidden flex-shrink-0 ${
                      currentImageIndex === index ? "ring-2 ring-emerald-500" : ""
                    }`}
                    onClick={() => selectImage(index)}
                  >
                    <Image
                      src={`/placeholder.svg?height=64&width=96`}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Project tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="bg-white rounded-lg border border-emerald-100 p-6">
                  <h2 className="text-xl font-bold text-emerald-800 mb-4">Project Description</h2>
                  <div className="text-gray-700 space-y-4">
                    <p>{projectData.description}</p>
                    <p className={expandedDescription ? "" : "hidden"}>
                      The solar array will consist of 200 high-efficiency photovoltaic panels, capable of generating up
                      to 75 kW of clean electricity. This is enough to power approximately 50 homes in the community,
                      reducing reliance on fossil fuels and lowering electricity bills for participants.
                    </p>
                    <p className={expandedDescription ? "" : "hidden"}>
                      Community members will be able to purchase shares in the solar project, allowing them to benefit
                      directly from the energy produced. Excess energy will be sold back to the grid, creating a
                      sustainable revenue stream that will be reinvested in maintenance and future community energy
                      projects.
                    </p>
                    <button
                      className="text-emerald-600 hover:underline flex items-center mt-2"
                      onClick={() => setExpandedDescription(!expandedDescription)}
                    >
                      {expandedDescription ? (
                        <>
                          Show less <ChevronUp className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-emerald-800 mt-8 mb-4">Risk Assessment</h2>
                  <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-emerald-700 mr-2" />
                        <span className="font-medium text-emerald-800">Overall Risk Score</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-700">{projectData.risk.overall}/100</div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Technical Risk</span>
                          <span className="font-medium">{projectData.risk.technical}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${projectData.risk.technical}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Financial Risk</span>
                          <span className="font-medium">{projectData.risk.financial}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${projectData.risk.financial}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Regulatory Risk</span>
                          <span className="font-medium">{projectData.risk.regulatory}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${projectData.risk.regulatory}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Environmental Risk</span>
                          <span className="font-medium">{projectData.risk.environmental}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${projectData.risk.environmental}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="mt-4">
                <div className="bg-white rounded-lg border border-emerald-100 p-6">
                  <h2 className="text-xl font-bold text-emerald-800 mb-6">Project Timeline</h2>

                  <div className="space-y-8">
                    {projectData.milestones.map((milestone, index) => (
                      <div key={index} className="relative pl-10">
                        {index < projectData.milestones.length - 1 && (
                          <div
                            className={`absolute left-3 top-6 h-full w-0.5 ${
                              milestone.status === "completed"
                                ? "bg-emerald-500"
                                : milestone.status === "current"
                                  ? "bg-blue-500"
                                  : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                        <div className="absolute left-0 top-0">{getMilestoneIcon(milestone.status)}</div>
                        <div className="mb-1">
                          <h3 className="text-lg font-medium text-emerald-800">{milestone.title}</h3>
                          <p className="text-sm text-gray-500">{milestone.date}</p>
                        </div>
                        <p className="text-gray-700">{milestone.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="team" className="mt-4">
                <div className="bg-white rounded-lg border border-emerald-100 p-6">
                  <h2 className="text-xl font-bold text-emerald-800 mb-6">Project Team</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projectData.team.map((member, index) => (
                      <div key={index} className="flex flex-col items-center text-center">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
                          <Image
                            src={`/placeholder.svg?height=96&width=96`}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-emerald-800">{member.name}</h3>
                        <p className="text-sm text-emerald-600 mb-2">{member.role}</p>
                        <p className="text-sm text-gray-600">{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="endorsements" className="mt-4">
                <div className="bg-white rounded-lg border border-emerald-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-emerald-800">Community Endorsements</h2>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.floor(projectData.endorsements.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : star - 0.5 <= projectData.endorsements.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">{projectData.endorsements.rating}/5</span>
                      <span className="ml-1 text-sm text-gray-500">({projectData.endorsements.count} ratings)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {projectData.endorsements.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-emerald-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 font-medium text-sm">{testimonial.name}</span>
                        </div>
                        <p className="text-gray-700">{testimonial.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            {/* Funding stats and CTA */}
            <div className="sticky top-4">
              <Card className="border-emerald-100 mb-6">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{projectData.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${projectData.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between mb-1">
                        <span className="text-2xl font-bold text-emerald-700">{projectData.raised} SOL</span>
                        <span className="text-gray-500">of {projectData.goal} SOL</span>
                      </div>
                    </div>

                    <div className="flex justify-between py-4 border-t border-b border-gray-100">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-emerald-600 mr-2" />
                        <div>
                          <div className="font-medium">{projectData.backers}</div>
                          <div className="text-xs text-gray-500">Backers</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                        <div>
                          <div className="font-medium">{projectData.daysRemaining}</div>
                          <div className="text-xs text-gray-500">Days left</div>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
                      onClick={() => setShowContributionModal(true)}
                    >
                      Fund This Project
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Related projects */}
              <Card className="border-emerald-100">
                <CardContent className="p-6">
                  <h3 className="font-medium text-emerald-800 mb-4">Similar Projects</h3>

                  <div className="space-y-4">
                    {projectData.relatedProjects.map((project) => (
                      <Link href={`/projects/${project.id}`} key={project.id}>
                        <div className="flex items-center gap-3 group">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={`/placeholder.svg?height=64&width=64`}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium group-hover:text-emerald-600 transition-colors">
                              {project.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div
                                  className="bg-emerald-500 h-1.5 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span>{project.progress}% funded</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {showContributionModal && (
        <ContributionModal project={projectData} onClose={() => setShowContributionModal(false)} />
      )}
    </div>
  )
}
