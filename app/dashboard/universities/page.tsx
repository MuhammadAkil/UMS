"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UniversityList } from "@/components/universities/university-list"
import { AddUniversityForm } from "@/components/universities/add-university-form"
import { BulkUploadForm } from "@/components/universities/bulk-upload-form"

export default function UniversitiesPage() {
  const [activeTab, setActiveTab] = useState("add")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Add University
          </TabsTrigger>
          <TabsTrigger
            value="bulk"
            className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Bulk Upload
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Manage Universities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <AddUniversityForm />
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <BulkUploadForm />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <UniversityList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
