"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UniversityList } from "@/components/universities/university-list"
import { AddUniversityForm } from "@/components/universities/add-university-form"
import { BulkUploadForm } from "@/components/universities/bulk-upload-form"

export default function UniversitiesPage() {
  const [activeTab, setActiveTab] = useState("add")

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 border border-[hsl(var(--border))] rounded-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">University Management</h1>
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-2 px-1 border-b-2 whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabClick('add')}
              >
                Add University
              </button>
              
              <button
                className={`py-2 px-1 border-b-2 whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'bulk'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabClick('bulk')}
              >
                Bulk Upload
              </button>
              
              <button
                className={`py-2 px-1 border-b-2 whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabClick('manage')}
              >
                Manage Universities
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'add' && <AddUniversityForm />}
          {activeTab === 'bulk' && <BulkUploadForm />}
          {activeTab === 'manage' && <UniversityList />}
        </div>
      </div>
    </div>
  );
}