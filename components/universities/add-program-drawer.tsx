"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export function AddProgramDrawer({ open, onClose, onAdd, initialData, isEdit }: AddProgramDrawerProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    degree: "",
    programName: "",
    duration: "",
    feePerSemester: "",
    deadline: "",
    admissionStatus: "Open" as "Open" | "Closed",
    lastYearMerit: "",
  })

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        degree: initialData.degree,
        programName: initialData.name,
        duration: initialData.duration,
        feePerSemester: initialData.fee,
        deadline: initialData.deadline,
        admissionStatus: initialData.status,
        lastYearMerit: initialData.merit,
      })
    }
  }, [initialData, isEdit])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate deadline format (YYYY-MM-DD)
    const deadlineRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!deadlineRegex.test(formData.deadline)) {
      toast({
        title: "Error",
        description: "Deadline must be in YYYY-MM-DD format (e.g., 2024-07-15)",
        variant: "destructive",
      })
      return
    }
    onAdd({
      name: formData.programName,
      degree: formData.degree,
      deadline: formData.deadline,
      merit: formData.lastYearMerit,
      fee: formData.feePerSemester,
      duration: formData.duration,
      status: formData.admissionStatus,
    })
    setFormData({
      degree: "",
      programName: "",
      duration: "",
      feePerSemester: "",
      deadline: "",
      admissionStatus: "Open",
      lastYearMerit: "",
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="ml-auto w-96 bg-white h-full shadow-xl relative">
        <div className="relative p-4 border-b">
          <h2 className="text-lg font-semibold text-black">{isEdit ? "Edit Program" : "Add Program"}</h2>
          <p className="text-sm text-gray-600 mb-2 mt-2">Fill in the details for this program</p>
          <Button variant="ghost" size="sm" className="absolute top-4 right-4 bg-gray-400" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-black">Degree</Label>
              <Select value={formData.degree} onValueChange={(value) => handleInputChange("degree", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Bachelors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelors">Bachelors</SelectItem>
                  <SelectItem value="Masters">Masters</SelectItem>
                  <SelectItem value="Masters (MPhil)">Masters (MPhil)</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="programName" className="text-black">Program name</Label>
              <Input
                id="programName"
                placeholder="Computer Science"
                value={formData.programName}
                onChange={(e) => handleInputChange("programName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-black">Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="4 Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 Years">2 Years</SelectItem>
                  <SelectItem value="3 Years">3 Years</SelectItem>
                  <SelectItem value="4 Years">4 Years</SelectItem>
                  <SelectItem value="5 Years">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feePerSemester" className="text-black">Fee per Semester</Label>
              <Input
                id="feePerSemester"
                placeholder="150000"
                value={formData.feePerSemester}
                onChange={(e) => handleInputChange("feePerSemester", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-black">Deadline</Label>
              <Input
                id="deadline"
                placeholder="2024-07-15"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionStatus" className="text-black">Admission Status</Label>
              <Select
                value={formData.admissionStatus}
                onValueChange={(value) => handleInputChange("admissionStatus", value as "Open" | "Closed")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Open" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastYearMerit" className="text-black">Last Year Merit</Label>
              <Input
                id="lastYearMerit"
                placeholder="80.0%"
                value={formData.lastYearMerit}
                onChange={(e) => handleInputChange("lastYearMerit", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#5C5FC8] hover:bg-blue-400">
                {isEdit ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}