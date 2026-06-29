import { Suspense } from "react";
import { Navbar } from "@/components/site/navbar";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign in — Habitat" };

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Suspense>
          <AuthForm mode="sign-in" />
        </Suspense>
      </main>
    </>
  );
}
