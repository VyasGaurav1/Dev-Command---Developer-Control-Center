import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Dashboard from "@/components/kokonutui/dashboard"
import { listProjects } from "@/app/actions/projects"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const projects = await listProjects()
  return <Dashboard userName={session.user.name} userEmail={session.user.email} projects={projects} />
}

