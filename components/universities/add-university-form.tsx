"use client";

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
import { Upload, Plus, Trash2, Edit, Loader2, X } from "lucide-react" // Added X import
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { AddProgramDrawer } from "./add-program-drawer"
import { universityAPI } from "@/lib/api/universities"

interface Program {
  id: number;
  name: string;
  degree: string;
  deadline: string;
  merit: string;
  fee: string;
  duration: string;
  status: "Open" | "Closed";
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
  photo: Yup.mixed().optional(),
  admissionTestType: Yup.string().optional(),
  weightages: Yup.array().optional(), // Make weightages completely optional
  bachelors_weightages: Yup.array().optional(), // Add new field names
  masters_weightages: Yup.array().optional(),
  mphil_weightages: Yup.array().optional(),
  phd_weightages: Yup.array().optional(),
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
  const [showAddFieldModal, setShowAddFieldModal] = useState(false)
  const [newField, setNewField] = useState({ type: "", value: "" })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync weightages state with form values
  useEffect(() => {
    // Weightages state updated
  }, [weightages])

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
    weightages: [
      { type: "Matric", value: "" },
      { type: "FSC", value: "" },
      { type: "Test", value: "" },
    ],
    bachelors_weightages: [
      { type: "Matric", value: "" },
      { type: "FSC", value: "" },
      { type: "Test", value: "" },
    ],
    masters_weightages: [
      { type: "Bachelor's CGPA/Percentage", value: "" },
      { type: "Entry Test", value: "" },
      { type: "Interview", value: "" },
    ],
    mphil_weightages: [
      { type: "Master's CGPA/Percentage", value: "" },
      { type: "Entry Test", value: "" },
      { type: "Interview", value: "" },
    ],
    phd_weightages: [
      { type: "Master's CGPA/Percentage", value: "" },
      { type: "Entry Test", value: "" },
      { type: "Interview", value: "" },
    ],
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

