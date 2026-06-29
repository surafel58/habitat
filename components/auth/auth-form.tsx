"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInSchema, signUpSchema } from "@/lib/validators/auth";

type Mode = "sign-in" | "sign-up";
type FormValues = { name?: string; email: string; password: string };

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const isSignUp = mode === "sign-up";

  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
  });

  const finishSignIn = async (email: string, password: string) => {
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setFormError("Invalid email or password.");
      setPending(false);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    setPending(true);
    try {
      if (isSignUp) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setFormError(data.error ?? "Could not create your account.");
          setPending(false);
          return;
        }
      }
      await finishSignIn(values.email, values.password);
    } catch {
      setFormError("Something went wrong. Please try again.");
      setPending(false);
    }
  };

  const demoLogin = async () => {
    setFormError(null);
    setPending(true);
    await finishSignIn("demo@habitat.app", "demo1234");
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {isSignUp ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {isSignUp
          ? "Save homes, book visits, and ask the AI concierge."
          : "Sign in to your Habitat account."}
      </p>

      {formError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
        >
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        {isSignUp && (
          <Field label="Name" error={errors.name?.message}>
            <input
              type="text"
              autoComplete="name"
              className={fieldClass}
              {...register("name")}
            />
          </Field>
        )}
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className={fieldClass}
            {...register("email")}
          />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className={fieldClass}
            {...register("password")}
          />
        </Field>

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-accent px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={demoLogin}
        disabled={pending}
        className="mt-3 w-full rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-card disabled:opacity-60"
      >
        Try the demo account
      </button>

      <p className="mt-6 text-center text-sm text-muted">
        {isSignUp ? "Already have an account? " : "New to Habitat? "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
