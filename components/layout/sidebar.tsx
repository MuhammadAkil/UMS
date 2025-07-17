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
        "flex flex-col h-screen bg-white text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-28 h-10 flex items-center justify-center">
              <img src="/light mode.svg" alt="Academix Logo" className="h-10" />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-[#5D71FC1C] text-black" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
              )}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer with Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-gray-100 hover:text-red-800"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && (
            <span className="ml-3 inline-flex items-center">
              <img src="/logout.svg" alt="Logout Icon" className="w-5 h-5 mr-2" />
              Log Out
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}