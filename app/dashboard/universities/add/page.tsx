import { AddUniversityForm } from "@/components/universities/add-university-form"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function AddUniversityPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Universities", href: "/dashboard/universities" },
          { label: "Add University", href: "/dashboard/universities/add" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New University</h1>
        <p className="text-gray-600">Create a new university profile</p>
      </div>
      <AddUniversityForm />
    </div>
  )
}
