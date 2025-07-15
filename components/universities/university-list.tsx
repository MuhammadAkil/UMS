"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

// Dummy data - replace with API call later
const universities = [
  {
    id: 1,
    name: "Harvard University",
    location: "Cambridge, MA",
    type: "Private",
    established: 1636,
    students: 23000,
    status: "Active",
    ranking: 1,
  },
  {
    id: 2,
    name: "Stanford University",
    location: "Stanford, CA",
    type: "Private",
    established: 1885,
    students: 17000,
    status: "Active",
    ranking: 2,
  },
  {
    id: 3,
    name: "MIT",
    location: "Cambridge, MA",
    type: "Private",
    established: 1861,
    students: 11500,
    status: "Active",
    ranking: 3,
  },
  {
    id: 4,
    name: "University of California, Berkeley",
    location: "Berkeley, CA",
    type: "Public",
    established: 1868,
    students: 45000,
    status: "Active",
    ranking: 4,
  },
  {
    id: 5,
    name: "Yale University",
    location: "New Haven, CT",
    type: "Private",
    established: 1701,
    students: 13500,
    status: "Inactive",
    ranking: 5,
  },
]

export function UniversityList() {
  const [selectedUniversities, setSelectedUniversities] = useState<number[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUniversities(universities.map((u) => u.id))
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

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Universities ({universities.length})</h2>
          {selectedUniversities.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedUniversities.length} selected</span>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedUniversities.length === universities.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>University Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Established</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Ranking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.map((university) => (
                <TableRow key={university.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUniversities.includes(university.id)}
                      onChange={(e) => handleSelectUniversity(university.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{university.name}</TableCell>
                  <TableCell>{university.location}</TableCell>
                  <TableCell>
                    <Badge variant={university.type === "Private" ? "default" : "secondary"}>{university.type}</Badge>
                  </TableCell>
                  <TableCell>{university.established}</TableCell>
                  <TableCell>{university.students.toLocaleString()}</TableCell>
                  <TableCell>#{university.ranking}</TableCell>
                  <TableCell>
                    <Badge variant={university.status === "Active" ? "default" : "destructive"}>
                      {university.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
