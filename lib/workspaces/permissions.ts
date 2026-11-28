export type WorkspaceRole = "owner" | "admin" | "developer" | "viewer"

export function canManageProjects(role: WorkspaceRole) {
  return role === "owner" || role === "admin" || role === "developer"
}

export function canManageWorkspace(role: WorkspaceRole) {
  return role === "owner" || role === "admin"
}

export function canManageMembers(role: WorkspaceRole) {
  return role === "owner" || role === "admin"
}
