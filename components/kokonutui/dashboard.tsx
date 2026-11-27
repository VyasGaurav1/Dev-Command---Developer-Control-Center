"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity, AlertTriangle, ArrowUpRight, Bell, Box, Check, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, ExternalLink, Github, HardDrive,
  Globe2, LayoutDashboard, ListTodo, LockKeyhole, Menu, Plus, Search, Server,

  Settings2, ShieldCheck, Sparkles, Terminal, X, Zap, LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type Section = "Overview" | "Projects" | "Repositories" | "Deployments" | "Servers" | "Uptime Monitoring" | "Domains & SSL" | "APIs & AI Providers" | "Logs & Incidents" | "Tasks" | "Notifications" | "Integrations" | "Settings"

const sections: { label: Section; icon: typeof LayoutDashboard; group: string }[] = [
  { label: "Overview", icon: LayoutDashboard, group: "Workspace" },
  { label: "Projects", icon: Box, group: "Workspace" },
  { label: "Repositories", icon: Github, group: "Workspace" },
  { label: "Deployments", icon: ArrowUpRight, group: "Operate" },
  { label: "Servers", icon: Server, group: "Operate" },
  { label: "Uptime Monitoring", icon: Activity, group: "Operate" },
  { label: "Domains & SSL", icon: Globe2, group: "Operate" },
  { label: "APIs & AI Providers", icon: Zap, group: "Operate" },
  { label: "Logs & Incidents", icon: AlertTriangle, group: "Operate" },
  { label: "Tasks", icon: ListTodo, group: "Manage" },
  { label: "Notifications", icon: Bell, group: "Manage" },
  { label: "Integrations", icon: LockKeyhole, group: "Manage" },
  { label: "Settings", icon: Settings2, group: "Manage" },
]

const resourceCards = [
  { title: "Projects", value: "—", hint: "Connect a workspace to get started", icon: Box },
  { title: "Healthy services", value: "—", hint: "Monitoring is not configured", icon: ShieldCheck },
  { title: "Open incidents", value: "—", hint: "No monitoring data connected", icon: AlertTriangle },
  { title: "Deployments", value: "—", hint: "Connect a deployment provider", icon: ArrowUpRight },
]

function SectionPlaceholder({ section, onIntegrations }: { section: Section; onIntegrations: () => void }) {
  const SectionIcon = sections.find((item) => item.label === section)?.icon ?? LayoutDashboard
  const copy: Record<Section, { text: string; action: string }> = {
    Overview: { text: "Connect your tools to see your infrastructure at a glance.", action: "Configure integrations" },
    Projects: { text: "Projects you create or import will appear here.", action: "Configure integrations" },
    Repositories: { text: "Connect GitHub to securely import repositories you can access.", action: "Connect GitHub" },
    Deployments: { text: "Connect a deployment provider to sync deployment history.", action: "Configure integrations" },
    Servers: { text: "Register a monitoring agent to start receiving server metrics.", action: "View agent setup" },
    "Uptime Monitoring": { text: "Add an HTTP, HTTPS, or TCP monitor to start tracking availability.", action: "Configure integrations" },
    "Domains & SSL": { text: "Add domains to keep registration and certificate expirations in view.", action: "Configure integrations" },
    "APIs & AI Providers": { text: "Connect a provider to track usage and availability securely.", action: "Configure integrations" },
    "Logs & Incidents": { text: "Monitoring events and connected application logs will appear here.", action: "Configure integrations" },
    Tasks: { text: "Keep operational follow-ups and maintenance tasks organized.", action: "Configure integrations" },
    Notifications: { text: "Set up delivery channels and event preferences for your workspace.", action: "Configure integrations" },
    Integrations: { text: "Connect providers to bring your engineering operations into one place.", action: "Configure integrations" },
    Settings: { text: "Manage your workspace, security, and data preferences.", action: "Configure integrations" },
  }
  const { text, action } = copy[section]
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.11] bg-white/[0.015] px-6 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-zinc-400"><SectionIcon className="size-[18px]" /></div>
      <p className="max-w-sm text-[13px] leading-6 text-zinc-400">{text}</p>
      <button onClick={onIntegrations} className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-[12px] font-medium text-zinc-900 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
        <Plus className="size-3.5" />{action}
      </button>
    </div>
  )
}

