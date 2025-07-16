"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  Calculator,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "University Management",
    href: "/dashboard/universities",
    icon: GraduationCap,
  },
  {
    name: "Mcqs Management",
    href: "/dashboard/mcqs",
    icon: Users,
  },
  {
    name: "Past Papers",
    href: "/dashboard/past-papers",
    icon: FileText,
  },
  {
    name: "Merit Calculator",
    href: "/dashboard/merit-calculator",
    icon: Calculator,
  },
  {
    name: "Setting",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">A</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Academix</div>
              <div className="text-xs text-blue-200">Portal</div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-blue-500"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-white text-blue-600" : "text-blue-100 hover:bg-blue-500 hover:text-white",
              )}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-500">
        <Button variant="ghost" className="w-full justify-start text-blue-100 hover:bg-blue-500 hover:text-white">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Log Out</span>}
        </Button>
      </div>
    </div>
  )
}
