import { Suspense } from "react";
import { Navbar } from "@/components/site/navbar";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Create account — Habitat" };

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Suspense>
          <AuthForm mode="sign-up" />
        </Suspense>
      </main>
    </>
  );
}
