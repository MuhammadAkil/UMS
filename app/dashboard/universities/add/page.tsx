import { AddUniversityForm } from "@/components/universities/add-university-form"

export default function AddUniversityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New University</h1>
        <p className="text-gray-600">Create a new university profile</p>
      </div>
      <AddUniversityForm />
    </div>
  )
}
