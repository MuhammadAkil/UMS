import { UniversityList } from "@/components/universities/university-list"
import { UniversityHeader } from "@/components/universities/university-header"

export default function UniversitiesPage() {
  return (
    <div className="space-y-6">
      <UniversityHeader />
      <UniversityList />
    </div>
  )
}
