import { Card } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Universities",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: GraduationCap,
  },
  {
    title: "Active Students",
    value: "45,678",
    change: "+8%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Total Courses",
    value: "8,901",
    change: "+15%",
    changeType: "positive" as const,
    icon: BookOpen,
  },
  {
    title: "Growth Rate",
    value: "23.5%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <stat.icon className="w-6 h-6 text-[#5C5FC8]" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
