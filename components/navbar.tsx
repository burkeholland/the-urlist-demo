"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Plus, Info, FileText, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/login-dialog";
import { UserMenu } from "@/components/user-menu";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { href: "/new", label: "New", icon: Plus },
  { href: "/about", label: "About", icon: Info },
  { href: "/terms", label: "Terms", icon: FileText },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 max-w-2xl items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-lg font-semibold">The Urlist</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Login Button or User Menu */}
          {loading ? (
            <div className="size-9" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <Button variant="outline" onClick={() => setLoginDialogOpen(true)}>
              <LogIn className="size-4" aria-hidden="true" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="border-t border-border md:hidden"
          role="menu"
        >
          <div className="container mx-auto space-y-1 py-4 max-w-2xl">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
            {loading ? null : user ? (
              <div className="px-3 py-2">
                <UserMenu user={user} />
              </div>
            ) : (
              <button
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground text-left"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginDialogOpen(true);
                }}
              >
                <LogIn className="size-4" aria-hidden="true" />
                Login
              </button>
            )}
          </div>
        </div>
      )}

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </header>
  );
}
