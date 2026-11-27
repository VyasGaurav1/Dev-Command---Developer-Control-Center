import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DevCommand — Developer Control Center",
  description: "Manage projects, deployments, infrastructure, and uptime monitoring in one secure workspace.",
  generator: "v0.app",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

