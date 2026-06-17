"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Icon } from "@iconify/react";
import useIsMobile from "./useIsMobile";

const projects = [
  {
    title: "Emirates Face Recognition Dashboards",
    role: "Application Developer",
    overview:
      "Multi-tenant biometric dashboard platform serving 50+ tenants from a single application — each tenant monitors its own deployment with isolated data, while a secure layer authorizes and segregates every tenant's users independently.",
    contributions: [
      "Architected a multi-tenant model serving 50+ tenants from one codebase, eliminating per-tenant app duplication",
      "Built a secure isolation layer that scopes data and authorizes each tenant's users separately, preventing cross-tenant access",
      "Designed transaction monitoring, architecture topology, and analytics views with real-time status, alerts, and SLA health",
    ],
    results: [
      { metric: "50+", label: "Tenants" },
      { metric: "100%", label: "Data Isolation" },
      { metric: "24/7", label: "Monitoring" },
    ],
    tech: ["Next.js 14", "TypeScript", "Redux", "TailwindCSS", "Framer Motion"],
    icon: "solar:face-scan-circle-bold-duotone",
    color: "from-vintage-burgundy to-vintage-burgundy/70",
    category: "AI/ML",
    year: "2025",
  },
  {
    title: "Telecom Onboarding Dashboard",
    role: "Frontend Developer",
    overview:
      "A configurable analytics dashboard for telecom customer onboarding — interactive charts, sortable tables, and multi-dimension filters with a side-by-side comparison view and KPI tracking. Built with a config-driven setup and shipped as a static export deployed on-premise via IIS.",
    contributions: [
      "Built interactive charts, sortable tables, and multi-dimension filters for onboarding analytics",
      "Developed a side-by-side comparison view and KPI cards to track onboarding performance across periods",
      "Implemented a config-driven setup so dashboards, metrics, and filters are defined declaratively",
      "Delivered authentication pages and packaged the app as a static export served on-premise through IIS",
      "Added periodic polling to keep metrics current without manual refresh",
    ],
    results: [
      { metric: "1.1M", label: "Records Compared" },
      { metric: "Config", label: "Driven Dashboards" },
      { metric: "IIS", label: "On-Prem Deploy" },
    ],
    tech: ["Next.js", "TypeScript", "Redux", "TailwindCSS", "IIS"],
    icon: "solar:chart-2-bold-duotone",
    color: "from-vintage-slate to-vintage-navy",
    category: "Web App",
    year: "2025",
  },
  {
    title: "Loyalty Rewards Platform",
    role: "Lead Frontend Developer",
    overview:
      "A scalable loyalty dashboard for tracking user engagement and reward points in real time, serving 10K+ active users.",
    contributions: [
      "Developed responsive UI with Next.js 14 and Redux Toolkit",
      "Implemented real-time data synchronization with WebSocket",
      "Created modular component library reducing development time by 40%",
    ],
    results: [
      { metric: "30%", label: "Faster Load Time" },
      { metric: "100", label: "Active Clients" },
      { metric: "99.9%", label: "Uptime" },
    ],
    tech: ["Next.js 14", "TypeScript", "Prisma", "Redux", "TailwindCSS"],
    icon: "solar:gift-bold-duotone",
    color: "from-vintage-burgundy to-vintage-burgundy/70",
    category: "Web App",
    year: "2024",
  },
  {
    title: "AI Chat Assistant",
    role: "Frontend + SDK Integration",
    overview:
      "Conversational AI dashboard integrated with OpenAI API for automating business queries across enterprise clients.",
    contributions: [
      "Integrated ChatGPT-based SDK with custom conversation flows",
      "Built persistent chat sessions with intelligent context management",
      "Enhanced UX with smooth Framer Motion animations",
    ],
    results: [
      { metric: "40%", label: "Better Reliability" },
      { metric: "2", label: "Enterprise Clients" },
      { metric: "50K+", label: "Daily Queries" },
    ],
    tech: ["React 18", "Next.js", "TypeScript", "OpenAI API", "Framer Motion"],
    icon: "solar:chat-round-dots-bold-duotone",
    color: "from-vintage-slate to-vintage-navy",
    category: "AI/ML",
    year: "2024",
  },
  {
    title: "GetLife Insurance Portal",
    role: "UI/UX Developer",
    overview:
      "Multi-step insurance application portal designed for seamless mobile experience and WCAG accessibility compliance.",
    contributions: [
      "Built stepwise forms with progress tracking and validation",
      "Ensured WCAG 2.1 AA accessibility compliance",
      "Implemented JWT authentication and secure API integration",
    ],
    results: [
      { metric: "22%", label: "Higher Completion" },
      { metric: "100%", label: "Accessible" },
      { metric: "4.8★", label: "User Rating" },
    ],
    tech: ["Gatsby.js", "TypeScript", "Redux", "TailwindCSS", "Figma"],
    icon: "solar:shield-check-bold-duotone",
    color: "from-vintage-gray to-vintage-slate",
    category: "Insurance",
    year: "2023",
  },
  {
    title: "SkySearch.AI",
    role: "Full-Stack Contributor",
    overview:
      "AI-powered platform for intelligent web search, summarization, and insights using advanced NLP models.",
    contributions: [
      "Developed modular React UI with dynamic data rendering",
      "Integrated Cohere AI + Mistral 7B models for NLP",
      "Implemented backend caching reducing API latency by 25%",
    ],
    results: [
      { metric: "25%", label: "Lower Latency" },
      { metric: "GITEX", label: "Global 2024" },
      { metric: "1M+", label: "Searches" },
    ],
    tech: ["Next.js 14", "TypeScript", "Prisma", "OpenAI API", "TailwindCSS"],
    icon: "solar:magnifer-bold-duotone",
    color: "from-vintage-cream/80 to-vintage-gray",
    category: "AI/ML",
    year: "2024",
  },
];

