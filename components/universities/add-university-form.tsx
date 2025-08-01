"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

import { Card } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Checkbox } from "@/components/ui/checkbox"

import { Upload, Plus, Trash2, Edit, Loader2 } from "lucide-react"

import { useToast } from "@/hooks/use-toast"

import { AddProgramDrawer } from "./add-program-drawer"

interface Program {
  id: number
  name: string
  degree: string
  deadline: string
  merit: string
  fee: string
  duration: string
  status: "Open" | "Closed"
}

interface Weightage {
  type: string
  value: string
}

export function AddUniversityForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [showAddProgram, setShowAddProgram] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [editProgram, setEditProgram] = useState<Program | null>(null)
  const [weightages, setWeightages] = useState<Weightage[]>([
    { type: "Matric", value: "" },
    { type: "FSC", value: "" },
    { type: "Test", value: "" },
  ])

  const [formData, setFormData] = useState({
    fullName: "",
    shortName: "",
    sector: "",
    fieldOfStudy: "",
    city: "",
    websiteUrl: "",
    applyUrl: "",
    email: "",
    phone: "",
    address: "",
    about: "",
    photo: null as File | null,
    admissionTestType: "",
  })

  const [testTypes, setTestTypes] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files[0] }))
    }
  }

  const handleAddProgram = (program: Omit<Program, "id">) => {
    const newProgram = { ...program, id: Date.now() }
    setPrograms((prev) => [...prev, newProgram])
    setShowAddProgram(false)
    toast({ title: "Success", description: "Program added successfully." })
  }

  const handleEditProgram = (program: Program) => {
    setEditProgram(program)
    setShowAddProgram(true)
  }

  const handleUpdateProgram = (updatedProgram: Program) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === (updatedProgram as any).id ? updatedProgram : p))
    )
    setEditProgram(null)
    setShowAddProgram(false)
    toast({ title: "Success", description: "Program updated successfully." })
  }

  const handleDeleteProgram = (id: number) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id))
    toast({ title: "Success", description: "Program deleted successfully." })
  }

  const handleDeleteWeightage = (index: number) => {
    setWeightages((prev) => {
      const newWeightages = [...prev]
      newWeightages[index] = { type: prev[index].type, value: "" }
      return newWeightages
    })
  }

  const handleTestTypeChange = (type: string, checked: boolean) => {
    setTestTypes(checked ? [type] : prev => prev.filter((t) => t !== type))
    setFormData((prev) => ({ ...prev, admissionTestType: checked ? type : "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const payload = {
      fullName: formData.fullName,
      shortName: formData.shortName,
      sector: formData.sector,
      fieldOfStudy: formData.fieldOfStudy,
      city: formData.city,
      address: formData.address,
      about: formData.about,
      photo: formData.photo ? "https://yourdomain.com/logo.png" : null,
      websiteUrl: formData.websiteUrl,
      applyUrl: formData.applyUrl,
      email: formData.email,
      phone: formData.phone,
      admissionTestType: formData.admissionTestType,
      weightages: weightages.map((w) => ({
        type: w.type,
        value: parseInt(w.value.replace("%", "")) || 0,
      })),
      programs: programs.map((p) => ({
        name: p.name,
        degree: p.degree,
        deadline: p.deadline,
        merit: p.merit,
        fee: parseInt(p.fee),
        duration: p.duration,
        status: p.status,
      })),
    }

    console.log("Formatted JSON Payload:", payload)
    try {
      const response = await fetch("http://localhost:4000/api/universities/universities", {
        method: "POST",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2M1ZTAwNTdhMTA3MWZjYWRkMzIzMyIsImlhdCI6MTc1MzYxNzAyMCwiZXhwIjoxNzU0OTEzMDIwfQ.XznS7qSVf6VcITApcnTBvJAiNT5X386UoOPGhTpTBz8",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      console.log("API Response:", result)
      if (response.ok) {
        setTimeout(() => {
          setIsLoading(false)
          toast({
            title: "Success",
            description: "University has been added successfully.",
          })
          setFormData({
            fullName: "",
            shortName: "",
            sector: "",
            fieldOfStudy: "",
            city: "",
            websiteUrl: "",
            applyUrl: "",
            email: "",
            phone: "",
            address: "",
            about: "",
            photo: null,
            admissionTestType: "",
          })
          setPrograms([])
          setWeightages([
            { type: "Matric", value: "" },
            { type: "FSC", value: "" },
            { type: "Test", value: "" },
          ])
          setTestTypes([])
          if (fileInputRef.current) fileInputRef.current.value = ""
        }, 1000)
      } else {
        throw new Error(result.message || "Failed to add university.")
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to add university.",
        variant: "destructive",
      })
      console.error("Error Details:", error)
    }
  }

  const programStats = {
    bachelors: programs.filter((p) => p.degree === "Bachelors").length,
    masters: programs.filter((p) => p.degree.includes("Masters") || p.degree.includes("MPhil")).length,
    phd: programs.filter((p) => p.degree === "PhD").length,
  }

  const allFieldsFilled = formData.fullName && formData.shortName && formData.sector && formData.fieldOfStudy &&
    formData.city && formData.websiteUrl && formData.applyUrl && formData.email && formData.phone &&
    formData.address && formData.about && formData.photo

  return (
    <div className=" bg-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
            Basic Information
          </TabsTrigger>
          <TabsTrigger value="programs" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
            Programs
          </TabsTrigger>
          <TabsTrigger value="merit" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
            Test Merit Formula
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="mt-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between pb-10">
                <h3 className="text-lg text-black font-semibold">Basic Information</h3>
              </div>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-black">University Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="University of engineering and technology, taxila"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-black">University Logo / Pic</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Drag & drop image or Browse</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2"
                      >
                        Browse
                      </Button>
                      {formData.photo && <p className="text-sm text-gray-600 mt-2">{formData.photo.name}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName" className="text-black">University Short Name</Label>
                    <Input
                      id="shortName"
                      placeholder="eg UET Taxila, LUMS etc"
                      value={formData.shortName}
                      onChange={(e) => handleInputChange("shortName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-black">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      placeholder="https://"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
  <Label htmlFor="sector" className="text-black">Sector</Label>
  <Select
    value={formData.sector}
    onValueChange={(value) => handleInputChange("sector", value)}
    required
  >
    <SelectTrigger>
      <SelectValue placeholder="Select sector" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Public">Government</SelectItem>
      <SelectItem value="Private">Private</SelectItem>
      <SelectItem value="Community">Semi Government</SelectItem>
    </SelectContent>
  </Select>
</div>
                  <div className="space-y-2">
                    <Label htmlFor="applyUrl" className="text-black">Apply Url</Label>
                    <Input
                      id="applyUrl"
                      placeholder="https://"
                      value={formData.applyUrl}
                      onChange={(e) => handleInputChange("applyUrl", e.target.value)}
                      required
                    />
                  </div>
                 <div className="space-y-2">
  <Label htmlFor="fieldOfStudy" className="text-black">Field of Study</Label>
  <Select
    value={formData.fieldOfStudy}
    onValueChange={(value) => handleInputChange("fieldOfStudy", value)}
    required
  >
    <SelectTrigger>
      <SelectValue placeholder="Select field of study" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="business">Business</SelectItem>
      <SelectItem value="engineering">Engineering</SelectItem>
      <SelectItem value="medical">Medical</SelectItem>
      <SelectItem value="arts">Arts</SelectItem>
    </SelectContent>
  </Select>
</div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                 <div className="space-y-2">
  <Label htmlFor="city" className="text-black">City</Label>
  <Select
    value={formData.city}
    onValueChange={(value) => handleInputChange("city", value)}
    required
  >
    <SelectTrigger>
      <SelectValue placeholder="Select city" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Lahore">Lahore</SelectItem>
      <SelectItem value="Karachi">Karachi</SelectItem>
      <SelectItem value="Islamabad">Islamabad</SelectItem>
      <SelectItem value="Taxila">Taxila</SelectItem>
    </SelectContent>
  </Select>
</div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-black">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-black">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter University address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about" className="text-black">About</Label>
                  <Textarea
                    id="about"
                    placeholder="Write about university"
                    rows={4}
                    value={formData.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    className="bg-[#5C5FC8] hover:bg-blue-400"
                    onClick={() => setActiveTab("programs")}
                    disabled={!allFieldsFilled}
                  >
                    Next Programs
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="programs" className="mt-6">
          <Card>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-black font-semibold">Degree Program listing</h3>
                  <Button className="bg-[#5C5FC8] hover:bg-blue-400" onClick={() => { setEditProgram(null); setShowAddProgram(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Program
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-3xl font-bold text-black">
                      {programStats.bachelors.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600">Bachelors</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-3xl font-bold text-black">
                      {programStats.masters.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600">Masters/ MPhil</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-3xl font-bold text-black">
                      {programStats.phd.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600">PhD</div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-black">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Program Name</th>
                        <th className="text-left py-3">Degrees</th>
                        <th className="text-left py-3">Deadline</th>
                        <th className="text-left py-3">Last Year Merit</th>
                        <th className="text-left py-3">Fee Per Semester</th>
                        <th className="text-left py-3">Duration</th>
                        <th className="text-left py-3">Admission Status</th>
                        <th className="text-left py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((program) => (
                        <tr key={program.id} className="border-b">
                          <td className="py-3">{program.name}</td>
                          <td className="py-3">{program.degree}</td>
                          <td className="py-3">{program.deadline}</td>
                          <td className="py-3">{program.merit}</td>
                          <td className="py-3">{program.fee}</td>
                          <td className="py-3">{program.duration}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                program.status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {program.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditProgram(program)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteProgram(program.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-sm text-gray-600">
                  1-{programs.length} of {programs.length}
                </div>
                <div className="flex items-center bg-transparent justify-between pt-6">
                  <Button variant="outline" onClick={() => setActiveTab("basic")}>
                    Previous
                  </Button>
                  <Button className="bg-[#5C5FC8] hover:bg-blue-400" onClick={() => setActiveTab("merit")} disabled={programs.length === 0}>
                    Next Merit Calculator
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="merit" className="mt-6">
          <Card>
            <div className="p-6 text-black">
              <div className="space-y-6">
                <Tabs defaultValue={programs.some(p => p.degree === "Bachelors") ? "bachelors" : programs.some(p => p.degree.includes("Masters") || p.degree.includes("MPhil")) ? "masters" : programs.some(p => p.degree === "PhD") ? "phd" : "bachelors"} className="w-full">
                  <TabsList className="bg-gray-100 w-full justify-start">
                    <TabsTrigger value="bachelors" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1">Bachelors</TabsTrigger>
                    <TabsTrigger value="masters" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1">Masters</TabsTrigger>
                    <TabsTrigger value="mphil" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1">MPhil</TabsTrigger>
                    <TabsTrigger value="phd" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1">PhD</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="space-y-4">
                  <h3 className="font-semibold">Admission Test Type</h3>
                  <div className="grid grid-cols-6 gap-4">
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ecat" checked={testTypes.includes("Ecat")} onCheckedChange={(checked) => handleTestTypeChange("Ecat", checked as boolean)} />
                        <Label htmlFor="ecat">Ecat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mcat" checked={testTypes.includes("Mcat")} onCheckedChange={(checked) => handleTestTypeChange("Mcat", checked as boolean)} />
                        <Label htmlFor="mcat">Mcat</Label>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="own-test" checked={testTypes.includes("Own Test")} onCheckedChange={(checked) => handleTestTypeChange("Own Test", checked as boolean)} />
                        <Label htmlFor="own-test">Own Test</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="nts" checked={testTypes.includes("NTS")} onCheckedChange={(checked) => handleTestTypeChange("NTS", checked as boolean)} />
                        <Label htmlFor="nts">NTS</Label>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sat" checked={testTypes.includes("SAT")} onCheckedChange={(checked) => handleTestTypeChange("SAT", checked as boolean)} />
                        <Label htmlFor="sat">SAT</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="gat" checked={testTypes.includes("GAT")} onCheckedChange={(checked) => handleTestTypeChange("GAT", checked as boolean)} />
                        <Label htmlFor="gat">GAT</Label>
                      </div>
                    </div>
                  </div>
                </div>
                {weightages.map((weightage, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{weightage.type} Weightage</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="0%"
                        value={weightage.value}
                        onChange={(e) => {
                          const newWeightages = [...weightages]
                          newWeightages[index] = { type: weightage.type, value: e.target.value }
                          setWeightages(newWeightages)
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 border border-gray-300 rounded-md px-4 py-5"
                        onClick={() => handleDeleteWeightage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-6">
                  <Button className="bg-transparent" variant="outline" onClick={() => setActiveTab("programs")}>
                    Previous
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" className="bg-transparent text-[#5C5FC8] border-[#5C5FC8] hover:bg-blue-400">Move to Inprogress</Button>
                    <Button className="bg-[#5C5FC8] hover:bg-blue-400" onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {isLoading ? "Uploading..." : "Upload University"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      <AddProgramDrawer
        open={showAddProgram}
        onClose={() => { setShowAddProgram(false); setEditProgram(null); }}
        onAdd={editProgram ? handleUpdateProgram : handleAddProgram}
        initialData={editProgram ? {
          name: editProgram.name,
          degree: editProgram.degree,
          deadline: editProgram.deadline,
          merit: editProgram.merit,
          fee: editProgram.fee,
          duration: editProgram.duration,
          status: editProgram.status
        } : undefined}
        isEdit={!!editProgram}
      />
    </div>
  )
}