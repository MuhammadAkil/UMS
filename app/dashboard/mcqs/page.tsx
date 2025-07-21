"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MCQList } from "@/components/mcqs/mcq-list";
import { AddMCQForm } from "@/components/mcqs/add-mcq-form";
import { BulkUploadMCQForm } from "@/components/mcqs/bulk-upload-mcq-form";
import { MCQQuizInterface } from "@/components/mcqs/mcq-quiz-interface";

export default function MCQsPage() {
  const [activeTab, setActiveTab] = useState("manage");

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">MCQs Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Add MCQ
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
            Manage MCQs
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8] data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Quiz Interface
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <AddMCQForm />
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <BulkUploadMCQForm />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <MCQList />
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <MCQQuizInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
}
