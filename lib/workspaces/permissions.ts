export type WorkspaceRole = "owner" | "admin" | "developer" | "viewer"
export type WorkspaceOption = {
  id: string
  name: string
  kind: "personal" | "team"
  role: WorkspaceRole
}

export function canManageProjects(role: WorkspaceRole) {
  return role === "owner" || role === "admin" || role === "developer"
}

export function canManageWorkspace(role: WorkspaceRole) {
  return role === "owner" || role === "admin"
}

export function canManageMembers(role: WorkspaceRole) {
  return role === "owner" || role === "admin"
}