const categories = ["All", ...new Set(projects.map((p) => p.category))];

export default function ProjectsA() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = isMobile || prefersReducedMotion;
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Layered parallax: background drifts up, decorative blobs counter-move.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const blobYSlow = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const blobYFast = useTransform(scrollYProgress, [0, 1], ["25%", "-25%"]);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {!shouldReduceMotion && (
        <>
          <motion.div
            style={{ y: blobYSlow }}
            className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[#C8A84B]/15 blur-3xl"
          />
          <motion.div
            style={{ y: blobYFast }}
            className="pointer-events-none absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-[#475569]/12 blur-3xl"
          />
          <motion.div
            style={{ y: bgY }}
            className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-[#C8A84B]/8 blur-3xl"
          />
        </>
      )}
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-primary mb-4">Portfolio</span>
          <h2 className="section-title text-vintage-cream mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Showcasing impactful solutions that drive business value and user engagement
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ring-1 ${
                activeCategory === category
                  ? "bg-gradient-to-br from-[#C8A84B] to-[#8A6A1A] text-white ring-transparent shadow-md shadow-[#8A6A1A]/25"
                  : "bg-white text-slate-500 ring-slate-900/[0.08] hover:text-[#8A6A1A] hover:ring-[#C8A84B]/40"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div layout={!shouldReduceMotion} className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                layout={!shouldReduceMotion}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                className="group h-full"
                whileHover={shouldReduceMotion ? undefined : { y: -8 }}
              >
                <div className="relative h-full flex flex-col rounded-2xl bg-white overflow-hidden border border-slate-900/[0.07] shadow-[0_1px_3px_rgba(15,23,42,0.06),0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_50px_rgba(15,23,42,0.13)] group-hover:border-[#C8A84B]/45">
                  {/* gold top accent */}
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C8A84B] via-[#E6CE7B] to-[#8A6A1A] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="shrink-0 grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br from-[#C8A84B] to-[#8A6A1A] shadow-md shadow-[#8A6A1A]/25 transition-transform duration-300 group-hover:scale-105">
                          <Icon icon={project.icon} className="text-2xl text-white" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 leading-snug">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-500">{project.role}</p>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center rounded-full bg-[#C8A84B]/12 px-2.5 py-1 text-xs font-semibold text-[#8A6A1A] ring-1 ring-[#C8A84B]/30">
                          {project.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-5 line-clamp-3">
                      {project.overview}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {project.results.map((result) => (
                        <div
                          key={result.label}
                          className="text-center rounded-xl bg-slate-50 border border-slate-900/[0.05] p-3"
                        >
                          <p className="text-lg font-bold text-slate-900">
                            {result.metric}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {result.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <AnimatePresence>
                      {expandedProject === project.title && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mb-5 rounded-xl bg-slate-50 border border-slate-900/[0.05] p-4">
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">
                              Key Contributions
                            </h4>
                            <ul className="space-y-2">
                              {project.contributions.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-slate-600"
                                >
                                  <Icon
                                    icon="solar:check-circle-bold"
                                    className="text-[#8A6A1A] mt-0.5 shrink-0 text-base"
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-2 mb-5 mt-auto">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setExpandedProject(
                          expandedProject === project.title ? null : project.title
                        )
                      }
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-50 ring-1 ring-slate-900/[0.06] text-slate-600 hover:text-[#8A6A1A] hover:bg-[#C8A84B]/10 hover:ring-[#C8A84B]/30 text-sm font-semibold transition-all duration-300"
                    >
                      {expandedProject === project.title ? (
                        <>
                          Show Less
                          <Icon icon="solar:alt-arrow-up-linear" />
                        </>
                      ) : (
                        <>
                          View Details
                          <Icon icon="solar:alt-arrow-down-linear" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/umarsuhail"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Icon icon="mdi:github" className="text-xl" />
            View More on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
