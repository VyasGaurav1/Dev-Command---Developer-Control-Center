import "server-only"

import { and, desc, eq } from "drizzle-orm"
import { cookies, headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { workspaceMembers, workspaces } from "@/lib/db/schema"
import type { WorkspaceRole } from "@/lib/workspaces/permissions"

export const ACTIVE_WORKSPACE_COOKIE = "devcommand-active-workspace"

export type WorkspaceOption = {
  id: string
  name: string
  kind: "personal" | "team"
  role: WorkspaceRole
}

export async function getAuthenticatedUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

async function ensurePersonalWorkspace(userId: string) {
  await db.transaction(async (tx) => {
    await tx
      .insert(workspaces)
      .values({ name: "Personal workspace", kind: "personal", ownerUserId: userId })
      .onConflictDoNothing()

    const [personalWorkspace] = await tx
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(and(eq(workspaces.ownerUserId, userId), eq(workspaces.kind, "personal")))
      .limit(1)

    if (!personalWorkspace) throw new Error("Could not initialize personal workspace.")

    await tx
      .insert(workspaceMembers)
      .values({ workspaceId: personalWorkspace.id, userId, role: "owner" })
      .onConflictDoNothing()
  })
}

export async function getCurrentWorkspaceContext() {
  const userId = await getAuthenticatedUserId()
  await ensurePersonalWorkspace(userId)

  const [cookieStore, memberships] = await Promise.all([
    cookies(),
    db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        kind: workspaces.kind,
        ownerUserId: workspaces.ownerUserId,
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId))
      .orderBy(desc(workspaces.createdAt)),
  ])

  const availableWorkspaces: WorkspaceOption[] = memberships.map(({ id, name, kind, role }) => ({
    id,
    name,
    kind,
    role: role as WorkspaceRole,
  }))
  const requestedWorkspaceId = cookieStore.get(ACTIVE_WORKSPACE_COOKIE)?.value
  const activeWorkspace =
    availableWorkspaces.find((workspace) => workspace.id === requestedWorkspaceId) ??
    availableWorkspaces.find((workspace) => memberships.some((membership) => membership.id === workspace.id && membership.ownerUserId === userId && membership.kind === "personal")) ??
    availableWorkspaces[0]

  if (!activeWorkspace) throw new Error("No accessible workspace is available.")

  return { userId, workspaces: availableWorkspaces, activeWorkspace }
}

export async function requireWorkspaceRole(allowedRoles?: readonly WorkspaceRole[]) {
  const context = await getCurrentWorkspaceContext()
  if (allowedRoles && !allowedRoles.includes(context.activeWorkspace.role)) {
    throw new Error("You do not have permission to perform this action.")
  }
  return {
    userId: context.userId,
    workspaceId: context.activeWorkspace.id,
    role: context.activeWorkspace.role,
  }
}