export default function Dashboard({ userName, userEmail }: { userName: string; userEmail: string }) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>("Overview")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [integrationsOpen, setIntegrationsOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [search, setSearch] = useState("")
  const initials = userName.trim().split(/\\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
  const filteredSections = useMemo(() => sections.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())), [search])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
      if (event.key === "Escape") {
        setCommandOpen(false)
        setIntegrationsOpen(false)
        setMobileOpen(false)
        setAccountOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const selectSection = (label: Section) => {
    setActiveSection(label)
    setCommandOpen(false)
    setMobileOpen(false)
  }

  const sidebar = (
    <aside className={cn("flex h-full flex-col border-r border-white/[0.07] bg-[#0b0b0d] transition-[width] duration-200", collapsed ? "w-[68px]" : "w-[232px]")}>
      <div className={cn("flex h-[62px] items-center border-b border-white/[0.07]", collapsed ? "justify-center px-2" : "justify-between px-4")}>
        <button onClick={() => selectSection("Overview")} className="flex items-center gap-2.5 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
          <span className="flex size-8 items-center justify-center rounded-lg bg-violet-500 text-white"><Terminal className="size-[17px]" /></span>
          {!collapsed && <span className="text-[13px] font-semibold tracking-[-0.02em] text-zinc-100">devcommand<span className="ml-1 text-violet-400">.</span></span>}
        </button>
        {!collapsed && <button aria-label="Collapse sidebar" onClick={() => setCollapsed(true)} className="rounded-md p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"><ChevronLeft className="size-4" /></button>}
      </div>
      <div className={cn("border-b border-white/[0.07] py-3", collapsed ? "px-2" : "px-3")}>
        <button className={cn("flex w-full items-center rounded-lg border border-white/[0.08] bg-white/[0.025] p-2 text-left hover:bg-white/[0.05]", collapsed ? "justify-center" : "gap-2.5")} aria-label="Select workspace">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#28252f] text-[10px] font-semibold text-violet-200">DV</span>
          {!collapsed && <><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-medium text-zinc-200">Personal workspace</span><span className="mt-0.5 block text-[10px] text-zinc-500">Free plan</span></span><ChevronDown className="size-3.5 text-zinc-500" /></>}
        </button>
      </div>
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2.5 py-3">
        {["Workspace", "Operate", "Manage"].map((group) => (
          <div key={group} className="mb-4">
            {!collapsed && <p className="mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">{group}</p>}
            <div className="flex flex-col gap-0.5">
              {sections.filter((item) => item.group === group).map(({ label, icon: Icon }) => (
                <button key={label} onClick={() => selectSection(label)} title={collapsed ? label : undefined} aria-current={activeSection === label ? "page" : undefined} className={cn("flex h-[34px] items-center rounded-md text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400", collapsed ? "justify-center px-0" : "gap-2.5 px-2", activeSection === label ? "bg-white/[0.085] font-medium text-zinc-100" : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300")}>
                  <Icon className={cn("size-[15px] shrink-0", activeSection === label && "text-violet-300")} />{!collapsed && <span className="truncate">{label}</span>}
                  {label === "Logs & Incidents" && !collapsed && <span className="ml-auto size-1.5 rounded-full bg-zinc-700" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      {!collapsed && <div className="mx-3 mb-3 rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
        <div className="mb-2 flex items-center gap-2"><Sparkles className="size-3.5 text-violet-300" /><span className="text-[10px] font-medium text-zinc-300">DevCommand preview</span></div>
        <p className="text-[10px] leading-4 text-zinc-500">Connect your tools to bring your stack into one workspace.</p>
        <button onClick={() => setIntegrationsOpen(true)} className="mt-2.5 text-[10px] font-medium text-violet-300 hover:text-violet-200">Set up integrations <ArrowUpRight className="ml-1 inline size-3" /></button>
      </div>}
      <div className="border-t border-white/[0.07] p-2.5">
        {collapsed ? <button onClick={() => setCollapsed(false)} aria-label="Expand sidebar" className="flex h-9 w-full items-center justify-center rounded-md text-zinc-500 hover:bg-white/[0.05]"><ChevronRight className="size-4" /></button> : <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"><CircleHelp className="size-4" /><span className="text-[11px]">Help & support</span><ExternalLink className="ml-auto size-3" /></button>}
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-violet-500/30">
      <div className="flex min-h-screen">
        <div className="hidden shrink-0 md:block">{sidebar}</div>
        {mobileOpen && <div className="fixed inset-0 z-40 md:hidden"><button className="absolute inset-0 bg-black/70" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />{sidebar}</div>}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[62px] items-center justify-between border-b border-white/[0.07] bg-[#09090b]/95 px-4 backdrop-blur md:px-7">
            <div className="flex items-center gap-3">
              <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-zinc-400 hover:bg-white/[0.06] md:hidden"><Menu className="size-4" /></button>
              <div className="hidden items-center gap-2 text-[11px] text-zinc-600 sm:flex"><span>Workspace</span><span>/</span><span className="text-zinc-300">{activeSection}</span></div>
              <span className="text-sm font-medium text-zinc-200 sm:hidden">{activeSection}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCommandOpen(true)} className="flex h-8 items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 text-[10px] text-zinc-500 transition hover:border-white/[0.15] hover:text-zinc-300"><Search className="size-3.5" /><span className="hidden sm:inline">Search anything...</span><kbd className="ml-1 hidden rounded border border-white/[0.1] px-1 py-0.5 font-mono text-[9px] text-zinc-600 sm:inline">⌘ K</kbd></button>
              <button aria-label="Notifications" onClick={() => selectSection("Notifications")} className="relative rounded-md p-2 text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"><Bell className="size-4" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-violet-400" /></button>
              <div className="relative ml-1">
                <button type="button" onClick={() => setAccountOpen((open) => !open)} aria-label="Account menu" aria-expanded={accountOpen} className="flex size-7 items-center justify-center rounded-full border border-white/[0.1] bg-[#242129] text-[9px] font-semibold text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">{initials || "U"}</button>
                {accountOpen && <div className="absolute right-0 top-10 z-30 w-56 rounded-lg border border-white/[0.1] bg-[#111114] p-2 shadow-xl shadow-black/40" role="group" aria-label="Account actions"><p className="truncate px-2 py-2 text-[10px] text-zinc-500">{userEmail}</p><button type="button" role="menuitem" onClick={async () => { await authClient.signOut(); router.replace("/sign-in"); router.refresh() }} className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-[11px] text-zinc-300 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"><LogOut className="size-3.5" />Sign out</button></div>}
              </div>
            </div>
          </header>
          <div className="mx-auto max-w-[1280px] px-4 py-7 md:px-7 md:py-9">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div><div className="mb-2 flex items-center gap-2"><span className="size-1.5 rounded-full bg-amber-400" /><span className="text-[10px] font-medium uppercase tracking-[0.11em] text-zinc-500">Workspace setup</span></div><h1 className="text-[22px] font-semibold tracking-[-0.035em] text-zinc-100">{activeSection === "Overview" ? `Good morning, ${userName.split(" ")[0] || "developer"}` : activeSection}</h1><p className="mt-1.5 text-[12px] text-zinc-500">Your infrastructure command center. Data will appear as providers are connected.</p></div>
              <button onClick={() => setIntegrationsOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-md bg-violet-500 px-3.5 text-[11px] font-medium text-white shadow-sm shadow-violet-950/30 transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"><Plus className="size-3.5" />Connect a service</button>
            </div>
            {activeSection === "Overview" ? <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {resourceCards.map(({ title, value, hint, icon: Icon }) => <article key={title} className="rounded-lg border border-white/[0.075] bg-[#101013] p-4 transition-colors hover:border-white/[0.12]">
                  <div className="mb-5 flex items-center justify-between"><span className="text-[11px] text-zinc-500">{title}</span><Icon className="size-4 text-zinc-600" /></div><p className="text-[25px] font-semibold tracking-[-0.04em] text-zinc-300">{value}</p><p className="mt-1.5 text-[10px] text-zinc-600">{hint}</p>
                </article>)}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
                <section className="rounded-lg border border-white/[0.075] bg-[#101013]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5"><div><h2 className="text-[12px] font-medium text-zinc-200">Infrastructure activity</h2><p className="mt-1 text-[10px] text-zinc-600">Live events from connected providers</p></div><button aria-label="Open tasks" onClick={() => selectSection("Tasks")} className="rounded-md p-1.5 text-zinc-500 hover:bg-white/[0.06]"><ArrowUpRight className="size-3.5" /></button></div>
                  <SectionPlaceholder section="Overview" onIntegrations={() => setIntegrationsOpen(true)} />
                </section>
                <section className="rounded-lg border border-white/[0.075] bg-[#101013]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5"><div><h2 className="text-[12px] font-medium text-zinc-200">Connected services</h2><p className="mt-1 text-[10px] text-zinc-600">Provider connection status</p></div><button onClick={() => selectSection("Integrations")} className="text-[10px] text-zinc-500 hover:text-zinc-300">Manage</button></div>
                  <div className="flex flex-col gap-0 px-4">
                    {[{ name: "Neon Database", sub: "Connected · Postgres", icon: HardDrive, state: "connected" }, { name: "GitHub", sub: "Repository access", icon: Github, state: "disconnected" }, { name: "Deployment provider", sub: "Vercel, Netlify, Railway…", icon: ArrowUpRight, state: "disconnected" }].map((item, index) => <div key={item.name} className={cn("flex items-center gap-3 py-3.5", index !== 2 && "border-b border-white/[0.055]")}><span className="flex size-8 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025] text-zinc-400"><item.icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-[11px] font-medium text-zinc-300">{item.name}</span><span className="mt-1 block truncate text-[10px] text-zinc-600">{item.sub}</span></span><span className={cn("flex items-center gap-1.5 text-[9px]", item.state === "connected" ? "text-emerald-400" : "text-zinc-600")}><span className={cn("size-1.5 rounded-full", item.state === "connected" ? "bg-emerald-400" : "bg-zinc-700")} />{item.state === "connected" ? "Ready" : "Not connected"}</span></div>)}
                  </div>
                  <button onClick={() => setIntegrationsOpen(true)} className="mx-4 mb-4 flex h-8 w-[calc(100%-2rem)] items-center justify-center gap-1.5 rounded-md border border-white/[0.08] text-[10px] text-zinc-400 transition hover:bg-white/[0.04] hover:text-zinc-200"><Plus className="size-3" />Add integration</button>
                </section>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <section className="rounded-lg border border-white/[0.075] bg-[#101013]"><div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5"><div><h2 className="text-[12px] font-medium text-zinc-200">Uptime overview</h2><p className="mt-1 text-[10px] text-zinc-600">Availability across monitored endpoints</p></div><Activity className="size-4 text-zinc-600" /></div><div className="p-4"><SectionPlaceholder section="Uptime Monitoring" onIntegrations={() => setIntegrationsOpen(true)} /></div></section>
                <section className="rounded-lg border border-white/[0.075] bg-[#101013]"><div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5"><div><h2 className="text-[12px] font-medium text-zinc-200">Recent deployments</h2><p className="mt-1 text-[10px] text-zinc-600">Build and release activity</p></div><ArrowUpRight className="size-4 text-zinc-600" /></div><div className="p-4"><SectionPlaceholder section="Deployments" onIntegrations={() => setIntegrationsOpen(true)} /></div></section>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-600"><span>Data freshness: connected services only</span><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-400" />Neon connected <span className="mx-1 text-zinc-800">·</span> other providers disconnected</span></div>
            </> : <SectionPlaceholder section={activeSection} onIntegrations={() => setIntegrationsOpen(true)} />}
          </div>
        </main>
      </div>

      {commandOpen && <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 px-4 pt-[15vh]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCommandOpen(false) }}><div role="dialog" aria-modal="true" aria-labelledby="command-title" className="w-full max-w-[520px] overflow-hidden rounded-xl border border-white/[0.12] bg-[#111114] shadow-2xl shadow-black/60"><h2 id="command-title" className="sr-only">Quick navigation</h2><div className="flex items-center gap-2.5 border-b border-white/[0.08] px-4"><Search className="size-4 text-zinc-500" /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search pages and actions..." className="h-12 min-w-0 flex-1 bg-transparent text-[12px] text-zinc-200 outline-none placeholder:text-zinc-600" /><kbd className="rounded border border-white/[0.1] px-1.5 py-0.5 font-mono text-[9px] text-zinc-600">ESC</kbd></div><div className="max-h-[340px] overflow-y-auto p-2"><p className="px-2 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Navigation</p>{filteredSections.map(({ label, icon: Icon }) => <button key={label} onClick={() => selectSection(label)} className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[11px] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"><Icon className="size-4 text-zinc-500" />{label}{activeSection === label && <Check className="ml-auto size-3.5 text-violet-300" />}</button>)}</div></div></div>}
      {integrationsOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIntegrationsOpen(false) }}><div role="dialog" aria-modal="true" aria-labelledby="integration-title" className="w-full max-w-[480px] rounded-xl border border-white/[0.1] bg-[#111114] p-5 shadow-2xl shadow-black/60"><div className="flex items-start justify-between"><div><div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300"><LockKeyhole className="size-4" /></div><h2 id="integration-title" className="text-[15px] font-semibold text-zinc-100">Connect your tools</h2><p className="mt-1.5 max-w-[370px] text-[11px] leading-5 text-zinc-500">Provider authorization is not configured yet. Connect GitHub or a deployment service to start syncing real data.</p></div><button onClick={() => setIntegrationsOpen(false)} aria-label="Close" className="rounded-md p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"><X className="size-4" /></button></div><div className="mt-5 flex flex-col gap-2">{[{ name: "GitHub", detail: "Repositories, pull requests, issues", icon: Github }, { name: "Deployment providers", detail: "Vercel, Netlify, Railway, Render", icon: ArrowUpRight }, { name: "Monitoring agent", detail: "Linux host and container metrics", icon: Server }].map(({ name, detail, icon: Icon }) => <div key={name} className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3"><span className="flex size-8 items-center justify-center rounded-md border border-white/[0.07] text-zinc-400"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-[11px] font-medium text-zinc-300">{name}</span><span className="mt-1 block text-[10px] text-zinc-600">{detail}</span></span><span className="rounded-full border border-white/[0.08] px-2 py-1 text-[9px] text-zinc-600">Not connected</span></div>)}</div><p className="mt-4 rounded-md bg-white/[0.025] px-3 py-2.5 text-[10px] leading-4 text-zinc-600">Integrations will remain disconnected until you authorize them. No provider data is being simulated.</p></div></div>}
    </div>
  )
}
