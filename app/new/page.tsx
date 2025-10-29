"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NewListPage() {
  const [vanityUrl, setVanityUrl] = React.useState("")
  const [urlError, setUrlError] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [links, setLinks] = React.useState<string[]>([])
  const [currentLink, setCurrentLink] = React.useState("")

  const validateVanityUrl = (value: string) => {
    if (!value) {
      setUrlError("")
      return false
    }

    // Valid URL slug can include alphanumeric, hyphens, underscores, and paths with /
    const validPattern = /^[a-zA-Z0-9_-]+([\/][a-zA-Z0-9_-]+)*$/
    
    if (!validPattern.test(value)) {
      setUrlError("Invalid URL slug. Use letters, numbers, hyphens, underscores, and forward slashes only.")
      return false
    }

    setUrlError("")
    return true
  }

  const handleVanityUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setVanityUrl(value)
    validateVanityUrl(value)
  }

  const handleAddLink = () => {
    if (currentLink.trim()) {
      setLinks([...links, currentLink.trim()])
      setCurrentLink("")
    }
  }

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleLinkKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddLink()
    }
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-background py-12 px-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Create a new list</h1>
          <p className="text-base text-muted-foreground">
            Group your favorite links and share them with a custom URL
          </p>
        </div>

        <div className="space-y-6">
          {/* Vanity URL Field */}
          <div className="space-y-2">
            <label htmlFor="vanity-url" className="text-sm font-medium">
              Vanity URL
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">urlist.app/</span>
              <input
                id="vanity-url"
                type="text"
                value={vanityUrl}
                onChange={handleVanityUrlChange}
                placeholder="my-awesome-list"
                className={cn(
                  "flex-1 h-10 rounded-md border bg-background px-3 text-sm outline-none transition-all",
                  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
                  urlError ? "border-destructive" : "border-border"
                )}
              />
            </div>
            {urlError && (
              <p className="text-sm text-destructive">{urlError}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A collection of my favorite resources"
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="link-input" className="text-sm font-medium">
                Add links
              </label>
              <p className="text-sm text-muted-foreground">
                Enter a link and press enter or click the add button
              </p>
              <div className="flex gap-2">
                <input
                  id="link-input"
                  type="url"
                  value={currentLink}
                  onChange={(e) => setCurrentLink(e.target.value)}
                  onKeyPress={handleLinkKeyPress}
                  placeholder="https://example.com"
                  className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
                <Button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!currentLink.trim()}
                  className="h-10"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add
                </Button>
              </div>
            </div>

            {/* Display added links */}
            {links.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Links in your list</p>
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3"
                    >
                      <span className="flex-1 truncate text-sm">{link}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveLink(index)}
                        aria-label={`Remove ${link}`}
                      >
                        <X className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={!vanityUrl || !!urlError || links.length === 0}
              className="flex-1"
            >
              Create List
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setVanityUrl("")
                setDescription("")
                setLinks([])
                setCurrentLink("")
                setUrlError("")
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
