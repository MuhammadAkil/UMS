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
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
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

const validationSchema = Yup.object({
  fullName: Yup.string().max(200, "Full name must be 200 characters or less").required("Full name is required"),
  shortName: Yup.string().max(50, "Short name must be 50 characters or less").required("Short name is required"),
  sector: Yup.string().required("Sector is required"),
  fieldOfStudy: Yup.string().required("Field of study is required"),
  city: Yup.string().required("City is required"),
  websiteUrl: Yup.string().url("Must be a valid URL").required("Website URL is required"),
  applyUrl: Yup.string().url("Must be a valid URL").required("Apply URL is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string().matches(/^\d{4}-\d{7}$/, "Phone must be in format 0300-1234567").required("Phone is required"),
  address: Yup.string().max(500, "Address must be 500 characters or less").required("Address is required"),
  about: Yup.string().max(1000, "About must be 1000 characters or less").required("About is required"),
  photo: Yup.mixed().required("Photo is required").test("fileType", "Photo must be an image", (value) => {
    return value && value instanceof File && value.type.startsWith("image/")
  }),
  admissionTestType: Yup.string().required("At least one admission test type is required"),
  weightages: Yup.array().of(
    Yup.object({
      type: Yup.string(),
      value: Yup.string().matches(/^\d+(\.\d{1,2})?%$/, "Must be a valid percentage (e.g., 80%)").optional(),
    })
  ),
})

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
  const [testTypes, setTestTypes] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initialValues = {
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
    weightages,
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

  const handleTestTypeChange = (type: string, checked: boolean, setFieldValue: (field: string, value: any) => void) => {
    setTestTypes((prev) => {
      const newTestTypes = checked ? [...prev, type] : prev.filter((t) => t !== type)
      setFieldValue("admissionTestType", newTestTypes.length > 0 ? newTestTypes[0] : "")
      return newTestTypes
    })
  }

  const handleSubmit = async (values: typeof initialValues) => {
    setIsLoading(true)
    const payload = {
      fullName: values.fullName,
      shortName: values.shortName,
      sector: values.sector,
      fieldOfStudy: values.fieldOfStudy,
      city: values.city,
      address: values.address,
      about: values.about,
      photo: values.photo ? "https://yourdomain.com/logo.png" : null,
      websiteUrl: values.websiteUrl,
      applyUrl: values.applyUrl,
      email: values.email,
      phone: values.phone,
      admissionTestType: values.admissionTestType,
      weightages: values.weightages.map((w) => ({
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

  return (
    <div className="bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isValid }) => (
          <Form>
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
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-black">University Full Name</Label>
                          <Field
                            as={Input}
                            id="fullName"
                            name="fullName"
                            placeholder="University of engineering and technology, taxila"
                          />
                          <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
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
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setFieldValue("photo", e.target.files[0])
                                }
                              }}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="mt-2"
                            >
                              Browse
                            </Button>
                            {values.photo && <p className="text-sm text-gray-600 mt-2">{values.photo.name}</p>}
                          </div>
                          <ErrorMessage name="photo" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shortName" className="text-black">University Short Name</Label>
                          <Field
                            as={Input}
                            id="shortName"
                            name="shortName"
                            placeholder="eg UET Taxila, LUMS etc"
                          />
                          <ErrorMessage name="shortName" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="websiteUrl" className="text-black">Website URL</Label>
                          <Field
                            as={Input}
                            id="websiteUrl"
                            name="websiteUrl"
                            placeholder="https://"
                          />
                          <ErrorMessage name="websiteUrl" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sector" className="text-black">Sector</Label>
                          <Field name="sector">
                            {({ field }: any) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => setFieldValue("sector", value)}
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
                            )}
                          </Field>
                          <ErrorMessage name="sector" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="applyUrl" className="text-black">Apply Url</Label>
                          <Field
                            as={Input}
                            id="applyUrl"
                            name="applyUrl"
                            placeholder="https://"
                          />
                          <ErrorMessage name="applyUrl" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fieldOfStudy" className="text-black">Field of Study</Label>
                          <Field name="fieldOfStudy">
                            {({ field }: any) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => setFieldValue("fieldOfStudy", value)}
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
                            )}
                          </Field>
                          <ErrorMessage name="fieldOfStudy" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-black">Email</Label>
                          <Field
                            as={Input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="contact@example.com"
                          />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-black">City</Label>
                          <Field name="city">
                            {({ field }: any) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => setFieldValue("city", value)}
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
                            )}
                          </Field>
                          <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-black">Phone</Label>
                          <Field
                            as={Input}
                            id="phone"
                            name="phone"
                            placeholder="0300-1234567"
                          />
                          <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-black">Address</Label>
                        <Field
                          as={Textarea}
                          id="address"
                          name="address"
                          placeholder="Enter University address"
                          rows={3}
                        />
                        <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about" className="text-black">About</Label>
                        <Field
                          as={Textarea}
                          id="about"
                          name="about"
                          placeholder="Write about university"
                          rows={4}
                        />
                        <ErrorMessage name="about" component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="flex items-center justify-end space-x-4 pt-6">
                        <Button
                          type="button"
                          className="bg-[#5C5FC8] hover:bg-blue-400"
                          onClick={() => setActiveTab("programs")}
                          disabled={!isValid}
                        >
                          Next Programs
                        </Button>
                      </div>
                    </div>
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
                              <Checkbox
                                id="ecat"
                                checked={testTypes.includes("Ecat")}
                                onCheckedChange={(checked) => handleTestTypeChange("Ecat", checked as boolean, setFieldValue)}
                              />
                              <Label htmlFor="ecat">Ecat</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mcat"
                                checked={testTypes.includes("Mcat")}
                                onCheckedChange={(checked) => handleTestTypeChange("Mcat", checked as boolean, setFieldValue)}
                              />
                              <Label htmlFor="mcat">Mcat</Label>
                            </div>
                          </div>
                          <div className="space-y-2 col-span-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="own-test"
                                checked={testTypes.includes("Own Test")}
                                onCheckedChange={(checked) => handleTestTypeChange("Own Test", checked as boolean, setFieldValue)}
                              />
                              <Label htmlFor="own-test">Own Test</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="nts"
                                checked={testTypes.includes("NTS")}
                                onCheckedChange={(checked) => handleTestTypeChange("NTS", checked as boolean, setFieldValue)}
                              />
                              <Label htmlFor="nts">NTS</Label>
                            </div>
                          </div>
                          <div className="space-y-2 col-span-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="sat"
                                checked={testTypes.includes("SAT")}
                                onCheckedChange={(checked) => handleTestTypeChange("SAT", checked as boolean, setFieldValue)}
                              />
                              <Label htmlFor="sat">SAT</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="gat"
                                checked={testTypes.includes("GAT")}
                                onCheckedChange={(checked) => handleTestTypeChange("GAT", checked as boolean, setFieldValue)}
                              />
                              <Label htmlFor="gat">GAT</Label>
                            </div>
                          </div>
                        </div>
                        <ErrorMessage name="admissionTestType" component="div" className="text-red-500 text-sm" />
                      </div>
                      {weightages.map((weightage, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>{weightage.type} Weightage</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Field
                              as={Input}
                              name={`weightages[${index}].value`}
                              placeholder="0%"
                              value={weightage.value}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newWeightages = [...weightages]
                                newWeightages[index] = { type: weightage.type, value: e.target.value }
                                setWeightages(newWeightages)
                                setFieldValue(`weightages[${index}].value`, e.target.value)
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
                          <ErrorMessage name={`weightages[${index}].value`} component="div" className="text-red-500 text-sm" />
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-6">
                        <Button className="bg-transparent" variant="outline" onClick={() => setActiveTab("programs")}>
                          Previous
                        </Button>
                        <div className="space-x-2">
                          <Button variant="outline" className="bg-transparent text-[#5C5FC8] border-[#5C5FC8] hover:bg-blue-400">Move to Inprogress</Button>
                          <Button className="bg-[#5C5FC8] hover:bg-blue-400" type="submit" disabled={isLoading || !isValid}>
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
          </Form>
        )}
      </Formik>
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