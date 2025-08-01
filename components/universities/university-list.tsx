"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit, Eye, Search, Filter, Trash2, Loader2, RotateCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// --- Helper Types for API Data ---
interface DegreeCounts {
  bachelors: number
  masters: number
  phd: number
}

interface University {
  _id: string
  fullName: string
  shortName: string
  sector: string
  city: string
  status: "confirmed" | "in_progress" | "deleted"
  degreeCounts: DegreeCounts
}

interface Filters {
  degree: string
  city: string
  sector: string
  programRange: string
  admissionStatus: string
}

// --- API Configuration ---
const API_BASE_URL = "http://localhost:4000/api/universities"
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2M1ZTAwNTdhMTA3MWZjYWRkMzIzMyIsImlhdCI6MTc1MzYxNzAyMCwiZXhwIjoxNzU0OTEzMDIwfQ.XznS7qSVf6VcITApcnTBvJAiNT5X386UoOPGhTpTBz8"

export function UniversityList() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)
  const [total, setTotal] = useState(0)
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("confirm")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    degree: "",
    city: "",
    sector: "",
    programRange: "",
    admissionStatus: "",
  })

  const fetchUniversities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
      const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      })
      if (!response.ok) throw new Error(`Failed to fetch universities: ${response.statusText}`)
      const result = await response.json()
      const mappedData = (result.data || []).map((uni: any) => ({
        ...uni,
        status: uni.status === "active" ? "confirmed" : uni.status,
      }))
      setUniversities(mappedData)
      setTotal(result.total || 0)
    } catch (err: any) {
      setError(err.message)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchUniversities()
  }, [fetchUniversities])

  const updateUniversityStatus = async (ids: string[], status: "confirmed" | "in_progress" | "deleted") => {
    const apiStatus = status === "confirmed" ? "active" : status
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${API_BASE_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${AUTH_TOKEN}` },
            body: JSON.stringify({ status: apiStatus }),
          }),
        ),
      )
      toast({ title: "Success", description: `Moved ${ids.length} universities.` })
      setSelectedUniversities([])
      fetchUniversities()
    } catch (err) {
      toast({ title: "Error", description: "Failed to update university status.", variant: "destructive" })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedUniversities(checked ? filteredUniversities.map((u) => u._id) : [])
  }

  const handleSelectUniversity = (id: string, checked: boolean) => {
    setSelectedUniversities(checked ? [...selectedUniversities, id] : selectedUniversities.filter((uid) => uid !== id))
  }

  const handleSoftDelete = () => updateUniversityStatus(selectedUniversities, "deleted")
  const handleRestore = () => updateUniversityStatus(selectedUniversities, "in_progress")
  const handleMoveToInprogress = () => updateUniversityStatus(selectedUniversities, "in_progress")
  const handleMoveToConfirm = () => updateUniversityStatus(selectedUniversities, "confirmed")

  const handlePermanentDelete = async () => {
    if (selectedUniversities.length === 0) return
    try {
      await Promise.all(
        selectedUniversities.map((id) =>
          fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          }),
        ),
      )
      toast({ title: "Success", description: `${selectedUniversities.length} universities deleted permanently.` })
      setSelectedUniversities([])
      fetchUniversities()
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete universities.", variant: "destructive" })
    }
  }

  const handleConfirmAll = () => {
    const inprogressIds = universities.filter((u) => u.status === "in_progress").map((u) => u._id)
    if (inprogressIds.length > 0) {
      updateUniversityStatus(inprogressIds, "confirmed")
    } else {
      toast({ title: "Info", description: "No universities to confirm." })
    }
  }

  const resetFilter = (filterKey: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [filterKey]: "" }))
  }

  const resetAllFilters = () => {
    setFilters({
      degree: "",
      city: "",
      sector: "",
      programRange: "",
      admissionStatus: "",
    })
  }

  const applyFilters = (university: University) => {
    // Apply degree filter
    if (filters.degree) {
      const hasSelectedDegree = university.degreeCounts[filters.degree.toLowerCase() as keyof DegreeCounts] > 0
      if (!hasSelectedDegree) return false
    }

    // Apply city filter
    if (filters.city && !university.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false
    }

    // Apply sector filter
    if (filters.sector && !university.sector.toLowerCase().includes(filters.sector.toLowerCase())) {
      return false
    }

    // Apply program range filter
    if (filters.programRange) {
      const totalPrograms = Object.values(university.degreeCounts).reduce((a, b) => a + b, 0)
      const [min, max] = filters.programRange.split("-").map(Number)
      if (totalPrograms < min || totalPrograms > max) return false
    }

    return true
  }

  const filteredUniversities = universities.filter((university) => {
    const matchesSearch =
      university.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.city.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (!applyFilters(university)) return false

    switch (activeTab) {
      case "confirm":
        return university.status === "confirmed"
      case "inprogress":
        return university.status === "in_progress"
      case "delete":
        return university.status === "deleted"
      default:
        return false
    }
  })

  const totalPages = Math.ceil(total / limit)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading universities...</span>
      </div>
    )
  }

  const renderTable = (items: University[]) => (
    <Card>
      <div className="p-6 text-black">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={
                selectedUniversities.length > 0 && selectedUniversities.length === items.length && items.length > 0
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-[#5C5FC8] focus:ring-[#5C5FC8]"
            />
            <span className="text-sm text-gray-600">Select All • {selectedUniversities.length} Selected</span>
          </div>
          {selectedUniversities.length > 0 && (
            <div className="flex items-center space-x-2">
              {activeTab === "confirm" && (
                <Button variant="outline" size="sm" className="bg-white" onClick={handleMoveToInprogress}>
                  Move to In-progress
                </Button>
              )}
              {activeTab === "inprogress" && (
                <Button variant="outline" size="sm" className="bg-white" onClick={handleMoveToConfirm}>
                  Move to Confirm
                </Button>
              )}
              {activeTab === "delete" && (
                <Button variant="outline" className="bg-white" size="sm" onClick={handleRestore}>
                  <RotateCw className="w-4  h-4 mr-2" />
                  Restore
                </Button>
              )}
              {activeTab !== "delete" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 bg-white hover:text-red-700"
                  onClick={handleSoftDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              ) : (
                <Button variant="destructive" size="sm" onClick={handlePermanentDelete}>
                  <Trash2 className="w-4  h-4 mr-2" />
                  Delete Permanently
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead>University Name</TableHead>
                <TableHead>No of Programs</TableHead>
                <TableHead>Degrees</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((university) => (
                  <TableRow key={university._id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUniversities.includes(university._id)}
                        onChange={(e) => handleSelectUniversity(university._id, e.target.checked)}
                        className="rounded border-gray-300 text-[#5C5FC8] focus:ring-[#5C5FC8]"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{university.fullName}</TableCell>
                    <TableCell>{Object.values(university.degreeCounts).reduce((a, b) => a + b, 0)}</TableCell>
                    <TableCell>
                      {Object.entries(university.degreeCounts)
                        .filter(([, count]) => count > 0)
                        .map(([deg]) => deg.charAt(0).toUpperCase() + deg.slice(1))
                        .join(", ")}
                    </TableCell>
                    <TableCell>{university.city}</TableCell>
                    <TableCell>{university.sector}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No universities found for this category.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Showing {items.length > 0 ? (page - 1) * limit + 1 : 0}-{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value))
                setPage(1)
              }}
              className="border bg-white rounded px-2 py-1"
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
            </select>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <span className="px-2">
                {page} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        {activeTab === "inprogress" && items.length > 0 && (
          <div className="flex justify-end mt-6">
            <Button className="bg-[#5C5FC8] hover:bg-blue-400" onClick={handleConfirmAll}>
              Confirm All
            </Button>
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Backdrop overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={() => setIsFilterOpen(false)} />
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="confirm" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
              Confirm
            </TabsTrigger>
            <TabsTrigger value="inprogress" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
              In-progress
            </TabsTrigger>
            <TabsTrigger value="delete" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
              Delete
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by Name or City"
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-transparent text-black" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-lg border-0" align="end" sideOffset={8}>
                <div className="bg-white rounded-lg">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-2 border-b">
                    <h3 className="text-md font-semibold text-gray-900">Filters</h3>
                  </div>

                  {/* Filter Content */}
                  <div className="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
                    {/* Degree Filter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Degree</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("degree")}
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.degree}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, degree: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Bachelors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelors">Bachelors</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City Filter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">City</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("city")}
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.city}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, city: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Lahore" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lahore">Lahore</SelectItem>
                          <SelectItem value="karachi">Karachi</SelectItem>
                          <SelectItem value="islamabad">Islamabad</SelectItem>
                          <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                          <SelectItem value="faisalabad">Faisalabad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sector Filter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Sector</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("sector")}
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.sector}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, sector: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Private" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="semi-government">Semi-Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* No of Programs Filter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">No of Programs</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("programRange")}
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.programRange}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, programRange: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g 20-30" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-20">11-20</SelectItem>
                          <SelectItem value="21-30">21-30</SelectItem>
                          <SelectItem value="31-50">31-50</SelectItem>
                          <SelectItem value="51-100">51-100</SelectItem>
                          <SelectItem value="100-999">100+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Admission Status Filter */}
                    {/* <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Admission Status</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("admissionStatus")}
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.admissionStatus}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, admissionStatus: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Open" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <TabsContent value="confirm" className="mt-6">
          {renderTable(filteredUniversities)}
        </TabsContent>
        <TabsContent value="inprogress" className="mt-6">
          {renderTable(filteredUniversities)}
        </TabsContent>
        <TabsContent value="delete" className="mt-6">
          {renderTable(filteredUniversities)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
