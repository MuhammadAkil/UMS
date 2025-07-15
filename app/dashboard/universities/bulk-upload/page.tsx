import { BulkUploadForm } from "@/components/universities/bulk-upload-form"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function BulkUploadPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Universities", href: "/dashboard/universities" },
          { label: "Bulk Upload", href: "/dashboard/universities/bulk-upload" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Universities</h1>
        <p className="text-gray-600">Upload multiple universities at once</p>
      </div>
      <BulkUploadForm />
    </div>
  )
}
