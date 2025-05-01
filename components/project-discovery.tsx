"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"

// Replace the sample data with state variables
// const featuredProjects = [...]
// const allProjects = [...]

// Add these state variables after the existing useState calls
const [featuredProjects, setFeaturedProjects] = useState([])
const [allProjects, setAllProjects] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [showFilters, setShowFilters] = useState(false) // Move here to avoid conditional hook call
const [carouselIndex, setCarouselIndex] = useState(0)

// Sample data for featured projects
// const featuredProjects = [
//   {
//     id: "1",
//     title: "Community Solar Array",
//     description: "Solar power installation for a rural community center",
//     location: "Greenville, CA",
//     image: "/project-solar.jpg",
//     progress: 65,
//     goal: 500,
//     raised: 325,
//     risk: "low",
//   },
//   {
//     id: "2",
//     title: "Wind Farm Expansion",
//     description: "Adding 5 new turbines to existing wind farm",
//     location: "Windhaven, OR",
//     image: "/project-wind.jpg",
//     progress: 42,
//     goal: 800,
//     raised: 336,
//     risk: "medium",
//   },
//   {
//     id: "3",
//     title: "Micro Hydro Power",
//     description: "Small-scale hydro power for mountain community",
//     location: "Riverdale, WA",
//     image: "/project-hydro.jpg",
//     progress: 78,
//     goal: 300,
//     raised: 234,
//     risk: "low",
//   },
//   {
//     id: "4",
//     title: "Biomass Conversion Plant",
//     description: "Converting agricultural waste to clean energy",
//     location: "Farmington, ID",
//     image: "/project-biomass.jpg",
//     progress: 25,
//     goal: 1200,
//     raised: 300,
//     risk: "high",
//   },
// ]

// Sample data for all projects
// const allProjects = [
//   ...featuredProjects,
//   {
//     id: "5",
//     title: "School Solar Rooftop",
//     description: "Solar panels for local elementary school",
//     location: "Sunnydale, AZ",
//     image: "/project-school.jpg",
//     progress: 90,
//     goal: 200,
//     raised: 180,
//     risk: "low",
//   },
//   {
//     id: "6",
//     title: "Geothermal Heating Network",
//     description: "Community geothermal heating system",
//     location: "Hotsprings, NV",
//     image: "/project-geothermal.jpg",
//     progress: 35,
//     goal: 750,
//     raised: 262.5,
//     risk: "medium",
//   },
//   {
//     id: "7",
//     title: "Tidal Energy Prototype",
//     description: "Testing new tidal energy technology",
//     location: "Bayshore, ME",
//     image: "/project-tidal.jpg",
//     progress: 15,
//     goal: 1500,
//     raised: 225,
//     risk: "high",
//   },
//   {
//     id: "8",
//     title: "Community Battery Storage",
//     description: "Shared battery storage for solar neighborhood",
//     location: "Powertown, TX",
//     image: "/project-battery.jpg",
//     progress: 50,
//     goal: 600,
//     raised: 300,
//     risk: "medium",
//   },
//   {
//     id: "9",
//     title: "Vertical Wind Turbines",
//     description: "Urban wind turbines for city center",
//     location: "Metropolis, NY",
//     image: "/project-vertical.jpg",
//     progress: 30,
//     goal: 400,
//     raised: 120,
//     risk: "medium",
//   },
// ]

export function ProjectDiscovery() {
  // Add this useEffect to fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()

          // Filter active projects for featured
          const active = data.projects.filter((p) => p.status === "active")
          setFeaturedProjects(active.slice(0, 4))

          // All projects
          setAllProjects(data.projects)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const nextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1 >= featuredProjects.length - 2 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 < 0 ? featuredProjects.length - 3 : prevIndex - 1))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-emerald-100 text-emerald-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <MainNav />

      <main className="container px-4 py-8">
        {/* Hero section with featured projects carousel */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-emerald-800 mb-6">Featured Projects</h1>

          <div className="relative">
            <div className="flex overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${carouselIndex * 33.33}%)` }}
              >
                {featuredProjects.map((project) => (
                  <div key={project.id} className="w-full md:w-1/3 flex-shrink-0 px-2">
                    <Card className="h-full border-emerald-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                        <div className="absolute bottom-3 left-3 z-20">
                          <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800">
                            <MapPin className="mr-1 h-3 w-3" />
                            {project.location}
                          </span>
                        </div>
                        <Image
                          src={`/placeholder.svg?height=192&width=384`}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1 text-emerald-800">{project.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{project.progress}% funded</span>
                            <span className="font-medium">{project.raised} SOL</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(project.risk)}`}>
                          {project.risk.charAt(0).toUpperCase() + project.risk.slice(1)} risk
                        </span>
                        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <Link href={`/projects/${project.id}`}>Fund Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 border-emerald-100 z-10"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 border-emerald-100 z-10"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Search and filter section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-3/4 flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search projects..." className="pl-10 border-emerald-100" />
              </div>
              <Button
                variant="outline"
                className="ml-2 border-emerald-100"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="w-full md:w-1/4">
              <Select defaultValue="newest">
                <SelectTrigger className="border-emerald-100">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="funded">Most funded</SelectItem>
                  <SelectItem value="ending">Ending soon</SelectItem>
                  <SelectItem value="risk">Lowest risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-emerald-100 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-emerald-800">Location</h3>
                <Select>
                  <SelectTrigger className="border-emerald-100">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    <SelectItem value="west">West Coast</SelectItem>
                    <SelectItem value="midwest">Midwest</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="northeast">Northeast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-emerald-800">Technology Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="solar" defaultChecked />
                    <Label htmlFor="solar">Solar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wind" defaultChecked />
                    <Label htmlFor="wind">Wind</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hydro" defaultChecked />
                    <Label htmlFor="hydro">Hydro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="biomass" defaultChecked />
                    <Label htmlFor="biomass">Biomass</Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-emerald-800">Funding Goal (SOL)</h3>
                <Slider defaultValue={[1000]} max={2000} step={100} className="py-4" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0 SOL</span>
                  <span>2000 SOL</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-emerald-800">Risk Score</h3>
                <Slider defaultValue={[75]} max={100} step={5} className="py-4" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>High Risk</span>
                  <span>Low Risk</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Project grid */}
        <section>
          <h2 className="text-2xl font-bold text-emerald-800 mb-6">All Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((project) => (
              <Card key={project.id} className="border-emerald-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800">
                      <MapPin className="mr-1 h-3 w-3" />
                      {project.location}
                    </span>
                  </div>
                  <Image
                    src={`/placeholder.svg?height=192&width=384`}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-emerald-800">{project.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{project.progress}% funded</span>
                      <span className="font-medium">{project.raised} SOL</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(project.risk)}`}>
                    {project.risk.charAt(0).toUpperCase() + project.risk.slice(1)} risk
                  </span>
                  <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href={`/projects/${project.id}`}>Fund Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
