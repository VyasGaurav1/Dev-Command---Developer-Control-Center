"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, LoaderCircle, Terminal } from "lucide-react"
import { authClient } from "@/lib/auth-client"

type AuthFormProps = { mode: "sign-in" | "sign-up" }

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const isSignUp = mode === "sign-up"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const name = String(formData.get("name") ?? "").trim()

    try {
      const result = isSignUp
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password })

      if (result.error) {
        setError("We couldn’t complete that request. Check your details and try again.")
        return
      }

      router.replace("/dashboard")
      router.refresh()
    } catch {
      setError("We couldn’t complete that request. Check your connection and try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-12 text-zinc-100">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 text-sm font-semibold tracking-tight text-zinc-100">
          <span className="flex size-8 items-center justify-center rounded-lg bg-violet-500 text-white"><Terminal className="size-4" /></span>
          devcommand<span className="-ml-2 text-violet-400">.</span>
        </Link>
        <section className="rounded-xl border border-white/[0.09] bg-[#101013] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-7">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-violet-300">Developer control center</p>
            <h1 className="text-xl font-semibold tracking-tight">{isSignUp ? "Create your account" : "Welcome back"}</h1>
            <p className="mt-2 text-[12px] leading-5 text-zinc-500">
              {isSignUp ? "Start bringing your development stack into one workspace." : "Sign in to continue to your workspace."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[11px] font-medium text-zinc-300">Full name</label>
                <input id="name" name="name" type="text" autoComplete="name" required maxLength={80} className="h-10 rounded-md border border-white/[0.1] bg-[#09090b] px-3 text-[13px] text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" placeholder="Ada Lovelace" />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[11px] font-medium text-zinc-300">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="h-10 rounded-md border border-white/[0.1] bg-[#09090b] px-3 text-[13px] text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[11px] font-medium text-zinc-300">Password</label>
              <input id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} required minLength={8} maxLength={128} className="h-10 rounded-md border border-white/[0.1] bg-[#09090b] px-3 text-[13px] text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" placeholder="At least 8 characters" />
            </div>
            {error && <p role="alert" className="rounded-md border border-rose-500/20 bg-rose-500/[0.07] px-3 py-2 text-[11px] leading-5 text-rose-300">{error}</p>}
            <button type="submit" disabled={isPending} className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-violet-500 px-4 text-[12px] font-medium text-white transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-60">
              {isPending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
              {isPending ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
              {!isPending && <ArrowRight className="size-3.5" aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-zinc-500">
            {isSignUp ? "Already have an account?" : "New to DevCommand?"}{" "}
            <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-violet-300 hover:text-violet-200 focus-visible:outline-none focus-visible:underline">
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </section>
        <p className="mt-5 text-center text-[10px] text-zinc-600">Your account is protected with encrypted sessions.</p>
      </div>
    </main>
  )
}
