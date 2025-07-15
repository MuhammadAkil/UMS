"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Download, CheckCircle, AlertCircle } from "lucide-react"

export function BulkUploadForm() {
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const file = files[0]

      if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
        setSelectedFile(file)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Simulate upload progress
    intervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setIsUploading(false)
          setUploadComplete(true)
          toast({
            title: "Upload Complete",
            description: "Universities have been uploaded successfully.",
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }, [selectedFile, toast])

  const downloadTemplate = useCallback(() => {
    // Create a sample CSV content
    const csvContent = `University Name,University Code,Type,Established,Country,State,City,Website,Email,Phone,Students,Ranking,Address,Description
Harvard University,HARV,Private,1636,US,Massachusetts,Cambridge,https://harvard.edu,info@harvard.edu,+1-617-495-1000,23000,1,"Cambridge MA 02138","Harvard University is a private Ivy League research university"
Stanford University,STAN,Private,1885,US,California,Stanford,https://stanford.edu,info@stanford.edu,+1-650-723-2300,17000,2,"Stanford CA 94305","Stanford University is a private research university"`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "university_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }, [])

  const resetForm = useCallback(() => {
    setUploadComplete(false)
    setSelectedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  if (uploadComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload Completed!</h3>
          <p className="text-gray-600 mb-6">Your universities have been successfully uploaded and processed.</p>
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={() => (window.location.href = "/dashboard/universities")}>View Universities</Button>
            <Button variant="outline" onClick={resetForm}>
              Upload More
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Upload Universities</h3>
            <p className="text-gray-600">Upload a CSV file containing university information</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Drop your CSV file here, or{" "}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    browse
                    <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                  </label>
                </p>
                <p className="text-sm text-gray-500">Supports CSV files up to 10MB</p>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button onClick={removeFile} variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                {isUploading ? "Uploading..." : "Upload Universities"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-2">Upload Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use the provided CSV template for best results</li>
                <li>• Ensure all required fields are filled</li>
                <li>• University codes must be unique</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Supported format: CSV only</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
