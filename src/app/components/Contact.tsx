"use client";

import { useState, FormEvent } from "react";
import { Icon } from "@iconify/react";
import Reveal from "./Reveal";

const contactInfo = [
  {
    icon: "solar:letter-bold-duotone",
    label: "Email",
    value: "umarsuhail112@gmail.com",
    href: "mailto:umarsuhail112@gmail.com",
  },
  {
    icon: "solar:phone-bold-duotone",
    label: "Phone",
    value: "+971 551 912 074 / +971 568 323 258 / +91 949 765 6243",
    href: "tel:+971551912074",
  },
  {
    icon: "solar:map-point-bold-duotone",
    label: "Location",
    value: "United Arab Emirates",
    href: "#",
  },
];

const socialLinks = [
  { icon: "mdi:linkedin", href: "https://www.linkedin.com/in/umar-suhail/", label: "LinkedIn", color: "hover:bg-blue-500/20 hover:border-blue-500/30" },
  { icon: "mdi:github", href: "https://github.com/umarsuhail", label: "GitHub", color: "hover:bg-gray-500/20 hover:border-gray-500/30" },
  { icon: "mdi:whatsapp", href: "https://wa.me/971568323258", label: "WhatsApp", color: "hover:bg-green-500/20 hover:border-green-500/30" },
  { icon: "mdi:instagram", href: "https://instagram.com/umarsuhail", label: "Instagram", color: "hover:bg-pink-500/20 hover:border-pink-500/30" },
];

