"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onLogin = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const info = await res.json();

      if (!res.ok) {
        throw new Error(info?.error || "Login failed");
      }

      toast.success(`Welcome back, ${info.user?.name || "Clinician"}!`);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-6 top-16 h-40 w-40 rounded-full bg-teal-400/20 blur-3xl float-slow" />
        <div className="absolute right-10 top-32 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl float-fast" />
        <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl float-slow" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="glass-panel panel-edge flex flex-wrap items-center justify-between gap-4 rounded-3xl px-6 py-5 fade-up">
          <div>
            <p className="section-title">Clinic OS</p>
            <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-space)" }}>
              Clinique CMS
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span className="chip rounded-full px-3 py-1">Secure JWT</span>
            <span className="chip rounded-full px-3 py-1">Role aware</span>
          </div>
        </header>

        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-center">
          <section className="flex-1 space-y-6 fade-up delay-1">
            <Badge className="w-fit bg-white/10 text-white">Clinique CMS</Badge>
          <h1
            className="text-balance text-4xl font-semibold leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-space)" }}
          >
            A calm, fast queue experience for modern clinics.
          </h1>
          <p className="max-w-xl text-base text-white/70 md:text-lg">
            Track appointments, organize the daily queue, and close the loop with
            prescriptions and reports. One dashboard per role, all scoped to your
            clinic.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-panel grid-sheen rounded-2xl p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                Smart routing
              </p>
              <p className="mt-3 text-lg">
                Role-based views for admin, doctor, receptionist, and patient.
              </p>
            </div>
            <div className="glass-panel grid-sheen rounded-2xl p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                Instant actions
              </p>
              <p className="mt-3 text-lg">
                Book slots, update queues, and publish care notes without delays.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-white/60">
            <span className="chip rounded-full px-4 py-2">
              Queue status: waiting, in-progress, done, skipped
            </span>
            <span className="chip rounded-full px-4 py-2">
              JWT security with clinic isolation
            </span>
          </div>
          </section>

          <Card className="glass-panel panel-edge grid-sheen w-full max-w-md border-white/10 text-white shadow-2xl fade-up delay-2">
            <CardHeader className="space-y-2">
              <p className="section-title">Secure access</p>
              <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-space)" }}>
                Sign in to your clinic
              </h2>
              <p className="text-sm text-white/60">
                Use the account shared with your clinic. The demo credentials are
                listed below.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="enrollment@darshan.ac.in"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="password123"
                    required
                  />
                </div>
                <Button className="w-full" disabled={busy} type="submit">
                  {busy ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-sm text-white/60">
              <Separator className="bg-white/10" />
              <div className="w-full rounded-xl border border-white/10 px-4 py-3">
                <p className="font-medium text-white/80">Student demo</p>
                <p>Email: enrollment@darshan.ac.in</p>
                <p>Password: password123</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
