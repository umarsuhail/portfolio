"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import { about_me, resumeUrl } from "../../utils/constants";
import ScrollProgress from "../components/ScrollProgress";
import Reveal from "../components/Reveal";

const hobbies = [
  {
    name: "Cricket",
    icon: "noto-v1:cricket-game",
    description: "Enjoying occasional matches for fun and team bonding",
  },
  {
    name: "Music",
    icon: "noto-v1:musical-score",
    description: "Exploring various genres to fuel creativity and focus",
  },
  {
    name: "Photography",
    icon: "noto-v1:camera-with-flash",
    description: "Capturing moments and planning to pursue it professionally",
  },
];

const values = [
  {
    icon: "solar:lightbulb-bolt-bold-duotone",
    title: "Innovation",
    description: "Always exploring new technologies and pushing boundaries",
  },
  {
    icon: "solar:users-group-rounded-bold-duotone",
    title: "Collaboration",
    description: "Believing in the power of teamwork to achieve greatness",
  },
  {
    icon: "solar:star-bold-duotone",
    title: "Excellence",
    description: "Committed to delivering quality in every project",
  },
  {
    icon: "solar:book-bold-duotone",
    title: "Learning",
    description: "Continuously growing and adapting to stay ahead",
  },
];

const personalDetails = [
  { icon: "solar:user-bold-duotone", label: "Full Name", value: "Umar Suhail" },
  {
    icon: "solar:magnifer-bold-duotone",
    label: "Also Searched As",
    value: "Umer Suhail, Omer Suhail, Umar Sohail",
  },
  {
    icon: "solar:case-round-bold-duotone",
    label: "Role",
    value: "Lead Frontend Engineer",
  },
  {
    icon: "solar:flag-bold-duotone",
    label: "Nationality",
    value: "Indian",
  },
  {
    icon: "solar:chat-square-like-bold-duotone",
    label: "Languages",
    value: "English, Hindi, Urdu, Malayalam, Tamil",
  },
  {
    icon: "solar:calendar-mark-bold-duotone",
    label: "Experience",
    value: "7+ Years",
  },
  {
    icon: "solar:square-academic-cap-bold-duotone",
    label: "Education",
    value: "KMP College of Engineering",
  },
  {
    icon: "solar:letter-bold-duotone",
    label: "Email",
    value: "umarsuhail112@gmail.com",
    href: "mailto:umarsuhail112@gmail.com",
  },
  {
    icon: "solar:phone-calling-rounded-bold-duotone",
    label: "Phone",
    value: "+971 551 912 074 / +971 568 323 258 / +91 949 765 6243",
    href: "tel:+971551912074",
  },
];

const addresses = [
  {
    icon: "solar:buildings-3-bold-duotone",
    tag: "Current",
    title: "Abu Dhabi, UAE",
    lines: ["Lead Frontend Engineer @ Emirates Face Recognition (EFR)", "Abu Dhabi, United Arab Emirates"],
    accent: "from-spidey-red to-spidey-crimson",
  },
  {
    icon: "solar:home-smile-bold-duotone",
    tag: "Hometown",
    title: "Thrissur, Kerala",
    lines: ["Software developer, originally from Thrissur, Kerala", "Open to remote & relocation opportunities"],
    accent: "from-spidey-blue to-indigo-600",
  },
];

const galleryImages = [
  "/api/drive-image?id=1h1OwfyZbLOeKTl_MX_uXaN-egBHh9yfz",
  "/api/drive-image?id=1XsGsobPvZ9XznP9vEg3smCt2dRZtGbMC",
];

function SectionHeading({
  badge,
  children,
}: {
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal inView y={40} amount={0.5} duration={0.6} className="text-center mb-16">
      <span className="badge badge-primary mb-4 border-spidey-red/40 bg-spidey-red/15 text-spidey-silk">
        {badge}
      </span>
      <h2 className="section-title text-spidey-silk">{children}</h2>
    </Reveal>
  );
}

