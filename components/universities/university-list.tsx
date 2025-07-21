"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Edit, Eye, Search, Filter, ArrowUpDown, Trash2 } from "lucide-react"
import { useUniversityStore } from "@/lib/store/university-store"
import { toast } from "@/hooks/use-toast"

export function UniversityList() {
  const { universities, loading, error, fetchUniversities, deleteUniversity, updateUniversity } = useUniversityStore()

  const [selectedUniversities, setSelectedUniversities] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("public")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchUniversities()
  }, [fetchUniversities])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUniversities(filteredUniversities.map((u) => u.id))
    } else {
      setSelectedUniversities([])
    }
  }

  const handleSelectUniversity = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedUniversities([...selectedUniversities, id])
    } else {
      setSelectedUniversities(selectedUniversities.filter((uid) => uid !== id))
    }
  }

  const handleMoveToInprogress = async () => {
    try {
      for (const id of selectedUniversities) {
        await updateUniversity(id, { status: "Inprogress" as any })
      }
      setSelectedUniversities([])
      toast({
        title: "Success",
        description: `${selectedUniversities.length} universities moved to in progress.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move universities.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      for (const id of selectedUniversities) {
        await deleteUniversity(id)
      }
      setSelectedUniversities([])
      toast({
        title: "Success",
        description: `${selectedUniversities.length} universities deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete universities.",
        variant: "destructive",
      })
    }
  }

  const handleConfirmAll = async () => {
    try {
      const inprogressUniversities = universities.filter((u) => u.status === "Inprogress")
      for (const university of inprogressUniversities) {
        await updateUniversity(university.id, { status: "Active" })
      }
      toast({
        title: "Success",
        description: "All universities confirmed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm universities.",
        variant: "destructive",
      })
    }
  }

  const filteredUniversities = universities.filter((university) => {
    const matchesSearch =
      university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.city.toLowerCase().includes(searchQuery.toLowerCase())

    switch (activeTab) {
      case "public":
        return matchesSearch && university.status === "Active"
      case "inprogress":
        return matchesSearch && university.status === "Inprogress"
      case "delete":
        return matchesSearch && university.status === "Deleted"
      default:
        return matchesSearch
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading universities...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="public" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
              Public
            </TabsTrigger>
            <TabsTrigger value="inprogress" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
              Inprogress
            </TabsTrigger>
            <TabsTrigger value="delete" className="data-[state=active]:bg-white data-[state=active]:text-[#5C5FC8]">
              Delete
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className=" bg-transparent text-black" size="sm">
              <Filter className="w-4 h-4 mr-2 " />
              Filters
            </Button>
          </div>
        </div>

        <TabsContent value="public" className="mt-6">
          <Card>
            <div className="p-6 text-black">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedUniversities.length === filteredUniversities.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="
                      h-5 w-5             /* Increase height and width */
                      rounded
                      border-gray-300
                      !bg-white
                      !checked:bg-[#5C5FC8]
                      !checked:border-[#5C5FC8]
                    "
                  />
                  <span className="text-sm text-gray-600">
                    Select All Universities • {selectedUniversities.length} Selected
                  </span>
                </div>
                {selectedUniversities.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button className=" bg-transparent" variant="outline" size="sm" onClick={handleMoveToInprogress}>
                      Move to Inprogress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:none">
                      <TableHead className="w-12"></TableHead>
                      <TableHead>University Name</TableHead>
                      <TableHead>No of Programs</TableHead>
                      <TableHead>Degrees</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUniversities.map((university, index) => (
                      <TableRow key={university.id} className={index % 2 === 0 ? "bg-gray-50 hover:none" : "bg-white hover:none"}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUniversities.includes(university.id)}
                            onChange={(e) => handleSelectUniversity(university.id, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{university.name}</TableCell>
                        <TableCell>{university.programs || 0}</TableCell>
                        <TableCell>{university.degrees || "BS, MPhil, PhD"}</TableCell>
                        <TableCell>{university.city}</TableCell>
                        <TableCell>{university.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>
                  1-{Math.min(8, filteredUniversities.length)} of {filteredUniversities.length}
                </span>
                <div className="flex items-center bg-white space-x-2">
                  <span>Rows per page:</span>
                  <select className="border bg-white rounded px-2 py-1">
                    <option>08</option>
                    <option>16</option>
                    <option>24</option>
                  </select>
                  <div className="flex bg-white items-center space-x-1">
                    <Button variant="outline" className="bg-white" size="sm">
                      1
                    </Button>
                    <Button variant="outline" className="bg-white" size="sm">
                      2
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="inprogress" className="mt-6">
          <Card>
            <div className="p-6 text-black">
              {filteredUniversities.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedUniversities.length === filteredUniversities.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 bg-white"
                      />
                      <span className="text-sm text-gray-600">
                        Select All Users • {selectedUniversities.length} Users Selected
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button className="text-white" variant="outline" size="sm">
                        Move to Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:none">
                          <TableHead className="w-12"></TableHead>
                          <TableHead>University Name</TableHead>
                          <TableHead>No of Programs</TableHead>
                          <TableHead>Degrees</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Sector</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUniversities.map((university, index) => (
                          <TableRow key={university.id} className={index % 2 === 0 ? "bg-gray-50 hover:none" : "bg-white hover:none"}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedUniversities.includes(university.id)}
                                onChange={(e) => handleSelectUniversity(university.id, e.target.checked)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{university.name}</TableCell>
                            <TableCell>{university.programs || 0}</TableCell>
                            <TableCell>{university.degrees || "BS, MPhil, PhD"}</TableCell>
                            <TableCell>{university.city}</TableCell>
                            <TableCell>{university.type}</TableCell>
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
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button className="bg-[#5C5FC8] hover:bg-blue-400" onClick={handleConfirmAll}>
                      Confirm All
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No universities in progress</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="delete" className="mt-6">
          <Card>
            <div className="p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">No universities marked for deletion</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}