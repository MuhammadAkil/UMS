import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, FileText, Settings } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Add University",
    description: "Create a new university profile",
    icon: Plus,
    href: "/dashboard/universities/add",
    color: "bg-blue-50 text-[#5C5FC8]",
  },
  {
    title: "Bulk Upload",
    description: "Upload multiple universities",
    icon: Upload,
    href: "/dashboard/universities/bulk-upload",
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Generate Report",
    description: "Create analytics report",
    icon: FileText,
    href: "/dashboard/reports",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "System Settings",
    description: "Configure system preferences",
    icon: Settings,
    href: "/dashboard/settings",
    color: "bg-gray-50 text-gray-600",
  },
]

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-600 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button variant="ghost" className="h-auto p-4 justify-start text-left hover:bg-[#5D71FC1C] w-full">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  )
}
