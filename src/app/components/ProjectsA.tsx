"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Icon } from "@iconify/react";
import useIsMobile from "./useIsMobile";

const projects = [
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
      { metric: "10K+", label: "Active Users" },
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
    title: "Emirates Face Recognition Dashboards",
    role: "Application Developer",
    overview:
      "Enterprise dashboards for biometric transactions, system architecture visibility, and operational analysis with an enriched, executive-ready UI.",
    contributions: [
      "Designed transaction monitoring views with real-time status, alerts, and audit trails",
      "Built architecture topology panels to visualize services, data flow, and dependencies",
      "Crafted analytics workbench with trend insights, identity match accuracy, and SLA health",
    ],
    results: [
      { metric: "24/7", label: "Monitoring" },
      { metric: "98%", label: "Match Accuracy" },
      { metric: "5x", label: "Faster Triage" },
    ],
    tech: ["Next.js 14", "TypeScript", "Redux", "TailwindCSS", "Framer Motion"],
    icon: "solar:face-scan-circle-bold-duotone",
    color: "from-vintage-burgundy to-vintage-burgundy/70",
    category: "AI/ML",
    year: "2025",
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

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-vintage-navy via-vintage-slate/20 to-vintage-navy opacity-50" />
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-vintage-burgundy text-vintage-cream"
                  : "bg-vintage-slate/30 text-vintage-cream/60 hover:bg-vintage-slate/50 hover:text-vintage-cream"
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
                className="group"
              >
                <div className="rounded-xl overflow-hidden card-hover h-full flex flex-col p-4 bg-gradient-to-r from-vintage-burgundy to-vintage-burgundy/80 shadow-2xl border border-white/10 backdrop-blur-md">
                
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-white/80 text-sm mb-4 line-clamp-3">
                      {project.overview}
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {project.results.map((result) => (
                        <div
                          key={result.label}
                          className="text-center p-3 rounded-lg bg-white/10"
                        >
                          <p className="text-lg font-bold text-white drop-shadow">
                            {result.metric}
                          </p>
                          <p className="text-xs text-white/70">{result.label}</p>
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
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-vintage-cream/80 mb-2">
                              Key Contributions
                            </h4>
                            <ul className="space-y-2">
                              {project.contributions.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-vintage-cream/60"
                                >
                                  <Icon
                                    icon="solar:check-circle-bold"
                                    className="text-vintage-burgundy mt-0.5 shrink-0"
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                      {project.tech.map((tech) => (
                        <span key={tech} className="badge text-xs">
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
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-vintage-slate/30 hover:bg-vintage-slate/50 text-vintage-cream/70 hover:text-vintage-cream text-sm font-medium transition-all duration-300"
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
