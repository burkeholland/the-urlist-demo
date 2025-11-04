"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function ConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const supabase = createClient();
        
        // Check if user is now authenticated after email confirmation
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(sessionError.message);
          setStatus("error");
          return;
        }

        if (session) {
          setStatus("success");
        } else {
          // Wait a moment and check again (sometimes confirmation takes a second)
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              setStatus("success");
            } else {
              setStatus("error");
              setError("Email confirmation link may have expired or already been used.");
            }
          }, 1000);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        setStatus("error");
      }
    };

    handleEmailConfirmation();
  }, []);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="w-full max-w-md space-y-8 px-6 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">
              Confirming your email...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we verify your account.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="w-full max-w-md space-y-8 px-6 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-destructive">
              Confirmation Failed
            </h1>
            <p className="text-muted-foreground">
              {error || "We couldn't verify your email address."}
            </p>
            <div className="pt-4">
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md space-y-8 px-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="size-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Email Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your email has been successfully verified. You're now logged in and can start using The Urlist.
          </p>
          <div className="pt-4 space-y-3">
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Home
            </Button>
            <Button onClick={() => router.push("/new")} variant="outline" className="w-full">
              Create Your First List
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
