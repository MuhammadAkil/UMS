"use client"
import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Eye, Search, Filter, Trash2, Loader2, RotateCw, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { universityAPI } from "@/lib/api/universities"

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
  fieldOfStudy: string
  courseType: string
  degreeProgram: string
  admissions: string
  duration: string
  programName: string
}

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
  const [searchResults, setSearchResults] = useState<University[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    degree: "",
    city: "",
    sector: "",
    programRange: "",
    admissionStatus: "",
    fieldOfStudy: "",
    courseType: "",
    degreeProgram: "",
    admissions: "",
    duration: "",
    programName: "",
  })
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const fetchUniversities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await universityAPI.getUniversities({
        page,
        limit,
        search: searchQuery || undefined,
      })
      
      const mappedData = (result.data || []).map((uni: any) => ({
        ...uni,
        status: uni.status === "active" ? "confirmed" : uni.status,
      }))
      setUniversities(mappedData)
      setTotal(result.pagination?.total || 0)
    } catch (err: any) {
      setError(err.message)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchQuery])

  // New search functions for specific filters
  const searchByCity = async (city: string) => {
    if (!city) return
    setIsSearching(true)
    try {
      console.log(`🔍 Searching universities by city: ${city}`)
      const result = await universityAPI.searchUniversitiesByCity(city)
      console.log(`✅ City search result:`, result)
      if (result.success) {
        const mappedData = (result.data || []).map((uni: any) => ({
          ...uni,
          status: uni.status === "active" ? "confirmed" : uni.status,
        }))
        setSearchResults(mappedData)
        setUniversities(mappedData)
        toast({ title: "Success", description: `Found ${mappedData.length} universities in ${city}` })
      } else {
        toast({ title: "No Results", description: `No universities found in ${city}` })
      }
    } catch (err: any) {
      console.error(`❌ City search error:`, err)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  const searchByFieldOfStudy = async (fieldOfStudy: string) => {
    if (!fieldOfStudy) return
    setIsSearching(true)
    try {
      console.log(`🔍 Searching universities by field of study: ${fieldOfStudy}`)
      const result = await universityAPI.searchUniversitiesByFieldOfStudy(fieldOfStudy)
      console.log(`✅ Field of study search result:`, result)
      if (result.success) {
        const mappedData = (result.data || []).map((uni: any) => ({
          ...uni,
          status: uni.status === "active" ? "confirmed" : uni.status,
        }))
        setSearchResults(mappedData)
        setUniversities(mappedData)
        toast({ title: "Success", description: `Found ${mappedData.length} universities for ${fieldOfStudy}` })
      } else {
        toast({ title: "No Results", description: `No universities found for ${fieldOfStudy}` })
      }
    } catch (err: any) {
      console.error(`❌ Field of study search error:`, err)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  const searchByCourseType = async (courseType: string) => {
    if (!courseType) return
    setIsSearching(true)
    try {
      console.log(`🔍 Searching universities by course type: ${courseType}`)
      const result = await universityAPI.searchUniversitiesByCourseType(courseType)
      console.log(`✅ Course type search result:`, result)
      if (result.success) {
        const mappedData = (result.data || []).map((uni: any) => ({
          ...uni,
          status: uni.status === "active" ? "confirmed" : uni.status,
        }))
        setSearchResults(mappedData)
        setUniversities(mappedData)
        toast({ title: "Success", description: `Found ${mappedData.length} universities for ${courseType}` })
      } else {
        toast({ title: "No Results", description: `No universities found for ${courseType}` })
      }
    } catch (err: any) {
      console.error(`❌ Course type search error:`, err)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  const searchByDegreeProgram = async (degreeProgram: string) => {
    if (!degreeProgram) return
    setIsSearching(true)
    try {
      console.log(`🔍 Searching universities by degree program: ${degreeProgram}`)
      const result = await universityAPI.searchUniversitiesByDegreeProgram(degreeProgram)
      console.log(`✅ Degree program search result:`, result)
      if (result.success) {
        const mappedData = (result.data || []).map((uni: any) => ({
          ...uni,
          status: uni.status === "active" ? "confirmed" : uni.status,
        }))
        setSearchResults(mappedData)
        setUniversities(mappedData)
        toast({ title: "Success", description: `Found ${mappedData.length} universities for ${degreeProgram}` })
      } else {
        toast({ title: "No Results", description: `No universities found for ${degreeProgram}` })
      }
    } catch (err: any) {
      console.error(`❌ Degree program search error:`, err)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  const searchByAdmissions = async (admissions: string) => {
    if (!admissions) return
    setIsSearching(true)
    try {
      console.log(`🔍 Searching universities by admissions status: ${admissions}`)
      const result = await universityAPI.searchUniversitiesByAdmissions(admissions)
      console.log(`✅ Admissions search result:`, result)
      if (result.success) {
        const mappedData = (result.data || []).map((uni: any) => ({
          ...uni,
          status: uni.status === "active" ? "confirmed" : uni.status,
        }))
        setSearchResults(mappedData)
        setUniversities(mappedData)
        toast({ title: "Success", description: `Found ${mappedData.length} universities with ${admissions} admissions` })
      } else {
        toast({ title: "No Results", description: `No universities found with ${admissions} admissions` })
      }
    } catch (err: any) {
      console.error(`❌ Admissions search error:`, err)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  const searchByDuration = async (duration: string) => {
    if (!duration) return
    setIsSearching(true)
    try {
      console.log(`🔍 Searching universities by duration: ${duration}`)
      const result = await universityAPI.searchUniversitiesByDuration(duration)
      console.log(`✅ Duration search result:`, result)
      if (result.success) {
        const mappedData = (result.data || []).map((uni: any) => ({
          ...uni,
          status: uni.status === "active" ? "confirmed" : uni.status,
        }))
        setSearchResults(mappedData)
        setUniversities(mappedData)
        toast({ title: "Success", description: `Found ${mappedData.length} universities with ${duration} programs` })
      } else {
        toast({ title: "No Results", description: `No universities found with ${duration} programs` })
      }
    } catch (err: any) {
      console.error(`❌ Duration search error:`, err)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  const searchByProgramName = async (programName: string) => {
    if (!programName) return
    setIsSearching(true)
    try {
      console.log(`🔍 Searching universities by program name: ${programName}`)
      const result = await universityAPI.searchUniversitiesByProgramName(programName)
      console.log(`✅ Program name search result:`, result)
      if (result.success) {
        const mappedData = (result.data || []).map((uni: any) => ({
          ...uni,
          status: uni.status === "active" ? "confirmed" : uni.status,
        }))
        setSearchResults(mappedData)
        setUniversities(mappedData)
        toast({ title: "Success", description: `Found ${mappedData.length} universities with ${programName} programs` })
      } else {
        toast({ title: "No Results", description: `No universities found with ${programName} programs` })
      }
    } catch (err: any) {
      console.error(`❌ Program name search error:`, err)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  // Handle filter changes and trigger search
  const handleFilterChange = async (filterKey: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }))
    
    // Clear other filters when a new search is triggered
    const newFilters = { ...filters, [filterKey]: value }
    
    // Trigger appropriate search based on filter
    if (value) {
      switch (filterKey) {
        case 'city':
          await searchByCity(value)
          break
        case 'fieldOfStudy':
          await searchByFieldOfStudy(value)
          break
        case 'courseType':
          await searchByCourseType(value)
          break
        case 'degreeProgram':
          await searchByDegreeProgram(value)
          break
        case 'admissions':
          await searchByAdmissions(value)
          break
        case 'duration':
          await searchByDuration(value)
          break
        case 'programName':
          await searchByProgramName(value)
          break
        default:
          // For other filters, use the existing logic
          break
      }
    } else {
      // If filter is cleared, fetch all universities
      fetchUniversities()
    }
  }

  useEffect(() => {
    fetchUniversities()
  }, [fetchUniversities])

  const updateUniversityStatus = async (ids: string[], status: "confirmed" | "in_progress" | "deleted") => {
    const apiStatus = status === "confirmed" ? "active" : status
    try {
      await Promise.all(
        ids.map((id) =>
          universityAPI.updateUniversity(id, { status: apiStatus })
        ),
      )
      toast({ title: "Success", description: `Moved ${ids.length} universities.` })
      fetchUniversities()
      setSelectedUniversities([])
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
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
    if (!isDeleteConfirmOpen) {
      setIsDeleteConfirmOpen(true)
      return
    }
    try {
      await Promise.all(
        selectedUniversities.map((id) =>
          universityAPI.deleteUniversity(id)
        ),
      )
      toast({ title: "Success", description: `${selectedUniversities.length} universities deleted permanently.` })
      setSelectedUniversities([])
      fetchUniversities()
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete universities.", variant: "destructive" })
    } finally {
      setIsDeleteConfirmOpen(false)
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
      fieldOfStudy: "",
      courseType: "",
      degreeProgram: "",
      admissions: "",
      duration: "",
      programName: "",
    })
  }

  const applyFilters = (university: University) => {
    if (filters.degree) {
      const hasSelectedDegree = university.degreeCounts[filters.degree.toLowerCase() as keyof DegreeCounts] > 0
      if (!hasSelectedDegree) return false
    }
    if (filters.city && !university.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false
    }
    if (filters.sector && !university.sector.toLowerCase().includes(filters.sector.toLowerCase())) {
      return false
    }
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

  if (loading || isSearching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">
          {isSearching ? "Searching universities..." : "Loading universities..."}
        </span>
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
                  <RotateCw className="w-4 h-4 mr-2" />
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
                <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setIsDeleteConfirmOpen(true)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Permanently
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-red-600">Delete Universities</DialogTitle>
                    </DialogHeader>
                    <p className="mt-2 text-gray-600">
                      Are you sure you want to permanently delete {selectedUniversities.length}{" "}
                      {selectedUniversities.length > 1 ? "universities" : "university"}? This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button
                           className="text-black bg-white"
                        variant="outline"
                        onClick={() => setIsDeleteConfirmOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handlePermanentDelete}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
            <Button className="bg-[#5C5FC8] hover:bg-[#5C5FC8]/80" onClick={handleConfirmAll}>
              Confirm All
            </Button>
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
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
                  <div className="flex items-center justify-between px-6 py-2 border-b">
                    <h3 className="text-md font-semibold text-gray-900">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetAllFilters}
                      className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Degree</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("degree")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.degree}
                        onValueChange={(value) => handleFilterChange("degree", value)}
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
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">City</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("city")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.city}
                        onValueChange={(value) => handleFilterChange("city", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Lahore" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lahore">Lahore</SelectItem>
                          <SelectItem value="Karachi">Karachi</SelectItem>
                          <SelectItem value="Islamabad">Islamabad</SelectItem>
                          <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
                          <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                          <SelectItem value="Multan">Multan</SelectItem>
                          <SelectItem value="Peshawar">Peshawar</SelectItem>
                          <SelectItem value="Quetta">Quetta</SelectItem>
                          <SelectItem value="Sialkot">Sialkot</SelectItem>
                          <SelectItem value="Gujranwala">Gujranwala</SelectItem>
                          <SelectItem value="Bahawalpur">Bahawalpur</SelectItem>
                          <SelectItem value="Sargodha">Sargodha</SelectItem>
                          <SelectItem value="Sukkur">Sukkur</SelectItem>
                          <SelectItem value="Jhang">Jhang</SelectItem>
                          <SelectItem value="Sheikhupura">Sheikhupura</SelectItem>
                          <SelectItem value="Mardan">Mardan</SelectItem>
                          <SelectItem value="Gujrat">Gujrat</SelectItem>
                          <SelectItem value="Kasur">Kasur</SelectItem>
                          <SelectItem value="Dera Ghazi Khan">Dera Ghazi Khan</SelectItem>
                          <SelectItem value="Sahiwal">Sahiwal</SelectItem>
                          <SelectItem value="Nawabshah">Nawabshah</SelectItem>
                          <SelectItem value="Mirpur Khas">Mirpur Khas</SelectItem>
                          <SelectItem value="Okara">Okara</SelectItem>
                          <SelectItem value="Mingora">Mingora</SelectItem>
                          <SelectItem value="Rahim Yar Khan">Rahim Yar Khan</SelectItem>
                          <SelectItem value="Jhelum">Jhelum</SelectItem>
                          <SelectItem value="Chiniot">Chiniot</SelectItem>
                          <SelectItem value="Kamoke">Kamoke</SelectItem>
                          <SelectItem value="Hafizabad">Hafizabad</SelectItem>
                          <SelectItem value="Sadiqabad">Sadiqabad</SelectItem>
                          <SelectItem value="Burewala">Burewala</SelectItem>
                          <SelectItem value="Kohat">Kohat</SelectItem>
                          <SelectItem value="Khanewal">Khanewal</SelectItem>
                          <SelectItem value="Dera Ismail Khan">Dera Ismail Khan</SelectItem>
                          <SelectItem value="Turbat">Turbat</SelectItem>
                          <SelectItem value="Muzaffargarh">Muzaffargarh</SelectItem>
                          <SelectItem value="Abbottabad">Abbottabad</SelectItem>
                          <SelectItem value="Mandi Bahauddin">Mandi Bahauddin</SelectItem>
                          <SelectItem value="Shikarpur">Shikarpur</SelectItem>
                          <SelectItem value="Jacobabad">Jacobabad</SelectItem>
                          <SelectItem value="Jatoi">Jatoi</SelectItem>
                          <SelectItem value="Ghotki">Ghotki</SelectItem>
                          <SelectItem value="Murree">Murree</SelectItem>
                          <SelectItem value="Taxila">Taxila</SelectItem>
                          <SelectItem value="Wah Cantonment">Wah Cantonment</SelectItem>
                          <SelectItem value="Attock">Attock</SelectItem>
                          <SelectItem value="Chakwal">Chakwal</SelectItem>
                          <SelectItem value="Mianwali">Mianwali</SelectItem>
                          <SelectItem value="Bhakkar">Bhakkar</SelectItem>
                          <SelectItem value="Khushab">Khushab</SelectItem>
                          <SelectItem value="Toba Tek Singh">Toba Tek Singh</SelectItem>
                          <SelectItem value="Narowal">Narowal</SelectItem>
                          <SelectItem value="Pakpattan">Pakpattan</SelectItem>
                          <SelectItem value="Vehari">Vehari</SelectItem>
                          <SelectItem value="Lodhran">Lodhran</SelectItem>
                          <SelectItem value="Bahawalnagar">Bahawalnagar</SelectItem>
                          <SelectItem value="Layyah">Layyah</SelectItem>
                          <SelectItem value="Rajanpur">Rajanpur</SelectItem>
                          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="Larkana">Larkana</SelectItem>
                          <SelectItem value="Khairpur">Khairpur</SelectItem>
                          <SelectItem value="Dadu">Dadu</SelectItem>
                          <SelectItem value="Badin">Badin</SelectItem>
                          <SelectItem value="Thatta">Thatta</SelectItem>
                          <SelectItem value="Sanghar">Sanghar</SelectItem>
                          <SelectItem value="Naushahro Feroze">Naushahro Feroze</SelectItem>
                          <SelectItem value="Umerkot">Umerkot</SelectItem>
                          <SelectItem value="Tharparkar">Tharparkar</SelectItem>
                          <SelectItem value="Tando Allahyar">Tando Allahyar</SelectItem>
                          <SelectItem value="Tando Muhammad Khan">Tando Muhammad Khan</SelectItem>
                          <SelectItem value="Matiari">Matiari</SelectItem>
                          <SelectItem value="Jamshoro">Jamshoro</SelectItem>
                          <SelectItem value="Kashmore">Kashmore</SelectItem>
                          <SelectItem value="Kambar Shahdadkot">Kambar Shahdadkot</SelectItem>
                          <SelectItem value="Shaheed Benazirabad">Shaheed Benazirabad</SelectItem>
                          <SelectItem value="Sujawal">Sujawal</SelectItem>
                          <SelectItem value="Mansehra">Mansehra</SelectItem>
                          <SelectItem value="Swat">Swat</SelectItem>
                          <SelectItem value="Nowshera">Nowshera</SelectItem>
                          <SelectItem value="Charsadda">Charsadda</SelectItem>
                          <SelectItem value="Lakki Marwat">Lakki Marwat</SelectItem>
                          <SelectItem value="Bannu">Bannu</SelectItem>
                          <SelectItem value="Haripur">Haripur</SelectItem>
                          <SelectItem value="Karak">Karak</SelectItem>
                          <SelectItem value="Hangu">Hangu</SelectItem>
                          <SelectItem value="Tank">Tank</SelectItem>
                          <SelectItem value="Battagram">Battagram</SelectItem>
                          <SelectItem value="Shangla">Shangla</SelectItem>
                          <SelectItem value="Upper Dir">Upper Dir</SelectItem>
                          <SelectItem value="Lower Dir">Lower Dir</SelectItem>
                          <SelectItem value="Malakand">Malakand</SelectItem>
                          <SelectItem value="Swabi">Swabi</SelectItem>
                          <SelectItem value="Buner">Buner</SelectItem>
                          <SelectItem value="Chitral">Chitral</SelectItem>
                          <SelectItem value="Kohistan">Kohistan</SelectItem>
                          <SelectItem value="Torghar">Torghar</SelectItem>
                          <SelectItem value="Khyber">Khyber</SelectItem>
                          <SelectItem value="Kurram">Kurram</SelectItem>
                          <SelectItem value="North Waziristan">North Waziristan</SelectItem>
                          <SelectItem value="South Waziristan">South Waziristan</SelectItem>
                          <SelectItem value="Orakzai">Orakzai</SelectItem>
                          <SelectItem value="Bajaur">Bajaur</SelectItem>
                          <SelectItem value="Mohmand">Mohmand</SelectItem>
                          <SelectItem value="Chaman">Chaman</SelectItem>
                          <SelectItem value="Khuzdar">Khuzdar</SelectItem>
                          <SelectItem value="Kalat">Kalat</SelectItem>
                          <SelectItem value="Mastung">Mastung</SelectItem>
                          <SelectItem value="Killa Abdullah">Killa Abdullah</SelectItem>
                          <SelectItem value="Pishin">Pishin</SelectItem>
                          <SelectItem value="Ziarat">Ziarat</SelectItem>
                          <SelectItem value="Loralai">Loralai</SelectItem>
                          <SelectItem value="Barkhan">Barkhan</SelectItem>
                          <SelectItem value="Musakhel">Musakhel</SelectItem>
                          <SelectItem value="Killa Saifullah">Killa Saifullah</SelectItem>
                          <SelectItem value="Sherani">Sherani</SelectItem>
                          <SelectItem value="Zhob">Zhob</SelectItem>
                          <SelectItem value="Dera Bugti">Dera Bugti</SelectItem>
                          <SelectItem value="Kohlu">Kohlu</SelectItem>
                          <SelectItem value="Sibi">Sibi</SelectItem>
                          <SelectItem value="Harnai">Harnai</SelectItem>
                          <SelectItem value="Naseerabad">Naseerabad</SelectItem>
                          <SelectItem value="Jaffarabad">Jaffarabad</SelectItem>
                          <SelectItem value="Jhal Magsi">Jhal Magsi</SelectItem>
                          <SelectItem value="Usta Muhammad">Usta Muhammad</SelectItem>
                          <SelectItem value="Lasbela">Lasbela</SelectItem>
                          <SelectItem value="Awaran">Awaran</SelectItem>
                          <SelectItem value="Panjgur">Panjgur</SelectItem>
                          <SelectItem value="Washuk">Washuk</SelectItem>
                          <SelectItem value="Kech">Kech</SelectItem>
                          <SelectItem value="Gwadar">Gwadar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Sector</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("sector")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.sector}
                        onValueChange={(value) => handleFilterChange("sector", value)}
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
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">No of Programs</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("programRange")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.programRange}
                        onValueChange={(value) => handleFilterChange("programRange", value)}
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
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Field of Study</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("fieldOfStudy")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.fieldOfStudy}
                        onValueChange={(value) => handleFilterChange("fieldOfStudy", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Engineering" />
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
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Course Type</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("courseType")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.courseType}
                        onValueChange={(value) => handleFilterChange("courseType", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Bachelors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bachelors">Bachelors</SelectItem>
                          <SelectItem value="Masters">Masters</SelectItem>
                          <SelectItem value="MPhil">MPhil</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="Certificate">Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Degree Program</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("degreeProgram")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.degreeProgram}
                        onValueChange={(value) => handleFilterChange("degreeProgram", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Computer Science" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                          <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                          <SelectItem value="Economics">Economics</SelectItem>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                          <SelectItem value="Dentistry">Dentistry</SelectItem>
                          <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="Law">Law</SelectItem>
                          <SelectItem value="Architecture">Architecture</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Admissions Status</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("admissions")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.admissions}
                        onValueChange={(value) => handleFilterChange("admissions", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Open" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Duration</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("duration")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.duration}
                        onValueChange={(value) => handleFilterChange("duration", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g 4 Years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2 Years">2 Years</SelectItem>
                          <SelectItem value="3 Years">3 Years</SelectItem>
                          <SelectItem value="4 Years">4 Years</SelectItem>
                          <SelectItem value="5 Years">5 Years</SelectItem>
                          <SelectItem value="6 Years">6 Years</SelectItem>
                          <SelectItem value="1 Year">1 Year</SelectItem>
                          <SelectItem value="1.5 Years">1.5 Years</SelectItem>
                          <SelectItem value="2.5 Years">2.5 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">Program Name</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetFilter("programName")}
                          className="text-[#5C5FC8] hover:text-blue-700 p-0 h-auto font-normal text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Select
                        value={filters.programName}
                        onValueChange={(value) => handleFilterChange("programName", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="e.g Computer Science" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                          <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                          <SelectItem value="Database Management">Database Management</SelectItem>
                          <SelectItem value="Network Engineering">Network Engineering</SelectItem>
                          <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
