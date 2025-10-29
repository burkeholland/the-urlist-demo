"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Plus, Info, FileText, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "New",
    href: "/new",
    icon: Plus,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "Terms",
    href: "/terms",
    icon: FileText,
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <span className="text-lg font-semibold tracking-tight">
              The Urlist
            </span>
          </Link>

          {/* Desktop menu items */}
          <div className="hidden items-center gap-1 md:flex">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Icon className="size-4" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Desktop login button */}
        <div className="hidden md:flex">
          <Link href="/login">
            <Button variant="default" size="sm" className="gap-2">
              <LogIn className="size-4" />
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger menu button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-menu" className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="size-4" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
            <Link href="/login" onClick={closeMenu}>
              <Button
                variant="default"
                className="w-full justify-start gap-2"
              >
                <LogIn className="size-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
