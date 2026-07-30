"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Icon } from "@iconify/react";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: { email: string }) => void;
};

export default function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setMessage("");
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Login failed.");
      }
      setStatus("idle");
      onSuccess(data.user);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Login failed.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative z-10 w-full max-w-md rounded-3xl bg-slate-950/95 border border-white/10 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="login-modal-title" className="text-2xl font-semibold text-vintage-cream">
              Login
            </h2>
            <p className="mt-2 text-sm text-vintage-cream/70">
              Enter your portfolio account details to continue.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login dialog"
            className="rounded-full bg-white/5 p-2 text-vintage-cream transition hover:bg-white/10"
          >
            <Icon icon="solar:close-bold" className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-vintage-cream/70">
            Username or email
            <input
              ref={firstInputRef}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              type="text"
              autoComplete="username"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-vintage-cream focus:border-vintage-burgundy"
              placeholder="Username or email"
            />
          </label>
          <label className="block text-sm text-vintage-cream/70">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-vintage-cream focus:border-vintage-burgundy"
              placeholder="Enter your password"
            />
          </label>

          {message ? (
            <p className="text-sm text-rose-300">{message}</p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3"
            >
              {status === "submitting" ? "Signing in..." : "Sign in"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-vintage-cream transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
