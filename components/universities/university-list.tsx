"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
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
  status: 'confirmed' | 'in_progress' | 'deleted' // Updated status values
  degreeCounts: DegreeCounts
}

// --- API Configuration ---
const API_BASE_URL = "http://localhost:4000/api/universities" // Replace with your actual API base URL
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2M1ZTAwNTdhMTA3MWZjYWRkMzIzMyIsImlhdCI6MTc1MzYxNzAyMCwiZXhwIjoxNzU0OTEzMDIwfQ.XznS7qSVf6VcITApcnTBvJAiNT5X386UoOPGhTpTBz8" // Replace with your token

export function UniversityList() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)
  const [total, setTotal] = useState(0)

  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("confirm") // Default tab is now 'confirm'
  const [searchQuery, setSearchQuery] = useState("")

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
      // Map API's 'active' status to frontend 'confirmed' status for consistency
      const mappedData = (result.data || []).map((uni: any) => ({
        ...uni,
        status: uni.status === 'active' ? 'confirmed' : uni.status,
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

  const updateUniversityStatus = async (ids: string[], status: 'confirmed' | 'in_progress' | 'deleted') => {
    // When sending to API, map 'confirmed' back to 'active' if needed
    const apiStatus = status === 'confirmed' ? 'active' : status;
    try {
      await Promise.all(
        ids.map(id =>
          fetch(`${API_BASE_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${AUTH_TOKEN}` },
            body: JSON.stringify({ status: apiStatus }),
          })
        )
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

  const handleSoftDelete = () => updateUniversityStatus(selectedUniversities, 'deleted')
  const handleRestore = () => updateUniversityStatus(selectedUniversities, 'in_progress')
  const handleMoveToInprogress = () => updateUniversityStatus(selectedUniversities, 'in_progress')
  const handleMoveToConfirm = () => updateUniversityStatus(selectedUniversities, 'confirmed')

  const handlePermanentDelete = async () => {
    if (selectedUniversities.length === 0) return
    try {
      await Promise.all(
        selectedUniversities.map(id =>
          fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          })
        )
      )
      toast({ title: "Success", description: `${selectedUniversities.length} universities deleted permanently.` })
      setSelectedUniversities([])
      fetchUniversities()
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete universities.", variant: "destructive" })
    }
  }

  const handleConfirmAll = () => {
    const inprogressIds = universities.filter((u) => u.status === 'in_progress').map((u) => u._id)
    if (inprogressIds.length > 0) {
      updateUniversityStatus(inprogressIds, 'confirmed')
    } else {
      toast({ title: "Info", description: "No universities to confirm." })
    }
  }

  const filteredUniversities = universities.filter((university) => {
    const matchesSearch =
      university.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.city.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

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
              checked={selectedUniversities.length > 0 && selectedUniversities.length === items.length && items.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-[#5C5FC8] focus:ring-[#5C5FC8]"
            />
            <span className="text-sm text-gray-600">
              Select All • {selectedUniversities.length} Selected
            </span>
          </div>
          {selectedUniversities.length > 0 && (
            <div className="flex items-center space-x-2">
              {activeTab === 'confirm' && (
                  <Button variant="outline" size="sm" className="bg-white" onClick={handleMoveToInprogress}>Move to In-progress</Button>
              )}
              {activeTab === 'inprogress' && (
                  <Button variant="outline" size="sm" className="bg-white" onClick={handleMoveToConfirm}>Move to Confirm</Button>
              )}
               {activeTab === 'delete' && (
                  <Button variant="outline" size="sm" onClick={handleRestore}><RotateCw className="w-4 bg-white h-4 mr-2" />Restore</Button>
              )}
              {activeTab !== 'delete' ? (
                <Button variant="outline" size="sm" className="text-red-600 bg-white hover:text-red-700" onClick={handleSoftDelete}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
              ) : (
                <Button variant="destructive" size="sm" onClick={handlePermanentDelete}><Trash2 className="w-4 bg-white h-4 mr-2" />Delete Permanently</Button>
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="w-12"></TableHead><TableHead>University Name</TableHead><TableHead>No of Programs</TableHead><TableHead>Degrees</TableHead><TableHead>City</TableHead><TableHead>Sector</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader>
            <TableBody>
              {items.length > 0 ? items.map((university) => (
                <TableRow key={university._id}>
                  <TableCell><input type="checkbox" checked={selectedUniversities.includes(university._id)} onChange={(e) => handleSelectUniversity(university._id, e.target.checked)} className="rounded border-gray-300 text-[#5C5FC8] focus:ring-[#5C5FC8]" /></TableCell>
                  <TableCell className="font-medium">{university.fullName}</TableCell>
                  <TableCell>{Object.values(university.degreeCounts).reduce((a, b) => a + b, 0)}</TableCell>
                  <TableCell>{Object.entries(university.degreeCounts).filter(([, count]) => count > 0).map(([deg]) => deg.charAt(0).toUpperCase() + deg.slice(1)).join(", ")}</TableCell>
                  <TableCell>{university.city}</TableCell>
                  <TableCell>{university.sector}</TableCell>
                  <TableCell><div className="flex items-center space-x-2"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></div></TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No universities found for this category.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Showing {items.length > 0 ? (page - 1) * limit + 1 : 0}-{Math.min(page * limit, total)} of {total}</span>
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border bg-white rounded px-2 py-1">
              <option value={8}>8</option><option value={16}>16</option><option value={24}>24</option>
            </select>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              <span className="px-2">{page} of {totalPages || 1}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
            </div>
          </div>
        </div>
        {activeTab === 'inprogress' && items.length > 0 && (
          <div className="flex justify-end mt-6"><Button className="bg-[#5C5FC8] hover:bg-blue-400" onClick={handleConfirmAll}>Confirm All</Button></div>
        )}
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="confirm" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">Confirm</TabsTrigger>
            <TabsTrigger value="inprogress" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">In-progress</TabsTrigger>
            <TabsTrigger value="delete" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">Delete</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Search by Name or City" className="pl-10 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Button variant="outline" className="bg-transparent text-black" size="sm"><Filter className="w-4 h-4 mr-2" />Filters</Button>
          </div>
        </div>
        <TabsContent value="confirm" className="mt-6">{renderTable(filteredUniversities)}</TabsContent>
        <TabsContent value="inprogress" className="mt-6">{renderTable(filteredUniversities)}</TabsContent>
        <TabsContent value="delete" className="mt-6">{renderTable(filteredUniversities)}</TabsContent>
      </Tabs>
    </div>
  )
}