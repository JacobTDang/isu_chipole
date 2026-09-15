"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../../components/Button";
import { useAuth } from "../../state/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, ready, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => { if (ready && user) router.replace("/"); }, [ready, router, user]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!email.trim()) return;
    signIn(email);
    router.replace("/");
  };

  return (
    <div className="flex min-h-full flex-col px-6 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center pt-6 text-center">
        <Image src="/isu-logo.png" alt="Iowa State University" width={240} height={135} priority />
        <h1 className="mt-7 font-display text-[34px] leading-tight font-extrabold tracking-[-0.02em] text-ink">Andrew&apos;s</h1>
        <p className="mt-2 max-w-72 text-[15px] leading-6 text-ink-soft">Meal prep for Cyclones. Pick up on campus.</p>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-ink-soft">ISU email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@iastate.edu" className="min-h-11 w-full rounded-xl border border-line bg-card px-4 text-[17px] text-ink placeholder:text-ink-soft/60" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-ink-soft">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="min-h-11 w-full rounded-xl border border-line bg-card px-4 text-[17px] text-ink placeholder:text-ink-soft/60" />
        </div>
        <Button type="submit" full disabled={!email.trim()}>Sign in</Button>
        <Button type="button" variant="secondary" full disabled={!email.trim()} onClick={() => submit()}>Continue with ISU Net-ID</Button>
      </form>
    </div>
  );
}