const directContactOptions = [
  { icon: "solar:letter-bold-duotone", label: "Email", value: "umarsuhail112@gmail.com", href: "mailto:umarsuhail112@gmail.com" },
  { icon: "mdi:whatsapp", label: "WhatsApp UAE 1", value: "+971 551 912 074", href: "https://wa.me/971551912074", external: true },
  { icon: "mdi:whatsapp", label: "WhatsApp UAE 2", value: "+971 568 323 258", href: "https://wa.me/971568323258", external: true },
  { icon: "mdi:linkedin", label: "LinkedIn", value: "Connect", href: "https://www.linkedin.com/in/umar-suhail/", external: true },
  { icon: "mdi:github", label: "GitHub", value: "View work", href: "https://github.com/umarsuhail", external: true },
  { icon: "mdi:instagram", label: "Instagram", value: "Follow", href: "https://instagram.com/umarsuhail", external: true },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-vintage-navy via-vintage-slate/20 to-vintage-navy opacity-50" />
      <div className="section-container relative z-10">
        <Reveal inView y={30} duration={0.6} className="text-center mb-16">
          <span className="badge badge-primary mb-4">Get In Touch</span>
          <h2 className="section-title text-vintage-cream mb-4">
            Let&apos;s Work <span className="gradient-text">Together</span>
          </h2>
          <p className="section-subtitle">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s create something amazing together.
          </p>
        </Reveal>

        <Reveal inView y={24} duration={0.6} className="mb-12">
          <div
            className="relative overflow-hidden rounded-lg border border-cyan-300/40 px-5 py-6 sm:px-8"
            style={{
              background: "linear-gradient(120deg, rgba(6, 18, 38, 0.96), rgba(33, 15, 35, 0.92))",
              boxShadow: "0 0 18px rgba(34, 211, 238, 0.24), 0 0 44px rgba(230, 36, 41, 0.16)",
            }}
          >
            <div className="pointer-events-none absolute -right-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-300/15 blur-3xl" />
            <div className="relative grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-cyan-100">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Direct line</span>
                </div>
                <h3 className="text-2xl font-bold text-vintage-cream sm:text-3xl">Reach me directly</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-vintage-cream/65">
                  Call, message, or connect through the channel that works best for you.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <a
                  href="tel:+971551912074"
                  className="group relative overflow-hidden rounded-lg border border-cyan-300/55 bg-cyan-300/[0.08] p-4 transition hover:-translate-y-0.5 hover:bg-cyan-300/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                  style={{ boxShadow: "inset 0 0 20px rgba(34, 211, 238, 0.08), 0 0 18px rgba(34, 211, 238, 0.18)" }}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-100/80">
                    <Icon icon="solar:phone-calling-bold-duotone" className="text-lg" /> UAE mobile
                  </span>
                  <span className="mt-2 block text-lg font-bold text-cyan-100 sm:text-xl" style={{ textShadow: "0 0 12px rgba(103, 232, 249, 0.82)" }}>
                    +971 551 912 074
                  </span>
                </a>
                <a
                  href="tel:+971568323258"
                  className="group relative overflow-hidden rounded-lg border border-emerald-300/55 bg-emerald-300/[0.08] p-4 transition hover:-translate-y-0.5 hover:bg-emerald-300/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
                  style={{ boxShadow: "inset 0 0 20px rgba(52, 211, 153, 0.08), 0 0 18px rgba(52, 211, 153, 0.18)" }}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-100/80">
                    <Icon icon="solar:phone-calling-bold-duotone" className="text-lg" /> UAE mobile 2
                  </span>
                  <span className="mt-2 block text-lg font-bold text-emerald-100 sm:text-xl" style={{ textShadow: "0 0 12px rgba(110, 231, 183, 0.82)" }}>
                    +971 568 323 258
                  </span>
                </a>
                <a
                  href="tel:+919497656243"
                  className="group relative overflow-hidden rounded-lg border border-rose-300/55 bg-rose-300/[0.08] p-4 transition hover:-translate-y-0.5 hover:bg-rose-300/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200"
                  style={{ boxShadow: "inset 0 0 20px rgba(251, 113, 133, 0.08), 0 0 18px rgba(251, 113, 133, 0.18)" }}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-100/80">
                    <Icon icon="solar:phone-calling-bold-duotone" className="text-lg" /> India mobile
                  </span>
                  <span className="mt-2 block text-lg font-bold text-rose-100 sm:text-xl" style={{ textShadow: "0 0 12px rgba(253, 164, 175, 0.82)" }}>
                    +91 949 765 6243
                  </span>
                </a>
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-5 sm:grid-cols-3 lg:grid-cols-6">
              {directContactOptions.map((option) => (
                <a
                  key={option.label}
                  href={option.href}
                  target={option.external ? "_blank" : undefined}
                  rel={option.external ? "noopener noreferrer" : undefined}
                  className="group flex min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 transition hover:border-white/30 hover:bg-white/[0.09]"
                >
                  <Icon icon={option.icon} className="shrink-0 text-lg text-vintage-burgundy group-hover:text-cyan-200" />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-vintage-cream">{option.label}</span>
                    <span className="block truncate text-xs text-vintage-cream/55">{option.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Reveal inView x={-30} y={0} duration={0.6} className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-vintage-cream mb-4">
                Contact Information
              </h3>
              <p className="text-vintage-cream/60 mb-8">
                Feel free to reach out through any of the following channels. I typically respond within 24 hours.
              </p>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-center gap-4 p-4 rounded-lg vintage-card hover:border-vintage-burgundy/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/70 flex items-center justify-center shrink-0">
                      <Icon icon={info.icon} className="text-2xl text-vintage-cream" />
                    </div>
                    <div>
                      <p className="text-sm text-vintage-cream/50">{info.label}</p>
                      <p className="text-vintage-cream font-medium group-hover:text-vintage-burgundy transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-vintage-cream mb-4">
                Follow Me
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg vintage-card flex items-center justify-center transition-all duration-300 hover:border-vintage-burgundy/40"
                    aria-label={social.label}
                  >
                    <Icon icon={social.icon} className="text-xl text-vintage-cream/70 hover:text-vintage-cream" />
                  </a>
                ))}
              </div>
            </div>

            <div className="vintage-card rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-vintage-burgundy/20 flex items-center justify-center">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vintage-burgundy opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-vintage-burgundy" />
                  </span>
                </div>
                <div>
                  <p className="text-vintage-cream font-semibold">Available for Work</p>
                  <p className="text-vintage-cream/50 text-sm">Open to new opportunities</p>
                </div>
              </div>
              <p className="text-vintage-cream/60 text-sm">
                Currently accepting freelance projects and full-time positions. Let&apos;s discuss how I can contribute to your team!
              </p>
            </div>
          </Reveal>

          <Reveal inView x={30} y={0} duration={0.6}>
            <div className="vintage-card rounded-xl p-8">
              <h3 className="text-2xl font-bold text-vintage-cream mb-6">
                Send a Message
              </h3>

              {submitted ? (
                <Reveal
                  scale={0.9}
                  y={0}
                  duration={0.4}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 rounded-lg bg-vintage-burgundy/20 flex items-center justify-center mb-4">
                    <Icon icon="solar:check-circle-bold" className="text-4xl text-vintage-burgundy" />
                  </div>
                  <h4 className="text-xl font-bold text-vintage-cream mb-2">Message Sent!</h4>
                  <p className="text-vintage-cream/60">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                </Reveal>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-vintage-cream/70 mb-2">
                          Your Name
                        </label>
                        <input
                        type="text"
                        required
                          id="contact-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-field"
                          placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-vintage-cream/70 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        id="contact-email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-vintage-cream/70 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-field"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-vintage-cream/70 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Icon icon="svg-spinners:ring-resize" className="text-xl" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Icon icon="solar:send-bold" className="text-lg" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