  const handleUpdateProgram = (programData: Omit<Program, "id">) => {
    if (editProgram) {
      const updatedProgram = { ...programData, id: editProgram.id }
      setPrograms((prev) => prev.map((p) => (p.id === editProgram.id ? updatedProgram : p)))
      setEditProgram(null)
      setShowAddProgram(false)
      toast({ title: "Success", description: "Program updated successfully." })
    }
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

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="space-y-2">
      {/* Header with percentage and max value */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-700 font-medium">Total Percentage: {percentage}%</span>
        <span className="text-red-500 font-medium">Max equal 100%</span>
      </div>

      {/* Progress bar container */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

  const handleSubmit = async (values: typeof initialValues) => {
    console.log("🚀 Form submission started!")
    console.log("📦 Payload being sent:", {
      fullName: values.fullName,
      shortName: values.shortName,
      programsCount: programs.length,
      weightagesCount: weightages.filter(w => w.value).length
    })
    
    setIsLoading(true)
    const formData = new FormData()
    if (values.photo) {
      formData.append("photo", values.photo)
    }

    const payload = {
      fullName: values.fullName,
      shortName: values.shortName,
      sector: values.sector,
      fieldOfStudy: values.fieldOfStudy,
      city: values.city,
      websiteUrl: values.websiteUrl,
      applyUrl: values.applyUrl,
      email: values.email,
      phone: values.phone,
      address: values.address,
      about: values.about,
      admissionTestType: values.admissionTestType,
      weightages: weightages.filter((w) => w.value), // Use the state directly instead of values.weightages
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

    console.log("🌐 Making API call to universityAPI.createUniversity...")
    
    try {
      const result = await universityAPI.createUniversity(payload)
      console.log("✅ API Response:", result)
      
      if (result.success) {
        console.log("🎉 Success! University added successfully.")
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
      console.error("❌ API Error:", error)
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

  const handleAddField = () => {
    if (newField.type && newField.value) {
      setWeightages((prev) => [...prev, { type: newField.type, value: newField.value }])
      setNewField({ type: "", value: "" })
      setShowAddFieldModal(false)
      toast({ title: "Success", description: "Field added successfully." })
    }
  }

  const handleConfirmDelete = (index: number) => {
    setWeightages((prev) => prev.filter((_, i) => i !== index))
    setShowDeleteConfirm(null)
    toast({ title: "Success", description: "Field deleted successfully." })
  }

  return (
    <div className="bg-white p-4 rounded-md border">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isValid, submitForm }) => (
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
                                  <SelectItem value="Public">Public/Government</SelectItem>
                                  <SelectItem value="Private">Private</SelectItem>
                                  <SelectItem value="Semi-Government">Semi-Government</SelectItem>
                                  <SelectItem value="Federal">Federal</SelectItem>
                                  <SelectItem value="Provincial">Provincial</SelectItem>
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
                                  <SelectItem value="Engineering">Engineering</SelectItem>
                                  <SelectItem value="Medical">Medical</SelectItem>
                                  <SelectItem value="Business">Business/Commerce</SelectItem>
                                  <SelectItem value="Computer Science">Computer Science/IT</SelectItem>
                                  <SelectItem value="Arts">Arts & Humanities</SelectItem>
                                  <SelectItem value="Science">Natural Sciences</SelectItem>
                                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                                  <SelectItem value="Law">Law</SelectItem>
                                  <SelectItem value="Education">Education</SelectItem>
                                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                                  <SelectItem value="Architecture">Architecture</SelectItem>
                                  <SelectItem value="Economics">Economics</SelectItem>
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
                                  <SelectItem value="Abbottabad">Abbottabad</SelectItem>
                                  <SelectItem value="Attock">Attock</SelectItem>
                                  <SelectItem value="Awaran">Awaran</SelectItem>
                                  <SelectItem value="Badin">Badin</SelectItem>
                                  <SelectItem value="Bahawalnagar">Bahawalnagar</SelectItem>
                                  <SelectItem value="Bahawalpur">Bahawalpur</SelectItem>
                                  <SelectItem value="Bajaur">Bajaur</SelectItem>
                                  <SelectItem value="Bannu">Bannu</SelectItem>
                                  <SelectItem value="Barkhan">Barkhan</SelectItem>
                                  <SelectItem value="Battagram">Battagram</SelectItem>
                                  <SelectItem value="Bhakkar">Bhakkar</SelectItem>
                                  <SelectItem value="Buner">Buner</SelectItem>
                                  <SelectItem value="Burewala">Burewala</SelectItem>
                                  <SelectItem value="Chakwal">Chakwal</SelectItem>
                                  <SelectItem value="Chaman">Chaman</SelectItem>
                                  <SelectItem value="Charsadda">Charsadda</SelectItem>
                                  <SelectItem value="Chiniot">Chiniot</SelectItem>
                                  <SelectItem value="Chitral">Chitral</SelectItem>
                                  <SelectItem value="Dadu">Dadu</SelectItem>
                                  <SelectItem value="Dera Bugti">Dera Bugti</SelectItem>
                                  <SelectItem value="Dera Ghazi Khan">Dera Ghazi Khan</SelectItem>
                                  <SelectItem value="Dera Ismail Khan">Dera Ismail Khan</SelectItem>
                                  <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                                  <SelectItem value="Ghotki">Ghotki</SelectItem>
                                  <SelectItem value="Gujranwala">Gujranwala</SelectItem>
                                  <SelectItem value="Gujrat">Gujrat</SelectItem>
                                  <SelectItem value="Gwadar">Gwadar</SelectItem>
                                  <SelectItem value="Hafizabad">Hafizabad</SelectItem>
                                  <SelectItem value="Hangu">Hangu</SelectItem>
                                  <SelectItem value="Haripur">Haripur</SelectItem>
                                  <SelectItem value="Harnai">Harnai</SelectItem>
                                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                                  <SelectItem value="Islamabad">Islamabad</SelectItem>
                                  <SelectItem value="Jacobabad">Jacobabad</SelectItem>
                                  <SelectItem value="Jaffarabad">Jaffarabad</SelectItem>
                                  <SelectItem value="Jamshoro">Jamshoro</SelectItem>
                                  <SelectItem value="Jatoi">Jatoi</SelectItem>
                                  <SelectItem value="Jhang">Jhang</SelectItem>
                                  <SelectItem value="Jhal Magsi">Jhal Magsi</SelectItem>
                                  <SelectItem value="Jhelum">Jhelum</SelectItem>
                                  <SelectItem value="Kambar Shahdadkot">Kambar Shahdadkot</SelectItem>
                                  <SelectItem value="Kamoke">Kamoke</SelectItem>
                                  <SelectItem value="Karachi">Karachi</SelectItem>
                                  <SelectItem value="Karak">Karak</SelectItem>
                                  <SelectItem value="Kashmore">Kashmore</SelectItem>
                                  <SelectItem value="Kasur">Kasur</SelectItem>
                                  <SelectItem value="Kech">Kech</SelectItem>
                                  <SelectItem value="Khanewal">Khanewal</SelectItem>
                                  <SelectItem value="Khairpur">Khairpur</SelectItem>
                                  <SelectItem value="Khyber">Khyber</SelectItem>
                                  <SelectItem value="Khushab">Khushab</SelectItem>
                                  <SelectItem value="Khuzdar">Khuzdar</SelectItem>
                                  <SelectItem value="Killa Abdullah">Killa Abdullah</SelectItem>
                                  <SelectItem value="Killa Saifullah">Killa Saifullah</SelectItem>
                                  <SelectItem value="Kohistan">Kohistan</SelectItem>
                                  <SelectItem value="Kohlu">Kohlu</SelectItem>
                                  <SelectItem value="Kohat">Kohat</SelectItem>
                                  <SelectItem value="Kurram">Kurram</SelectItem>
                                  <SelectItem value="Lahore">Lahore</SelectItem>
                                  <SelectItem value="Lakki Marwat">Lakki Marwat</SelectItem>
                                  <SelectItem value="Larkana">Larkana</SelectItem>
                                  <SelectItem value="Lasbela">Lasbela</SelectItem>
                                  <SelectItem value="Layyah">Layyah</SelectItem>
                                  <SelectItem value="Lodhran">Lodhran</SelectItem>
                                  <SelectItem value="Lower Dir">Lower Dir</SelectItem>
                                  <SelectItem value="Malakand">Malakand</SelectItem>
                                  <SelectItem value="Mandi Bahauddin">Mandi Bahauddin</SelectItem>
                                  <SelectItem value="Mansehra">Mansehra</SelectItem>
                                  <SelectItem value="Mardan">Mardan</SelectItem>
                                  <SelectItem value="Matiari">Matiari</SelectItem>
                                  <SelectItem value="Mianwali">Mianwali</SelectItem>
                                  <SelectItem value="Mingora">Mingora</SelectItem>
                                  <SelectItem value="Mirpur Khas">Mirpur Khas</SelectItem>
                                  <SelectItem value="Mohmand">Mohmand</SelectItem>
                                  <SelectItem value="Multan">Multan</SelectItem>
                                  <SelectItem value="Muzaffargarh">Muzaffargarh</SelectItem>
                                  <SelectItem value="Murree">Murree</SelectItem>
                                  <SelectItem value="Musakhel">Musakhel</SelectItem>
                                  <SelectItem value="Narowal">Narowal</SelectItem>
                                  <SelectItem value="Naseerabad">Naseerabad</SelectItem>
                                  <SelectItem value="Naushahro Feroze">Naushahro Feroze</SelectItem>
                                  <SelectItem value="Nawabshah">Nawabshah</SelectItem>
                                  <SelectItem value="North Waziristan">North Waziristan</SelectItem>
                                  <SelectItem value="Nowshera">Nowshera</SelectItem>
                                  <SelectItem value="Okara">Okara</SelectItem>
                                  <SelectItem value="Orakzai">Orakzai</SelectItem>
                                  <SelectItem value="Pakpattan">Pakpattan</SelectItem>
                                  <SelectItem value="Panjgur">Panjgur</SelectItem>
                                  <SelectItem value="Peshawar">Peshawar</SelectItem>
                                  <SelectItem value="Pishin">Pishin</SelectItem>
                                  <SelectItem value="Quetta">Quetta</SelectItem>
                                  <SelectItem value="Rahim Yar Khan">Rahim Yar Khan</SelectItem>
                                  <SelectItem value="Rajanpur">Rajanpur</SelectItem>
                                  <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
                                  <SelectItem value="Sadiqabad">Sadiqabad</SelectItem>
                                  <SelectItem value="Sahiwal">Sahiwal</SelectItem>
                                  <SelectItem value="Sanghar">Sanghar</SelectItem>
                                  <SelectItem value="Sargodha">Sargodha</SelectItem>
                                  <SelectItem value="Shaheed Benazirabad">Shaheed Benazirabad</SelectItem>
                                  <SelectItem value="Shangla">Shangla</SelectItem>
                                  <SelectItem value="Sheikhupura">Sheikhupura</SelectItem>
                                  <SelectItem value="Sherani">Sherani</SelectItem>
                                  <SelectItem value="Shikarpur">Shikarpur</SelectItem>
                                  <SelectItem value="Sialkot">Sialkot</SelectItem>
                                  <SelectItem value="Sibi">Sibi</SelectItem>
                                  <SelectItem value="South Waziristan">South Waziristan</SelectItem>
                                  <SelectItem value="Sujawal">Sujawal</SelectItem>
                                  <SelectItem value="Sukkur">Sukkur</SelectItem>
                                  <SelectItem value="Swabi">Swabi</SelectItem>
                                  <SelectItem value="Swat">Swat</SelectItem>
                                  <SelectItem value="Tando Allahyar">Tando Allahyar</SelectItem>
                                  <SelectItem value="Tando Muhammad Khan">Tando Muhammad Khan</SelectItem>
                                  <SelectItem value="Tank">Tank</SelectItem>
                                  <SelectItem value="Taxila">Taxila</SelectItem>
                                  <SelectItem value="Thatta">Thatta</SelectItem>
                                  <SelectItem value="Tharparkar">Tharparkar</SelectItem>
                                  <SelectItem value="Toba Tek Singh">Toba Tek Singh</SelectItem>
                                  <SelectItem value="Torghar">Torghar</SelectItem>
                                  <SelectItem value="Turbat">Turbat</SelectItem>
                                  <SelectItem value="Umerkot">Umerkot</SelectItem>
                                  <SelectItem value="Upper Dir">Upper Dir</SelectItem>
                                  <SelectItem value="Usta Muhammad">Usta Muhammad</SelectItem>
                                  <SelectItem value="Vehari">Vehari</SelectItem>
                                  <SelectItem value="Wah Cantonment">Wah Cantonment</SelectItem>
                                  <SelectItem value="Washuk">Washuk</SelectItem>
                                  <SelectItem value="Ziarat">Ziarat</SelectItem>
                                  <SelectItem value="Zhob">Zhob</SelectItem>
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
                          disabled={!values.fullName || !values.shortName || !values.sector || !values.fieldOfStudy || !values.city || !values.websiteUrl || !values.applyUrl || !values.email || !values.phone || !values.address || !values.about}
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
                        <Button className="bg-[#5C5FC8] hover:bg-[#5C5FC8]/80" onClick={() => { setEditProgram(null); setShowAddProgram(true); }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Program
                        </Button>
                      </div>
                  <div className="grid grid-cols-3 gap-6 bg-white rounded-lg border p-2">
                    <div className=" p-4 ">
                          <div className="text-3xl font-bold text-black">
                            {programStats.bachelors.toString().padStart(2, "0")}
                          </div>
                          <div className="text-sm text-gray-600">Bachelors</div>
                        </div>
                    <div className="border-l p-4">
                          <div className="text-3xl font-bold text-black">
                            {programStats.masters.toString().padStart(2, "0")}
                          </div>
                          <div className="text-sm text-gray-600">Masters/ MPhil</div>
                        </div>
                    <div className="border-l p-4">
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
                        <Button className="bg-[#5C5FC8] hover:bg-[#5C5FC8]/80" onClick={() => setActiveTab("merit")} disabled={programs.length === 0}>
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
                    <div className="">
                      <Tabs defaultValue="bachelors" className="w-full">
                        <TabsList className="bg-gray-100 w-full justify-start">
                          <TabsTrigger value="bachelors" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1">Bachelors</TabsTrigger>
                          <TabsTrigger value="masters" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1">Masters</TabsTrigger>
                          <TabsTrigger value="mphil" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1">MPhil</TabsTrigger>
                          <TabsTrigger value="phd" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] flex-1">PhD</TabsTrigger>
                        </TabsList>

                         <div className="bg-gray-200  p-4 mt-6 rounded-lg flex items-center justify-between">
                          <div className="w-[1500px]">
        <ProgressBar percentage={75} />
      </div>
                      </div>

                                              <div className="py-6">
                        <h3 className="font-semibold pb-6">Admission Test Type</h3>
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
                        <ErrorMessage name="admissionTestType" component="div" className="text-red-500 py-2 text-sm" />
                        </div>

                                        
                        
                        <TabsContent value="bachelors">
                          <div className="space-y-4">
                            <div className="flex space-x-4">
                              <div className="space-y-2 flex-1">
                                <Label>Matric Weightage (%)</Label>
                                <Field
                                  as={Input}
                                  name="bachelors_weightages[0].value"
                                  placeholder="0%"
                                  value={weightages[0]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[0] = { type: "Matric", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("bachelors_weightages[0].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="bachelors_weightages[0].value" component="div" className="text-red-500 text-sm" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <Label>FSC Weightage (%)</Label>
                                <Field
                                  as={Input}
                                  name="bachelors_weightages[1].value"
                                  placeholder="0%"
                                  value={weightages[1]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[1] = { type: "FSC", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("bachelors_weightages[1].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="bachelors_weightages[1].value" component="div" className="text-red-500 text-sm" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Test Weightage (%)</Label>
                              <Field
                                as={Input}
                                name="bachelors_weightages[2].value"
                                placeholder="0%"
                                value={weightages[2]?.value || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const newWeightages = [...weightages]
                                  newWeightages[2] = { type: "Test", value: e.target.value }
                                  setWeightages(newWeightages)
                                  setFieldValue("bachelors_weightages[2].value", e.target.value)
                                }}
                              />
                              <ErrorMessage name="bachelors_weightages[2].value" component="div" className="text-red-500 text-sm" />
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="masters">
                          <div className="space-y-4">
                            <div className="flex space-x-4">
                              <div className="space-y-2 flex-1">
                                <Label>Bachelor's CGPA/Percentage (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[0].value"
                                  placeholder="0%"
                                  value={weightages[0]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[0] = { type: "Bachelor's CGPA/Percentage", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[0].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[0].value" component="div" className="text-red-500 text-sm" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <Label>Entry Test Weightage (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[1].value"
                                  placeholder="0%"
                                  value={weightages[1]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[1] = { type: "Entry Test", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[1].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[1].value" component="div" className="text-red-500 text-sm" />
                              </div>
                            </div>
                            <div className="flex space-x-4">
                              <div className="space-y-2 flex-1">
                                <Label>Interview Weightage (Optional) (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[2].value"
                                  placeholder="0%"
                                  value={weightages[2]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[2] = { type: "Interview", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[2].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[2].value" component="div" className="text-red-500 text-sm" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <Label>Interview Weightage (Optional) (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[3].value"
                                  placeholder="0%"
                                  value={weightages[3]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[3] = { type: "Interview", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[3].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[3].value" component="div" className="text-red-500 text-sm" />
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="mphil">
                          <div className="space-y-4">
                            <div className="flex space-x-4">
                              <div className="space-y-2 flex-1">
                                <Label>Master's CGPA/Percentage (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[0].value"
                                  placeholder="0%"
                                  value={weightages[0]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[0] = { type: "Master's CGPA/Percentage", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[0].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[0].value" component="div" className="text-red-500 text-sm" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <Label>Entry Test Weightage (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[1].value"
                                  placeholder="0%"
                                  value={weightages[1]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[1] = { type: "Entry Test", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[1].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[1].value" component="div" className="text-red-500 text-sm" />
                              </div>
                            </div>
                            <div className="flex space-x-4">
                              <div className="space-y-2 flex-1">
                                <Label>Interview Weightage (Optional) (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[2].value"
                                  placeholder="0%"
                                  value={weightages[2]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[2] = { type: "Interview", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[2].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[2].value" component="div" className="text-red-500 text-sm" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <Label>Research Proposal Weightage (Optional) (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[3].value"
                                  placeholder="0%"
                                  value={weightages[3]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[3] = { type: "Research Proposal", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[3].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[3].value" component="div" className="text-red-500 text-sm" />
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="phd">
                          <div className="space-y-4">
                            <div className="flex space-x-4">
                              <div className="space-y-2 flex-1">
                                <Label>Master's CGPA/Percentage (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[0].value"
                                  placeholder="0%"
                                  value={weightages[0]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[0] = { type: "Master's CGPA/Percentage", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[0].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[0].value" component="div" className="text-red-500 text-sm" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <Label>Entry Test Weightage (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[1].value"
                                  placeholder="0%"
                                  value={weightages[1]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[1] = { type: "Entry Test", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[1].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[1].value" component="div" className="text-red-500 text-sm" />
                              </div>
                            </div>
                            <div className="flex space-x-4">
                              <div className="space-y-2 flex-1">
                                <Label>Interview Weightage (Optional) (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[2].value"
                                  placeholder="0%"
                                  value={weightages[2]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[2] = { type: "Interview", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[2].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[2].value" component="div" className="text-red-500 text-sm" />
                              </div>
                              <div className="space-y-2 flex-1">
                                <Label>Research Proposal Weightage (Optional) (%)</Label>
                                <Field
                                  as={Input}
                                  name="weightages[3].value"
                                  placeholder="0%"
                                  value={weightages[3]?.value || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newWeightages = [...weightages]
                                    newWeightages[3] = { type: "Research Proposal", value: e.target.value }
                                    setWeightages(newWeightages)
                                    setFieldValue("weightages[3].value", e.target.value)
                                  }}
                                />
                                <ErrorMessage name="weightages[3].value" component="div" className="text-red-500 text-sm" />
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <div className="flex justify-end  mt-4 mb-4">
                        <Button className="bg-[#5C5FC8] hover:bg-blue-400" onClick={() => setShowAddFieldModal(true)}>
                          <Plus className="w-4 h-4 mr-2" /> Add Field
                        </Button>
                      </div>
                      {showAddFieldModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <div className="flex justify-between items-center border-b pb-2">
                              <h3 className="text-lg font-semibold">Add Field</h3>
                              <Button variant="ghost" onClick={() => setShowAddFieldModal(false)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <Label>Field Name</Label>
                                <Input
                                  value={newField.type}
                                  onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                                  placeholder="e.g., Extra Weightage"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Percentage (%)</Label>
                                <Input
                                  value={newField.value}
                                  onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                                  placeholder="0%"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button className="bg-white" variant="outline" onClick={() => setShowAddFieldModal(false)}>Cancel</Button>
                              <Button className="bg-[#5C5FC8] hover:bg-blue-400" onClick={handleAddField}>Save</Button>
                            </div>
                          </div>
                        </div>
                      )}
                      {showDeleteConfirm !== null && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <div className="flex justify-between items-center border-b pb-2">
                              <h3 className="text-lg font-semibold text-red-600">Delete Field</h3>
                              <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="mt-4">Are you sure you want to delete this field?</p>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button className="bg-white" variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
                              <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleConfirmDelete(showDeleteConfirm)}>Confirm</Button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-6">
                        <Button className="bg-transparent" variant="outline" onClick={() => setActiveTab("programs")}>
                          Previous
                        </Button>
                        <div className="space-x-2">
                          <Button variant="outline" className="bg-transparent text-[#5C5FC8] border-[#5C5FC8] hover:bg-blue-400">Move to Inprogress</Button>
                          <Button 
                            className="bg-[#5C5FC8] hover:bg-blue-400" 
                            type="submit" 
                            disabled={isLoading}
                            onClick={() => {
                              console.log("🔘 Upload button clicked!")
                              // Backup submit method
                              if (!isValid) {
                                console.log("⚠️ Form is not valid, trying manual submit...")
                                submitForm()
                              }
                            }}
                          >
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
  );
}