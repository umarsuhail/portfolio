"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Icon } from "@iconify/react";

const DEFAULT_LOGIN_IDENTIFIER = "umarsuhail112@gmail.com";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: { email: string }) => void;
};

export default function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const [username, setUsername] = useState(DEFAULT_LOGIN_IDENTIFIER);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const identifier = username.trim();
  const isEmail = identifier.includes("@");
  const identifierError = !identifier
    ? "Enter your username or email address."
    : isEmail && !/^\S+@\S+\.\S+$/.test(identifier)
      ? "Enter a valid email address."
      : "";
  const passwordError = !password
    ? "Enter your password."
    : password.length < 8
      ? "Your password must contain at least 8 characters."
      : "";
  const isFormValid = !identifierError && !passwordError;

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setMessage("");
      setShowValidation(false);
      setCapsLockOn(false);
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowValidation(true);
    if (!isFormValid) return;

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

  const updateUsername = (value: string) => {
    setUsername(value);
    if (status === "error") setStatus("idle");
    setMessage("");
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    if (status === "error") setStatus("idle");
    setMessage("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl"
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-spidey-blue via-spidey-red to-spidey-blue"
        />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-spidey-blue/30 bg-spidey-blue/15 text-spidey-silk shadow-[0_0_24px_rgba(43,108,232,0.2)]">
              <Icon icon="solar:shield-keyhole-bold-duotone" className="h-6 w-6" />
            </div>
            <div>
              <h2 id="login-modal-title" className="text-2xl font-semibold text-vintage-cream">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-vintage-cream/65">
                Sign in to your portfolio account.
              </p>
            </div>
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

        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="login-identifier" className="block text-sm font-medium text-vintage-cream/80">
              Username or email
            </label>
            <div className="relative mt-2">
              <Icon icon="solar:user-rounded-bold-duotone" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-spidey-blue" />
              <input
                id="login-identifier"
                ref={firstInputRef}
                value={username}
                onChange={(event) => updateUsername(event.target.value)}
                onBlur={() => setShowValidation(true)}
                required
                type="text"
                autoComplete="username"
                aria-invalid={showValidation && Boolean(identifierError)}
                aria-describedby={showValidation && identifierError ? "login-identifier-error" : undefined}
                className={`w-full rounded-2xl border bg-slate-950/80 py-3 pl-12 pr-10 text-sm text-vintage-cream outline-none transition focus:ring-2 focus:ring-spidey-blue/25 ${
                  showValidation && identifierError
                    ? "border-rose-400/70"
                    : "border-white/10 focus:border-spidey-blue/70"
                }`}
                placeholder="Username or email"
              />
              {!identifierError && identifier && (
                <Icon icon="solar:check-circle-bold" className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-400" />
              )}
            </div>
            {showValidation && identifierError && (
              <p id="login-identifier-error" className="mt-2 text-xs text-rose-300">{identifierError}</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-vintage-cream/80">
              Password
            </label>
            <div className="relative mt-2">
              <Icon icon="solar:lock-keyhole-bold-duotone" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-spidey-red" />
              <input
                id="login-password"
                value={password}
                onChange={(event) => updatePassword(event.target.value)}
                onBlur={() => setShowValidation(true)}
                onKeyUp={(event) => setCapsLockOn(event.getModifierState("CapsLock"))}
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={showValidation && Boolean(passwordError)}
                aria-describedby={showValidation && passwordError ? "login-password-error" : undefined}
                className={`w-full rounded-2xl border bg-slate-950/80 py-3 pl-12 pr-12 text-sm text-vintage-cream outline-none transition focus:ring-2 focus:ring-spidey-red/25 ${
                  showValidation && passwordError
                    ? "border-rose-400/70"
                    : "border-white/10 focus:border-spidey-red/70"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-vintage-cream/60 transition hover:bg-white/10 hover:text-vintage-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spidey-blue"
              >
                <Icon icon={showPassword ? "solar:eye-closed-bold" : "solar:eye-bold"} className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex min-h-4 items-center justify-between gap-3 text-xs">
              {showValidation && passwordError ? (
                <p id="login-password-error" className="text-rose-300">{passwordError}</p>
              ) : (
                <span className="text-vintage-cream/45">Minimum 8 characters</span>
              )}
              {capsLockOn && <span className="shrink-0 text-amber-300">Caps Lock is on</span>}
            </div>
          </div>

          {message ? (
            <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{message}</p>
          ) : null}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "submitting" || !isFormValid}
              className="btn-primary inline-flex min-w-36 items-center justify-center gap-2 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {status === "submitting" ? (
                <>
                  <Icon icon="svg-spinners:ring-resize" className="h-5 w-5" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in securely
                  <Icon icon="solar:arrow-right-bold" className="h-5 w-5" />
                </>
              )}
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
        <p className="mt-5 flex items-center gap-2 text-xs text-vintage-cream/45">
          <Icon icon="solar:shield-check-bold-duotone" className="h-4 w-4 text-spidey-blue" />
          Your session is protected with a secure, HTTP-only cookie.
        </p>
      </div>
    </div>
  );
}
