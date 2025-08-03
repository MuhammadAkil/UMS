"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, FileText, CheckCircle, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUniversityStore } from "@/lib/store/university-store"

export function BulkUploadForm() {
  const { toast } = useToast()
  const { bulkUploadUniversities } = useUniversityStore()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
          setFile(droppedFile)
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload a CSV file.",
            variant: "destructive",
          })
        }
      }
    },
    [toast],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0]
        if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
          setFile(selectedFile)
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload a CSV file.",
            variant: "destructive",
          })
        }
      }
    },
    [toast],
  )

  const handleUpload = useCallback(async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setUploadComplete(false)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
      const response = await fetch(`${backendUrl}/api/universities/bulk-upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2M1ZTAwNTdhMTA3MWZjYWRkMzIzMyIsImlhdCI6MTc1MzYxNzAyMCwiZXhwIjoxNzU0OTEzMDIwfQ.XznS7qSVf6VcITApcnTBvJAiNT5X386UoOPGhTpTBz8",
        },
      })

      const result = await response.json()

      if (response.ok) {
        setTimeout(() => {
          setUploading(false)
          setUploadComplete(true)
          toast({
            title: "Upload Successful",
            description: "Universities have been uploaded successfully.",
          })
        }, 1000)
      } else {
        throw new Error(result.message || "Failed to upload universities.")
      }
    } catch (error) {
      setUploading(false)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload universities.",
        variant: "destructive",
      })
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [file, toast])

  const handleReset = useCallback(() => {
    setFile(null)
    setUploading(false)
    setUploadProgress(0)
    setUploadComplete(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

const downloadTemplate = useCallback(() => {
  const csvContent = `university_full_name,university_short_name,sector,field_of_study,City,address,about,logo_url,website_url,apply_url,email,phone,program_name,degree_level,application_deadline,last_year_merit,duration,fee_per_semester,admission_status
National University of Sciences and Technology,NUST,Public,Engineering,Islamabad,Sector H-12 Islamabad,NUST is one of the top-ranked universities in Pakistan.,https://yourdomain.com/logos/nust.png,https://nust.edu.pk,https://admissions.nust.edu.pk,info@nust.edu.pk,051-111-116-878,BS Computer Science,Bachelors,2025-07-15,80.0%,4 Years,PKR 100000,Open
University of the Punjab,PU,Public,Arts and Humanities,Islamabad,Quaid-e-Azam Campus Lahore,One of the oldest and largest universities in Pakistan.,https://yourdomain.com/logos/pu.png,http://pu.edu.pk,http://admissions.pu.edu.pk,info@pu.edu.pk,042-111-001-882,BS Computer Science,Bachelors,2025-07-15,80.0%,4 Years,PKR 100000,Open`

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "university_management_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  toast({
    title: "Template Downloaded",
    description: "CSV template has been downloaded successfully.",
  });
}, [toast])

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Bulk Upload Universities</h3>
                <p className="text-sm text-gray-600">Upload multiple universities using CSV file</p>
              </div>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>

            {!file && !uploadComplete && (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive ? "border-[#5C5FC8] bg-blue-50" : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your CSV file here, or{" "}
                  <button
                    type="button"
                    className="text-[#5C5FC8] hover:text-blue-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </h4>
                <p className="text-sm text-gray-600">Supports: CSV files only</p>
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
              </div>
            )}

            {file && !uploadComplete && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-[#5C5FC8]" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset} disabled={uploading}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#5C5FC8]" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4">
                  <Button variant="outline" onClick={handleReset} disabled={uploading}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={uploading} className="bg-[#5C5FC8] hover:bg-blue-700">
                    {uploading ? "Uploading..." : "Upload Universities"}
                  </Button>
                </div>
              </div>
            )}

            {uploadComplete && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Completed!</h4>
                <p className="text-gray-600 mb-6">
                  Your universities have been successfully uploaded and are now being processed.
                </p>
                <Button onClick={handleReset} className="bg-[#5C5FC8] hover:bg-blue-700">
                  Upload Another File
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}