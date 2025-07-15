"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Upload, Download, Search } from "lucide-react"
import Link from "next/link"

export function UniversityHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">University Management</h1>
          <p className="text-gray-600">Manage all university profiles and information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/dashboard/universities/bulk-upload">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
          </Link>
          <Link href="/dashboard/universities/add">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add University
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search universities..." className="pl-10" />
        </div>
      </div>
    </div>
  )
}
