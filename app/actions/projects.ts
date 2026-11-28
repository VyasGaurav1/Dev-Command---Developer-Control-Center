"use server"

import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { requireWorkspaceRole } from "@/lib/workspaces/access"
import { canManageProjects } from "@/lib/workspaces/permissions"

const projectInputSchema = z.object({
  name: z.string().trim().min(1, "Enter a project name.").max(80, "Project names can be up to 80 characters."),
  description: z.string().trim().max(300, "Descriptions can be up to 300 characters.").default(""),
})

const projectIdSchema = z.string().uuid()
const projectManagerRoles = ["owner", "admin", "developer"] as const

export async function listProjects() {
  const { workspaceId } = await requireWorkspaceRole()

  return db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(eq(projects.workspaceId, workspaceId))
    .orderBy(desc(projects.updatedAt))
}

export async function createProject(input: unknown) {
  const { userId, workspaceId } = await requireWorkspaceRole(projectManagerRoles)
  const project = projectInputSchema.parse(input)

  await db.insert(projects).values({
    userId,
    workspaceId,
    name: project.name,
    description: project.description || null,
  })

  revalidatePath("/dashboard")
}

export async function updateProject(projectId: string, input: unknown) {
  const { workspaceId, role } = await requireWorkspaceRole()
  if (!canManageProjects(role)) throw new Error("You do not have permission to perform this action.")
  const id = projectIdSchema.parse(projectId)
  const project = projectInputSchema.parse(input)

  const [updatedProject] = await db
    .update(projects)
    .set({
      name: project.name,
      description: project.description || null,
      updatedAt: new Date(),
    })
    .where(and(eq(projects.id, id), eq(projects.workspaceId, workspaceId), eq(projects.status, "active")))
    .returning({ id: projects.id })

  if (!updatedProject) throw new Error("Project not found.")
  revalidatePath("/dashboard")
}

export async function archiveProject(projectId: string) {
  const { workspaceId, role } = await requireWorkspaceRole()
  if (!canManageProjects(role)) throw new Error("You do not have permission to perform this action.")
  const id = projectIdSchema.parse(projectId)

  const [archivedProject] = await db
    .update(projects)
    .set({ status: "archived", updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.workspaceId, workspaceId), eq(projects.status, "active")))
    .returning({ id: projects.id })

  if (!archivedProject) throw new Error("Project not found.")
  revalidatePath("/dashboard")
}

export async function restoreProject(projectId: string) {
  const { workspaceId, role } = await requireWorkspaceRole()
  if (!canManageProjects(role)) throw new Error("You do not have permission to perform this action.")
  const id = projectIdSchema.parse(projectId)

  const [restoredProject] = await db
    .update(projects)
    .set({ status: "active", updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.workspaceId, workspaceId), eq(projects.status, "archived")))
    .returning({ id: projects.id })

  if (!restoredProject) throw new Error("Project not found.")
  revalidatePath("/dashboard")
}
