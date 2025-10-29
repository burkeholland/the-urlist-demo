"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const featureHighlights = [
  {
    title: "Organize in minutes",
    description: "Add, reorder, and annotate links without juggling tabs or spreadsheets.",
  },
  {
    title: "Share beautifully",
    description: "Publish polished link playlists that work on every device with a single URL.",
  },
  {
    title: "Collaborate instantly",
    description: "Invite teammates or clients to enrich your list and keep everything in sync.",
  },
];

export default function Home() {
  const router = useRouter();
  const [link, setLink] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedLink = link.trim();

    if (!trimmedLink) {
      setError("Please enter a link to continue.");
      return;
    }

    try {
      new URL(trimmedLink);
      setError("");
      router.push(`/new?link=${encodeURIComponent(trimmedLink)}`);
    } catch {
      setError("That link does not look valid. Try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <section className="flex w-full max-w-2xl flex-col items-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
        The Urlist
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Group links, Save & Share them with the world
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
        Create a list of links and share it with one simple URL.
        </p>
      </div>

      <form className="w-full max-w-md space-y-4 text-left" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold">Get Started</h2>
        <p className="text-sm text-muted-foreground">
        Enter a link and press enter
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="link"
          name="link"
          type="url"
          value={link}
          onChange={(event) => {
            setLink(event.target.value);
            if (error) {
              setError("");
            }
          }}
          onFocus={() => {
            if (error) {
              setError("");
            }
          }}
          placeholder="https://…"
          className="h-12 w-full rounded-md border border-border bg-background px-4 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        />
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full justify-center gap-2 sm:w-auto"
          disabled={!link.trim()}
        >
          Start your list
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </form>
      </section>
    </main>
  );
}
