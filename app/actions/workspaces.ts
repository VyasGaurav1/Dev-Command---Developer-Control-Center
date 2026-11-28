"use server"

import { and, eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { workspaceMembers, workspaces } from "@/lib/db/schema"
import { ACTIVE_WORKSPACE_COOKIE, getAuthenticatedUserId } from "@/lib/workspaces/access"

const workspaceIdSchema = z.string().uuid()
const workspaceNameSchema = z.string().trim().min(2, "Workspace names need at least 2 characters.").max(48, "Workspace names can be up to 48 characters.")

function setActiveWorkspaceCookie(workspaceId: string) {
  return cookies().then((cookieStore) => {
    cookieStore.set(ACTIVE_WORKSPACE_COOKIE, workspaceId, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    })
  })
}

export async function switchWorkspace(input: unknown) {
  const userId = await getAuthenticatedUserId()
  const workspaceId = workspaceIdSchema.parse(input)
  const [membership] = await db
    .select({ workspaceId: workspaceMembers.workspaceId })
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
    .limit(1)

  if (!membership) throw new Error("Workspace not found.")

  await setActiveWorkspaceCookie(membership.workspaceId)
  revalidatePath("/dashboard")
}

export async function createTeamWorkspace(input: unknown) {
  const userId = await getAuthenticatedUserId()
  const name = workspaceNameSchema.parse(input)

  const workspace = await db.transaction(async (tx) => {
    const [createdWorkspace] = await tx
      .insert(workspaces)
      .values({ name, kind: "team", ownerUserId: userId })
      .returning({ id: workspaces.id })

    await tx.insert(workspaceMembers).values({
      workspaceId: createdWorkspace.id,
      userId,
      role: "owner",
    })

    return createdWorkspace
  })

  await setActiveWorkspaceCookie(workspace.id)
  revalidatePath("/dashboard")
}
