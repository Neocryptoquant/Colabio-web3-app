"use client"

import type React from "react"

import { useState } from "react"
import { Upload, MapPin, Plus, Trash2, Users, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"

type CreationStep = "basics" | "funding" | "media" | "team" | "docs" | "review"

interface Milestone {
  id: string
  name: string
  description: string
  amount: number | string
  date: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo: string | null
}

export function ProjectCreation() {
  const [currentStep, setCurrentStep] = useState<CreationStep>("basics")
  const [projectData, setProjectData] = useState({
    title: "",
    tagline: "",
    description: "",
    location: "",
    technology: "",
    goalAmount: "",
    duration: "",
    milestones: [
      {
        id: "1",
        name: "",
        description: "",
        amount: "",
        date: "",
      },
    ] as Milestone[],
    media: [] as string[],
    team: [
      {
        id: "1",
        name: "",
        role: "",
        bio: "",
        photo: null,
      },
    ] as TeamMember[],
    documents: {
      feasibility: null,
      permits: null,
      environmental: null,
    },
  })

  const steps = [
    { id: "basics", label: "Basic Info" },
    { id: "funding", label: "Funding" },
    { id: "media", label: "Media" },
    { id: "team", label: "Team" },
    { id: "docs", label: "Documents" },
    { id: "review", label: "Review" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMilestoneChange = (id: string, field: keyof Milestone, value: string | number) => {
    setProjectData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone,
      ),
    }))
  }

  const addMilestone = () => {
    setProjectData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id: Date.now().toString(),
          name: "",
          description: "",
          amount: "",
          date: "",
        },
      ],
    }))
  }

  const removeMilestone = (id: string) => {
    setProjectData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((milestone) => milestone.id !== id),
    }))
  }

  const handleTeamMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setProjectData((prev) => ({
      ...prev,
      team: prev.team.map((member) => (member.id === id ? { ...member, [field]: value } : member)),
    }))
  }

  const addTeamMember = () => {
    setProjectData((prev) => ({
      ...prev,
      team: [
        ...prev.team,
        {
          id: Date.now().toString(),
          name: "",
          role: "",
          bio: "",
          photo: null,
        },
      ],
    }))
  }

  const removeTeamMember = (id: string) => {
    setProjectData((prev) => ({
      ...prev,
      team: prev.team.filter((member) => member.id !== id),
    }))
  }

  const nextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as CreationStep)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as CreationStep)
      window.scrollTo(0, 0)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "basics":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={projectData.title}
                onChange={handleInputChange}
                placeholder="e.g., Community Solar Array"
                className="border-emerald-100"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                value={projectData.tagline}
                onChange={handleInputChange}
                placeholder="A brief one-line description"
                className="border-emerald-100"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                placeholder="Describe your green energy project in detail..."
                className="min-h-32 border-emerald-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    value={projectData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="pl-10 border-emerald-100"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="technology">Technology Type</Label>
                <Select
                  value={projectData.technology}
                  onValueChange={(value) => handleSelectChange("technology", value)}
                >
                  <SelectTrigger className="border-emerald-100">
                    <SelectValue placeholder="Select technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Solar</SelectItem>
                    <SelectItem value="wind">Wind</SelectItem>
                    <SelectItem value="hydro">Hydro</SelectItem>
                    <SelectItem value="biomass">Biomass</SelectItem>
                    <SelectItem value="geothermal">Geothermal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "funding":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="goalAmount">Funding Goal (SOL)</Label>
                <Input
                  id="goalAmount"
                  name="goalAmount"
                  type="number"
                  value={projectData.goalAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  className="border-emerald-100"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="duration">Funding Duration (days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={projectData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  className="border-emerald-100"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Project Milestones</Label>
                <Button type="button" variant="outline" size="sm" className="border-emerald-100" onClick={addMilestone}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-4">
                {projectData.milestones.map((milestone, index) => (
                  <Card key={milestone.id} className="border-emerald-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Milestone {index + 1}</h4>
                        {projectData.milestones.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(milestone.id)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`milestone-${milestone.id}-name`} className="text-xs">
                              Name
                            </Label>
                            <Input
                              id={`milestone-${milestone.id}-name`}
                              value={milestone.name}
                              onChange={(e) => handleMilestoneChange(milestone.id, "name", e.target.value)}
                              placeholder="e.g., Land Acquisition"
                              className="border-emerald-100 mt-1"
                            />
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Label htmlFor={`milestone-${milestone.id}-amount`} className="text-xs">
                                Amount (SOL)
                              </Label>
                              <Input
                                id={`milestone-${milestone.id}-amount`}
                                type="number"
                                value={milestone.amount}
                                onChange={(e) => handleMilestoneChange(milestone.id, "amount", e.target.value)}
                                placeholder="e.g., 100"
                                className="border-emerald-100 mt-1"
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={`milestone-${milestone.id}-date`} className="text-xs">
                                Target Date
                              </Label>
                              <Input
                                id={`milestone-${milestone.id}-date`}
                                type="date"
                                value={milestone.date}
                                onChange={(e) => handleMilestoneChange(milestone.id, "date", e.target.value)}
                                className="border-emerald-100 mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`milestone-${milestone.id}-description`} className="text-xs">
                            Description
                          </Label>
                          <Textarea
                            id={`milestone-${milestone.id}-description`}
                            value={milestone.description}
                            onChange={(e) => handleMilestoneChange(milestone.id, "description", e.target.value)}
                            placeholder="Describe what will be accomplished in this milestone..."
                            className="border-emerald-100 min-h-20 mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "media":
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-emerald-500 mb-3" />
                <h3 className="text-lg font-medium mb-1">Upload Project Images</h3>
                <p className="text-sm text-gray-500 mb-4">Drag and drop your images here, or click to browse</p>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Select Files</Button>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG or WEBP (max. 5MB each)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <Plus className="h-8 w-8 text-gray-400" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 hidden group-hover:flex"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Label htmlFor="mainImageCaption">Main Image Caption</Label>
              <Input
                id="mainImageCaption"
                placeholder="Describe your main project image"
                className="border-emerald-100"
              />
            </div>
          </div>
        )

      case "team":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Team Members</Label>
              <Button type="button" variant="outline" size="sm" className="border-emerald-100" onClick={addTeamMember}>
                <Plus className="h-4 w-4 mr-1" />
                Add Team Member
              </Button>
            </div>

            <div className="space-y-4">
              {projectData.team.map((member, index) => (
                <Card key={member.id} className="border-emerald-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Team Member {index + 1}</h4>
                      {projectData.team.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTeamMember(member.id)}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <div className="flex flex-col items-center">
                          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                            <Users className="h-10 w-10 text-gray-400" />
                          </div>
                          <Button type="button" variant="outline" size="sm" className="text-xs border-emerald-100">
                            Upload Photo
                          </Button>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <Label htmlFor={`team-${member.id}-name`} className="text-xs">
                            Name
                          </Label>
                          <Input
                            id={`team-${member.id}-name`}
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(member.id, "name", e.target.value)}
                            placeholder="Full name"
                            className="border-emerald-100 mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`team-${member.id}-role`} className="text-xs">
                            Role
                          </Label>
                          <Input
                            id={`team-${member.id}-role`}
                            value={member.role}
                            onChange={(e) => handleTeamMemberChange(member.id, "role", e.target.value)}
                            placeholder="e.g., Project Manager"
                            className="border-emerald-100 mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`team-${member.id}-bio`} className="text-xs">
                            Bio
                          </Label>
                          <Textarea
                            id={`team-${member.id}-bio`}
                            value={member.bio}
                            onChange={(e) => handleTeamMemberChange(member.id, "bio", e.target.value)}
                            placeholder="Brief professional background..."
                            className="border-emerald-100 min-h-20 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "docs":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Technical Feasibility Study</Label>
              <div className="border-2 border-dashed border-emerald-200 rounded-lg p-4 text-center">
                <div className="flex flex-col items-center">
                  <FileText className="h-8 w-8 text-emerald-500 mb-2" />
                  <p className="text-sm text-gray-500 mb-3">Upload a technical feasibility study for your project</p>
                  <Button type="button" variant="outline" size="sm" className="border-emerald-100">
                    Select File
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">PDF or DOC (max. 10MB)</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Permits and Approvals</Label>
              <div className="border-2 border-dashed border-emerald-200 rounded-lg p-4 text-center">
                <div className="flex flex-col items-center">
                  <FileText className="h-8 w-8 text-emerald-500 mb-2" />
                  <p className="text-sm text-gray-500 mb-3">Upload any permits or regulatory approvals</p>
                  <Button type="button" variant="outline" size="sm" className="border-emerald-100">
                    Select Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">PDF or DOC (max. 10MB each)</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Environmental Impact Assessment</Label>
              <div className="border-2 border-dashed border-emerald-200 rounded-lg p-4 text-center">
                <div className="flex flex-col items-center">
                  <FileText className="h-8 w-8 text-emerald-500 mb-2" />
                  <p className="text-sm text-gray-500 mb-3">Upload environmental impact documentation</p>
                  <Button type="button" variant="outline" size="sm" className="border-emerald-100">
                    Select File
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">PDF or DOC (max. 10MB)</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "review":
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-emerald-800">Ready for submission</h3>
                  <p className="text-sm text-emerald-700">
                    Your project is ready to be submitted for community validation
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-emerald-100">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Project Preview</h3>
                  <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Project thumbnail</p>
                  </div>
                  <h4 className="font-medium">{projectData.title || "Project Title"}</h4>
                  <p className="text-sm text-gray-600 mb-2">{projectData.tagline || "Project tagline"}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{projectData.location || "Location"}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Funding Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-md border border-emerald-100">
                      <p className="text-xs text-gray-500">Goal Amount</p>
                      <p className="font-medium">{projectData.goalAmount || "0"} SOL</p>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-emerald-100">
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">{projectData.duration || "0"} days</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Milestones</h3>
                  <div className="bg-white p-3 rounded-md border border-emerald-100">
                    <p className="text-xs text-gray-500">Number of Milestones</p>
                    <p className="font-medium">{projectData.milestones.length}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Team</h3>
                  <div className="bg-white p-3 rounded-md border border-emerald-100">
                    <p className="text-xs text-gray-500">Team Members</p>
                    <p className="font-medium">{projectData.team.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
              <p className="text-sm text-blue-700">
                After submission, your project will enter the community validation phase. Community members will review
                and vote on your project. Once approved, it will be listed on the platform for funding.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <MainNav />

      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Create a Project</h1>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
                    currentStep === step.id
                      ? "bg-emerald-600 text-white"
                      : steps.findIndex((s) => s.id === currentStep) > index
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 md:w-24 ${
                      steps.findIndex((s) => s.id === currentStep) > index ? "bg-emerald-200" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className="text-xs text-gray-500 w-8 text-center">
                {step.label}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-emerald-100">
          <CardContent className="p-6">
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === "basics"}
                className="border-emerald-100"
              >
                Previous
              </Button>

              {currentStep === "review" ? (
                <Button className="bg-emerald-600 hover:bg-emerald-700">Submit Project</Button>
              ) : (
                <Button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
                  Continue
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
