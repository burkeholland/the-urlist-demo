"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          // Show email confirmation message
          setShowEmailConfirmation(true);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          // Close dialog on success
          onOpenChange(false);
          // Reset form
          setEmail("");
          setPassword("");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset all state when closing
      setEmail("");
      setPassword("");
      setError("");
      setShowEmailConfirmation(false);
      setIsSignUp(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Sign Up" : "Login"}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Create a new account with your email and password."
              : "Enter your email and password to login to your account."}
          </DialogDescription>
        </DialogHeader>
        
        {showEmailConfirmation ? (
          <div className="space-y-4">
            <div className="rounded-md bg-primary/10 p-4 text-sm">
              <p className="font-semibold mb-2">Check your email</p>
              <p className="text-muted-foreground">
                We've sent a confirmation link to <strong>{email}</strong>. 
                Please check your inbox and click the link to verify your account.
              </p>
            </div>
            <Button 
              onClick={() => handleDialogChange(false)} 
              className="w-full"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? (isSignUp ? "Creating account..." : "Logging in...") 
                : (isSignUp ? "Sign Up" : "Login")}
            </Button>
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
