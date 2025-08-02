"use client"

import type React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

interface AddProgramDrawerProps {
  open: boolean
  onClose: () => void
  onAdd: (program: {
    name: string
    degree: string
    deadline: string
    merit: string
    fee: string
    duration: string
    status: "Open" | "Closed"
  }) => void
  initialData?: {
    name: string
    degree: string
    deadline: string
    merit: string
    fee: string
    duration: string
    status: "Open" | "Closed"
  }
  isEdit?: boolean
}

const validationSchema = Yup.object({
  degree: Yup.string().required("Degree is required"),
  programName: Yup.string().max(100, "Program name must be 100 characters or less").required("Program name is required"),
  duration: Yup.string().required("Duration is required"),
  feePerSemester: Yup.number().positive("Fee must be a positive number").required("Fee per semester is required"),
  deadline: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be in YYYY-MM-DD format").required("Deadline is required"),
  admissionStatus: Yup.string().oneOf(["Open", "Closed"], "Invalid status").required("Admission status is required"),
  lastYearMerit: Yup.string().matches(/^\d+(\.\d{1,2})?%$/, "Merit must be a valid percentage (e.g., 80.0%)").required("Last year merit is required"),
})

export function AddProgramDrawer({ open, onClose, onAdd, initialData, isEdit }: AddProgramDrawerProps) {
  const { toast } = useToast()

  const initialValues = {
    degree: initialData?.degree || "",
    programName: initialData?.name || "",
    duration: initialData?.duration || "",
    feePerSemester: initialData?.fee || "",
    deadline: initialData?.deadline || "",
    admissionStatus: initialData?.status || "Open",
    lastYearMerit: initialData?.merit || "",
  }

  const handleSubmit = (values: typeof initialValues) => {
    const programData = {
      name: values.programName,
      degree: values.degree,
      deadline: values.deadline,
      merit: values.lastYearMerit,
      fee: values.feePerSemester,
      duration: values.duration,
      status: values.admissionStatus as "Open" | "Closed",
    }

    onAdd(programData)
    onClose()
    toast({ title: "Success", description: isEdit ? "Program updated successfully." : "Program added successfully." })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="ml-auto w-96 bg-white h-full shadow-xl relative p-0">
        <div className="p-4 border-b relative">
          <h2 className="text-lg font-semibold text-black">{isEdit ? "Edit Program" : "Add Program"}</h2>
          <p className="text-sm text-gray-600 mb-2 mt-0">Fill in the details for this program</p>
          <Button variant="ghost" size="sm" className="absolute top-4 right-4 bg-gray-400" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ setFieldValue, values }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-black">Degree</Label>
                  <Field name="degree">
                    {({ field }: any) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => setFieldValue("degree", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bachelors">Bachelors</SelectItem>
                          <SelectItem value="Masters">Masters</SelectItem>
                          <SelectItem value="Masters (MPhil)">Masters (MPhil)</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="degree" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programName" className="text-black">Program name</Label>
                  <Field
                    as={Input}
                    id="programName"
                    name="programName"
                    placeholder="Computer Science"
                  />
                  <ErrorMessage name="programName" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-black">Duration</Label>
                  <Field name="duration">
                    {({ field }: any) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => setFieldValue("duration", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2 Years">2 Years</SelectItem>
                          <SelectItem value="3 Years">3 Years</SelectItem>
                          <SelectItem value="4 Years">4 Years</SelectItem>
                          <SelectItem value="5 Years">5 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="duration" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feePerSemester" className="text-black">Fee per Semester</Label>
                  <Field
                    as={Input}
                    id="feePerSemester"
                    name="feePerSemester"
                    placeholder="150000"
                    type="number"
                  />
                  <ErrorMessage name="feePerSemester" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-black">Deadline</Label>
                  <Field
                    as={Input}
                    id="deadline"
                    name="deadline"
                    placeholder="2024-07-15"
                  />
                  <ErrorMessage name="deadline" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionStatus" className="text-black">Admission Status</Label>
                  <Field name="admissionStatus">
                    {({ field }: any) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => setFieldValue("admissionStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="admissionStatus" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastYearMerit" className="text-black">Last Year Merit</Label>
                  <Field
                    as={Input}
                    id="lastYearMerit"
                    name="lastYearMerit"
                    placeholder="80.0%"
                  />
                  <ErrorMessage name="lastYearMerit" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex items-center justify-end space-x-2 pt-6">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#5C5FC8] hover:bg-blue-400">
                    {isEdit ? "Update" : "Save"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}