export default function AboutPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const resumeHref =
    resumeUrl ||
    "mailto:umarsuhail112@gmail.com?subject=Request%20for%20Resume";
  const isResumeConfigured = Boolean(resumeUrl);
  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    );
  };
  const showNextImage = () => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % galleryImages.length);
  };

  return (
    <main className="relative pt-20 overflow-hidden text-spidey-silk">
      {/* Spider-Man grunge background + web overlay */}
      <div className="spidey-bg" aria-hidden />
      <div className="spidey-web fixed inset-0 -z-[2] opacity-60" aria-hidden />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* ───────────────── Hero ───────────────── */}
      <section className="section-padding relative">
        {/* decorative hanging spider */}
        <div
          className="spidey-strand pointer-events-none absolute top-0 right-8 w-[60px] h-[220px] hidden md:block"
          aria-hidden
        />
        <div className="section-container">
          <Reveal y={20} className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-spidey-silk/60 hover:text-spidey-red transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" />
              Back to Home
            </Link>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal x={-30} y={0} duration={0.6}>
              <span className="badge mb-4 border-spidey-red/40 bg-spidey-red/15 text-spidey-silk">
                About Me
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 spidey-glow text-spidey-silk">
                Get to Know <span className="spidey-text">Me Better</span>
              </h1>
              <p className="text-spidey-silk/75 leading-relaxed text-lg mb-8">
                {about_me}
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="btn-primary !from-spidey-red !to-spidey-crimson !shadow-spidey-red/30">
                  <Icon icon="solar:chat-round-dots-bold" />
                  Let&apos;s Connect
                </a>
                <a
                  href={resumeHref}
                  target={isResumeConfigured ? "_blank" : undefined}
                  rel={isResumeConfigured ? "noopener noreferrer" : undefined}
                  className="btn-secondary !border-spidey-blue/40"
                >
                  <Icon icon="solar:document-bold" />
                  {isResumeConfigured ? "Download CV" : "Request CV"}
                </a>
              </div>
            </Reveal>

            <Reveal x={30} y={0} delay={0.2} duration={0.6} className="flex justify-center">
              <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-spidey-red/35 bg-black/30 shadow-2xl shadow-black/40">
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={`Umar Suhail photo ${activeImageIndex + 1}`}
                  className="aspect-[4/5] w-full object-cover"
                />
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2.5 text-white transition-colors hover:bg-spidey-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label="Show previous photo"
                  title="Previous photo"
                >
                  <Icon icon="solar:alt-arrow-left-linear" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2.5 text-white transition-colors hover:bg-spidey-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label="Show next photo"
                  title="Next photo"
                >
                  <Icon icon="solar:alt-arrow-right-linear" className="h-5 w-5" />
                </button>
                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
                  {activeImageIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────── Personal Details ───────────────── */}
      <section className="section-padding bg-black/20 backdrop-blur-sm border-y border-spidey-red/15">
        <div className="section-container">
          <SectionHeading badge="Who I Am">
            Personal <span className="spidey-text">Details</span>
          </SectionHeading>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {personalDetails.map((detail, index) => {
              const Inner = (
                <div className="spidey-card rounded-2xl p-5 h-full flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-spidey-red to-spidey-crimson flex items-center justify-center">
                    <Icon icon={detail.icon} className="text-xl text-spidey-silk" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-spidey-silk/50 mb-1">
                      {detail.label}
                    </p>
                    <p className="text-spidey-silk font-medium break-words">
                      {detail.value}
                    </p>
                  </div>
                </div>
              );

              return (
                <Reveal key={detail.label} inView y={40} delay={index * 0.1}>
                  {detail.href ? (
                    <a href={detail.href} className="block h-full">
                      {Inner}
                    </a>
                  ) : (
                    Inner
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── Address / Location ───────────────── */}
      <section className="section-padding">
        <div className="section-container">
          <SectionHeading badge="Where I Am">
            Address & <span className="spidey-text">Location</span>
          </SectionHeading>

          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((addr, index) => (
              <Reveal
                key={addr.title}
                inView
                y={40}
                delay={index * 0.1}
                className="spidey-card rounded-2xl p-7 relative overflow-hidden"
              >
                <div className="spidey-web absolute inset-0 opacity-30" aria-hidden />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${addr.accent} flex items-center justify-center`}
                    >
                      <Icon icon={addr.icon} className="text-2xl text-white" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-spidey-silk/50">
                        {addr.tag}
                      </span>
                      <h3 className="text-2xl font-bold text-spidey-silk">
                        {addr.title}
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {addr.lines.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-spidey-silk/70 text-sm"
                      >
                        <Icon
                          icon="solar:map-point-bold"
                          className="text-spidey-red mt-0.5 shrink-0"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Core Values ───────────────── */}
      <section className="section-padding bg-black/20 backdrop-blur-sm border-y border-spidey-blue/15">
        <div className="section-container">
          <SectionHeading badge="Core Values">
            What <span className="spidey-text">Drives Me</span>
          </SectionHeading>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Reveal
                key={value.title}
                inView
                y={40}
                delay={index * 0.1}
                className="spidey-card rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-spidey-blue to-indigo-700 flex items-center justify-center">
                  <Icon icon={value.icon} className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-spidey-silk mb-2">
                  {value.title}
                </h3>
                <p className="text-spidey-silk/60 text-sm">{value.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Hobbies ───────────────── */}
      <section className="section-padding">
        <div className="section-container">
          <SectionHeading badge="Beyond Work">
            Hobbies & <span className="spidey-text">Interests</span>
          </SectionHeading>

          <div className="grid md:grid-cols-3 gap-6">
            {hobbies.map((hobby, index) => (
              <Reveal
                key={hobby.name}
                inView
                y={40}
                delay={index * 0.1}
                className="spidey-card rounded-2xl overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-spidey-red/30 to-spidey-blue/30 flex items-center justify-center relative">
                  <div className="spidey-web absolute inset-0 opacity-40" aria-hidden />
                  <Icon icon={hobby.icon} className="text-6xl relative" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-spidey-silk mb-2">
                    {hobby.name}
                  </h3>
                  <p className="text-spidey-silk/60 text-sm">
                    {hobby.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="section-padding relative bg-gradient-to-r from-spidey-red/20 via-black/30 to-spidey-blue/20 border-t border-spidey-red/20">
        <div className="spidey-web absolute inset-0 opacity-40" aria-hidden />
        <div className="section-container text-center relative">
          <Reveal inView y={40} amount={0.4} duration={0.6}>
            <h2 className="text-3xl md:text-4xl font-bold text-spidey-silk mb-6 spidey-glow">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-spidey-silk/70 text-lg mb-8 max-w-2xl mx-auto">
              I&apos;m always excited to work on new projects and collaborate
              with innovative teams.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#contact"
                className="btn-primary !from-spidey-red !to-spidey-crimson !shadow-spidey-red/30"
              >
                <Icon icon="solar:chat-round-dots-bold" />
                Start a Conversation
              </Link>
              <Link href="/#projects" className="btn-secondary !border-spidey-blue/40">
                <Icon icon="solar:eye-bold" />
                View My Work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
