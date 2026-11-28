"use client"

import { useState, useTransition, type FormEvent, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { createTeamWorkspace, switchWorkspace } from "@/app/actions/workspaces"
import type { WorkspaceOption } from "@/lib/workspaces/permissions"

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
  collapsed = false,
}: {
  workspaces: WorkspaceOption[]
  activeWorkspaceId: string
  collapsed?: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  function handleSwitch(workspaceId: string) {
    setError("")
    startTransition(async () => {
      try {
        await switchWorkspace(workspaceId)
        router.refresh()
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not switch workspaces.")
      }
    })
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    startTransition(async () => {
      try {
        await createTeamWorkspace(name)
        setName("")
        router.refresh()
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not create workspace.")
      }
    })
  }

  function preventCompositionSubmit(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) {
      event.preventDefault()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="sr-only" htmlFor="active-workspace">Current workspace</label>
      <select
        id="active-workspace"
        aria-label="Current workspace"
        title="Switch workspace"
        value={activeWorkspaceId}
        disabled={isPending}
        onChange={(event) => handleSwitch(event.target.value)}
        className="h-9 w-full rounded-lg border border-white/[0.08] bg-[#121215] px-2 text-[11px] text-zinc-200 outline-none transition hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-60"
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name} · {workspace.kind === "personal" ? "Personal" : workspace.role}
          </option>
        ))}
      </select>
      {!collapsed && (
        <details className="group rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2">
          <summary className="cursor-pointer list-none text-[10px] font-medium text-zinc-500 outline-none hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-violet-400">
            Create team workspace
          </summary>
          <form onSubmit={handleCreate} className="mt-2 flex flex-col gap-2">
            <label htmlFor="new-workspace-name" className="sr-only">Workspace name</label>
            <input
              id="new-workspace-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={preventCompositionSubmit}
              maxLength={48}
              required
              minLength={2}
              placeholder="Team workspace name"
              className="h-8 w-full rounded-md border border-white/[0.09] bg-black/20 px-2 text-[10px] text-zinc-200 outline-none placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-violet-400"
            />
            <button type="submit" disabled={isPending || name.trim().length < 2} className="h-8 w-full rounded-md bg-violet-500/15 px-2 text-[10px] font-medium text-violet-200 transition hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-50">
              {isPending ? "Working…" : "Create workspace"}
            </button>
          </form>
        </details>
      )}
      {error && <p role="alert" className="text-[10px] leading-4 text-rose-300">{error}</p>}
    </div>
  )
}
