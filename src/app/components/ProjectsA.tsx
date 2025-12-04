'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

// --- Inline UI Components (Replacements for @/components/ui/...) ---

const Badge = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

const Card = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} 
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`flex flex-col space-y-1.5 p-6 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`} 
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`p-6 pt-0 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// --- Main Component ---

const projects = [
  {
    title: "Loyalty Rewards Platform",
    role: "Frontend Developer",
    overview:
      "A scalable loyalty dashboard for tracking user engagement and reward points in real time.",
    contributions: [
      "Developed responsive UI with Next.js, Tailwind, and Redux Toolkit.",
      "Integrated APIs for authentication, transactions, and live updates.",
      "Used Prisma ORM and Zod validation for data integrity."
    ],
    result: [
      "Reduced load time by 30%.",
      "Supported 10K+ active users across multiple subdomains."
    ],
    tech: ["Next.js 14", "TypeScript", "Prisma", "Redux", "Zod", "TailwindCSS"],
    image: "/images/loyalty-dashboard.png",
  },
  {
    title: "AI Chat Assistant",
    role: "Frontend + SDK Integration Engineer",
    overview:
      "Conversational AI dashboard integrated with OpenAI API for automating business queries.",
    contributions: [
      "Integrated ChatGPT-based SDK with custom UI flow.",
      "Built persistent chat sessions and error-handled APIs.",
      "Enhanced UX with Framer Motion animations."
    ],
    result: [
      "Improved chat reliability by 40%.",
      "Deployed for Etisalat and Emirates Space Org clients."
    ],
    tech: ["React 18", "Next.js", "TypeScript", "REST API", "Framer Motion"],
    image: "/images/ai-chat.png",
  },
  {
    title: "GetLife Health Insurance Portal",
    role: "UI/UX Developer",
    overview:
      "Multi-step insurance portal designed for a seamless mobile user experience.",
    contributions: [
      "Built stepwise forms with progress tracking and validation.",
      "Ensured WCAG accessibility and mobile optimization.",
      "Integrated APIs and JWT authentication."
    ],
    result: [
      "User completion rate increased by 22%.",
      "Optimized for Chrome, Safari, and Edge."
    ],
    tech: ["React", "Redux", "Bootstrap", "REST API", "Figma"],
    image: "/images/getlife.png",
  },
  {
    title: "SkySearch.AI",
    role: "Full-Stack Contributor",
    overview:
      "AI-powered platform for intelligent web search, summarization, and insights.",
    contributions: [
      "Developed modular React UI with dynamic data rendering.",
      "Integrated Cohere AI + Mistral 7B models for NLP.",
      "Implemented backend caching with Prisma."
    ],
    result: [
      "Reduced API latency by 25%.",
      "Presented at GITEX Global 2024."
    ],
    tech: ["Next.js 14", "TypeScript", "Prisma", "OpenAI API", "TailwindCSS"],
    image: "/images/skysearch.png",
  },
];

export default function ProjectsA() {
  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white"
        >
          Featured Projects
        </motion.h2>

        <div className="grid gap-10 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {project.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.role}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300">
                    {project.overview}
                  </p>

                  <ul className="list-disc ml-5 text-sm text-gray-600 dark:text-gray-400">
                    {project.contributions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-3">
                      Results:
                    </h4>
                    <ul className="list-disc ml-5 text-sm text-gray-600 dark:text-gray-400">
                      {project.result.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tech.map((tech, i) => (
                      <Badge
                        key={i}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
