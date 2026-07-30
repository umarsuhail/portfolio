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
    value: "+971 568 323 258",
    href: "tel:+971568323258",
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
                      <label className="block text-sm font-medium text-vintage-cream/70 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-vintage-cream/70 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vintage-cream/70 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-field"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vintage-cream/70 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
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
