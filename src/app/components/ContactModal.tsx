"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Icon } from "@iconify/react";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  preferredTime: "",
  message: "",
};

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState<{
    state: "idle" | "submitting" | "success" | "error";
    message?: string;
  }>({ state: "idle" });
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setStatus({ state: "idle" });
    setTimeout(() => firstInputRef.current?.focus(), 0);
  }, [open]);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setStatus({ state: "error", message: "Please enter your name and phone number." });
      return;
    }

    setStatus({ state: "submitting", message: "Sending request..." });

    try {
      const response = await fetch("/api/callback-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      setStatus({ state: "success", message: "Callback request submitted! Umar will reach out soon." });
      setForm(initialFormState);
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Unable to submit request." });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-desc"
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="contact-modal-title" className="text-2xl font-semibold text-vintage-cream">
              Let&apos;s talk
            </h2>
            <p id="contact-modal-desc" className="mt-2 text-sm text-vintage-cream/70">
              Choose how you want to connect, or request a callback by filling the form below.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact options"
            className="rounded-full bg-white/5 p-2 text-vintage-cream transition hover:bg-white/10"
          >
            <Icon icon="solar:close-bold" className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href="mailto:umarsuhail112@gmail.com"
            className="rounded-2xl border border-vintage-cream/10 bg-white/5 p-4 text-left transition hover:border-vintage-burgundy/30"
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-sm font-semibold text-vintage-cream">Email</p>
            <p className="mt-2 text-xs text-vintage-cream/60">umarsuhail112@gmail.com</p>
          </a>
          <a
            href="https://wa.me/971551912074"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-vintage-cream/10 bg-white/5 p-4 text-left transition hover:border-green-400/30"
          >
            <p className="text-sm font-semibold text-vintage-cream">WhatsApp</p>
            <p className="mt-2 text-xs text-vintage-cream/60">+971 551 912 074</p>
          </a>
          <a
            href="https://wa.me/971568323258"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-vintage-cream/10 bg-white/5 p-4 text-left transition hover:border-green-400/30"
          >
            <p className="text-sm font-semibold text-vintage-cream">WhatsApp</p>
            <p className="mt-2 text-xs text-vintage-cream/60">+971 568 323 258</p>
          </a>
          <a
            href="tel:+971551912074"
            className="rounded-2xl border border-vintage-cream/10 bg-white/5 p-4 text-left transition hover:border-vintage-burgundy/30"
          >
            <p className="text-sm font-semibold text-vintage-cream">Call</p>
            <p className="mt-2 text-xs text-vintage-cream/60">+971 551 912 074</p>
          </a>
          <a
            href="tel:+971568323258"
            className="rounded-2xl border border-vintage-cream/10 bg-white/5 p-4 text-left transition hover:border-vintage-burgundy/30"
          >
            <p className="text-sm font-semibold text-vintage-cream">Call</p>
            <p className="mt-2 text-xs text-vintage-cream/60">+971 568 323 258</p>
          </a>
          <a
            href="https://www.linkedin.com/in/umar-suhail/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-vintage-cream/10 bg-white/5 p-4 text-left transition hover:border-blue-500/30"
          >
            <p className="text-sm font-semibold text-vintage-cream">LinkedIn</p>
            <p className="mt-2 text-xs text-vintage-cream/60">linkedin.com/in/umar-suhail</p>
          </a>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-vintage-burgundy/20 text-vintage-cream">
              <Icon icon="solar:phone-call-bold" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-vintage-cream">Request a callback</p>
              <p className="text-xs text-vintage-cream/60">Fill the form and Umar will get back to you.</p>
            </div>
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-vintage-cream/70">
                Name
                <input
                  ref={firstInputRef}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                  className="input-field mt-2 w-full bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-vintage-cream focus:border-vintage-burgundy"
                  placeholder="Your name"
                />
              </label>
              <label className="block text-sm text-vintage-cream/70">
                Phone
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  required
                  className="input-field mt-2 w-full bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-vintage-cream focus:border-vintage-burgundy"
                  placeholder="+971 55 191 2074"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-vintage-cream/70">
                Email
                <input
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="input-field mt-2 w-full bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-vintage-cream focus:border-vintage-burgundy"
                  placeholder="Your email"
                />
              </label>
              <label className="block text-sm text-vintage-cream/70">
                Best time to call
                <input
                  value={form.preferredTime}
                  onChange={(event) => updateField("preferredTime", event.target.value)}
                  className="input-field mt-2 w-full bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-vintage-cream focus:border-vintage-burgundy"
                  placeholder="Tomorrow 10-12pm"
                />
              </label>
            </div>

            <label className="block text-sm text-vintage-cream/70">
              Message
              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                rows={4}
                className="input-field mt-2 w-full resize-none bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-vintage-cream focus:border-vintage-burgundy"
                placeholder="Tell me a bit about what you want to discuss"
              />
            </label>

            {status.state !== "idle" && (
              <p className={`text-sm ${status.state === "error" ? "text-rose-300" : "text-emerald-300"}`}>
                {status.message}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status.state === "submitting"}
                className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3"
              >
                {status.state === "submitting" ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="h-5 w-5" />
                    Sending...
                  </>
                ) : (
                  <>
                    Submit callback request
                    <Icon icon="solar:send-bold" className="h-5 w-5" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-vintage-cream transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
