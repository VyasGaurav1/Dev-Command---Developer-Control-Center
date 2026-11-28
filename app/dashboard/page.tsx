import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Dashboard from "@/components/kokonutui/dashboard"
import { listProjects } from "@/app/actions/projects"
import { auth } from "@/lib/auth"
import { getCurrentWorkspaceContext } from "@/lib/workspaces/access"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const [workspaceContext, projects] = await Promise.all([getCurrentWorkspaceContext(), listProjects()])
  return (
    <Dashboard
      userName={session.user.name}
      userEmail={session.user.email}
      projects={projects}
      workspaces={workspaceContext.workspaces}
      activeWorkspaceId={workspaceContext.activeWorkspace.id}
    />
  )
}

