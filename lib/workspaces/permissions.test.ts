import { describe, expect, it } from "vitest"
import { canManageMembers, canManageProjects, canManageWorkspace } from "@/lib/workspaces/permissions"
import type { WorkspaceRole } from "@/lib/workspaces/permissions"

const roles: WorkspaceRole[] = ["owner", "admin", "developer", "viewer"]

describe("workspace role permissions", () => {
  it("allows owners, admins, and developers to manage projects", () => {
    for (const role of ["owner", "admin", "developer"] as const) {
      expect(canManageProjects(role)).toBe(true)
    }
  })

  it("keeps viewer access read-only", () => {
    expect(canManageProjects("viewer")).toBe(false)
  })

  it("limits workspace and member administration to owners and admins", () => {
    expect(roles.filter(canManageWorkspace)).toEqual(["owner", "admin"])
    expect(roles.filter(canManageMembers)).toEqual(["owner", "admin"])
  })
})
