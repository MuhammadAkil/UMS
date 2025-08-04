import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { DM_Sans } from "next/font/google"
import { AuthProvider } from "@/components/providers/auth-provider"


const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600","700"] })

export const metadata: Metadata = {
  title: "University Management System",
  description: "A comprehensive university management platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={dmSans.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
