"use client"

import { useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Archive, FolderKanban, Pencil, Plus, RotateCcw, Search } from "lucide-react"
import { archiveProject, createProject, restoreProject, updateProject } from "@/app/actions/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { ProjectSummary } from "@/lib/db/schema"

type ProjectFilter = "active" | "archived"
type DraftProject = { id?: string; name: string; description: string }

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date))
}

export function ProjectsPanel({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<ProjectFilter>("active")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState<DraftProject>({ name: "", description: "" })
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null)

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesFilter = project.status === filter
      const matchesSearch = !query || `${project.name} ${project.description ?? ""}`.toLowerCase().includes(query)
      return matchesFilter && matchesSearch
    })
  }, [filter, projects, search])

  const openCreateDialog = () => {
    setDraft({ name: "", description: "" })
    setFormError(null)
    setDialogOpen(true)
  }

  const openEditDialog = (project: ProjectSummary) => {
    setDraft({ id: project.id, name: project.name, description: project.description ?? "" })
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSaving(true)

    const formData = new FormData(event.currentTarget)
    const input = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
    }

    try {
      if (draft.id) {
        await updateProject(draft.id, input)
      } else {
        await createProject(input)
      }
      setDialogOpen(false)
      router.refresh()
    } catch {
      setFormError("Could not save this project. Check the details and try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleProjectStatus = async (project: ProjectSummary, nextStatus: ProjectFilter) => {
    setActionError(null)
    setPendingProjectId(project.id)
    try {
      if (nextStatus === "archived") {
        await archiveProject(project.id)
      } else {
        await restoreProject(project.id)
      }
      router.refresh()
    } catch {
      setActionError("Could not update this project. Please try again.")
    } finally {
      setPendingProjectId(null)
    }
  }

  const activeCount = projects.filter((project) => project.status === "active").length
  const archivedCount = projects.length - activeCount

  return (
    <section className="rounded-xl border border-white/[0.075] bg-[#101013]">
      <div className="flex flex-col gap-4 border-b border-white/[0.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
        <div>
          <h2 className="text-[13px] font-medium text-zinc-100">Your projects</h2>
          <p className="mt-1 text-[11px] text-zinc-500">Organize the services and work you manage in DevCommand.</p>
        </div>
        <Button onClick={openCreateDialog} className="h-9 bg-violet-500 px-3.5 text-[11px] text-white hover:bg-violet-400">
          <Plus data-icon="inline-start" />New project
        </Button>
      </div>

      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => { if (value) setFilter(value as ProjectFilter) }}
          variant="outline"
          size="sm"
          aria-label="Filter projects by status"
          className="justify-start"
        >
          <ToggleGroupItem value="active" aria-label="Show active projects" className="h-8 border-white/[0.09] px-3 text-[10px] text-zinc-400 data-[state=on]:bg-white/[0.08] data-[state=on]:text-zinc-100">Active <span className="ml-1 text-zinc-500">{activeCount}</span></ToggleGroupItem>
          <ToggleGroupItem value="archived" aria-label="Show archived projects" className="h-8 border-white/[0.09] px-3 text-[10px] text-zinc-400 data-[state=on]:bg-white/[0.08] data-[state=on]:text-zinc-100">Archived <span className="ml-1 text-zinc-500">{archivedCount}</span></ToggleGroupItem>
        </ToggleGroup>
        <label className="flex h-9 w-full items-center gap-2 rounded-md border border-white/[0.09] bg-[#09090b] px-3 text-zinc-500 sm:max-w-[260px]">
          <Search aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="sr-only">Search projects</span>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" className="h-full border-0 bg-transparent px-0 text-[11px] shadow-none focus-visible:ring-0" />
        </label>
      </div>

      {actionError && <p role="alert" className="mx-4 mb-3 rounded-md border border-red-400/15 bg-red-400/[0.04] px-3 py-2 text-[11px] text-red-300 md:mx-5">{actionError}</p>}
      <div className="px-4 pb-5 md:px-5">
        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {visibleProjects.map((project) => (
              <article key={project.id} className="rounded-lg border border-white/[0.075] bg-[#0c0c0f] p-4 transition-colors hover:border-white/[0.14]">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-400/[0.07] text-violet-300"><FolderKanban aria-hidden="true" className="size-4" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-[12px] font-medium text-zinc-100">{project.name}</h3>
                      <Badge variant="outline" className={project.status === "active" ? "border-emerald-400/20 bg-emerald-400/[0.07] px-2 py-0 text-[9px] font-medium text-emerald-300" : "border-zinc-500/20 bg-zinc-500/[0.07] px-2 py-0 text-[9px] font-medium text-zinc-400"}>{project.status === "active" ? "Active" : "Archived"}</Badge>
                    </div>
                    <p className="mt-1.5 min-h-5 break-words text-[10px] leading-5 text-zinc-500">{project.description || "No description added."}</p>
                    <p className="mt-3 text-[9px] text-zinc-600">Updated {formatDate(project.updatedAt)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-3">
                  {project.status === "active" ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(project)} className="h-8 border-white/[0.09] bg-transparent px-2.5 text-[10px] text-zinc-300 hover:bg-white/[0.05]">
                        <Pencil data-icon="inline-start" />Edit
                      </Button>
                      <Button variant="ghost" size="sm" disabled={pendingProjectId === project.id} onClick={() => handleProjectStatus(project, "archived")} className="h-8 px-2.5 text-[10px] text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200">
                        <Archive data-icon="inline-start" />{pendingProjectId === project.id ? "Archiving…" : "Archive"}
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" disabled={pendingProjectId === project.id} onClick={() => handleProjectStatus(project, "active")} className="h-8 border-white/[0.09] bg-transparent px-2.5 text-[10px] text-zinc-300 hover:bg-white/[0.05]">
                      <RotateCcw data-icon="inline-start" />{pendingProjectId === project.id ? "Restoring…" : "Restore"}
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty className="min-h-[245px] gap-4 rounded-lg border border-dashed border-white/[0.1] bg-white/[0.015] p-6 text-zinc-100">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="border border-white/[0.08] bg-white/[0.035] text-zinc-400"><FolderKanban aria-hidden="true" /></EmptyMedia>
              <EmptyTitle className="text-[13px] font-medium text-zinc-200">{search ? "No matching projects" : filter === "active" ? "No projects yet" : "No archived projects"}</EmptyTitle>
              <EmptyDescription className="max-w-sm text-[11px] leading-5 text-zinc-500">{search ? "Try a different search term." : filter === "active" ? "Create a project to keep your services and engineering work organized." : "Archived projects will stay here until you restore them."}</EmptyDescription>
            </EmptyHeader>
            {!search && filter === "active" && <EmptyContent><Button onClick={openCreateDialog} className="h-9 bg-violet-500 px-3.5 text-[11px] text-white hover:bg-violet-400"><Plus data-icon="inline-start" />Create project</Button></EmptyContent>}
          </Empty>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-white/[0.1] bg-[#111114] p-5 text-zinc-100 sm:max-w-[480px]">
          <DialogHeader className="text-left">
            <DialogTitle className="text-[15px] font-semibold">{draft.id ? "Edit project" : "Create a project"}</DialogTitle>
            <DialogDescription className="text-[11px] leading-5 text-zinc-500">Add a clear name and an optional description for this workspace project.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4 py-2">
              <Field>
                <FieldLabel htmlFor="project-name" className="text-[11px] text-zinc-300">Project name</FieldLabel>
                <Input id="project-name" name="name" autoFocus required maxLength={80} defaultValue={draft.name} placeholder="e.g. Customer platform" className="h-10 border-white/[0.1] bg-[#09090b] text-[12px] text-zinc-100 placeholder:text-zinc-600" />
              </Field>
              <Field>
                <FieldLabel htmlFor="project-description" className="text-[11px] text-zinc-300">Description <span className="font-normal text-zinc-600">Optional</span></FieldLabel>
                <Textarea id="project-description" name="description" maxLength={300} defaultValue={draft.description} placeholder="What does this project include?" className="min-h-24 resize-y border-white/[0.1] bg-[#09090b] text-[12px] text-zinc-100 placeholder:text-zinc-600" />
              </Field>
            </FieldGroup>
            {formError && <p role="alert" className="mt-3 text-[11px] text-red-300">{formError}</p>}
            <DialogFooter className="mt-5 gap-2 sm:space-x-0">
              <Button type="button" variant="outline" disabled={isSaving} onClick={() => setDialogOpen(false)} className="border-white/[0.1] bg-transparent text-zinc-300 hover:bg-white/[0.05]">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-violet-500 text-white hover:bg-violet-400">{isSaving ? "Saving…" : draft.id ? "Save changes" : "Create project"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
