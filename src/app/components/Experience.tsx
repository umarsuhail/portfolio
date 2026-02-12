"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const experiences = [
  {
    title: "Application Developer",
    company: "Emirates Face Recognition",
    location: "Kerala, India",
    period: "Sep 2024 - Present",
    description: "Building AI-powered face recognition systems and enterprise dashboards for biometric solutions.",
    achievements: [
      "Developing scalable frontend applications using React and Next.js for face recognition platforms",
      "Architecting real-time monitoring dashboards for biometric transaction processing",
      "Implementing modern UI/UX designs with focus on performance and accessibility",
      "Collaborating with AI/ML teams to integrate computer vision features into web applications",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Redux", "TailwindCSS"],
    icon: "solar:face-scan-circle-bold-duotone",
    color: "from-vintage-burgundy to-vintage-burgundy/70",
  },
  {
    title: "Development Team Lead",
    company: "Epixel Solutions",
    location: "Kochi, Kerala",
    period: "Nov 2022 - May 2024",
    description: "Led frontend development team building MLM software solutions and enterprise web applications.",
    achievements: [
      "Led a team of developers delivering high-quality MLM software products",
      "Architected scalable frontend solutions using React and modern JavaScript frameworks",
      "Established coding standards and best practices improving code quality by 40%",
      "Mentored junior developers and conducted code reviews to ensure delivery excellence",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Redux", "Material-UI"],
    icon: "solar:users-group-rounded-bold-duotone",
    color: "from-vintage-slate to-vintage-navy",
  },
  {
    title: "Software Engineer",
    company: "Aspire Systems",
    location: "Kochi, Kerala",
    period: "Nov 2020 - Oct 2022",
    description: "Developed enterprise web applications and customer-facing solutions for global clients.",
    achievements: [
      "Built responsive web applications using React.js serving thousands of users",
      "Implemented state management solutions using Redux for complex application workflows",
      "Collaborated with cross-functional teams to deliver projects on tight deadlines",
      "Integrated RESTful APIs and third-party services into frontend applications",
    ],
    technologies: ["React", "JavaScript", "Redux", "Jenkins", "REST APIs"],
    icon: "solar:code-square-bold-duotone",
    color: "from-vintage-gray to-vintage-slate",
  },
  {
    title: "UI Developer",
    company: "Uvionics Tech India Pvt Ltd",
    location: "Koratty, India",
    period: "Aug 2018 - Nov 2020",
    description: "Started career building user interfaces and interactive web experiences for various clients.",
    achievements: [
      "Developed pixel-perfect UI components from design mockups using HTML, CSS, and JavaScript",
      "Built reusable component libraries improving development efficiency across projects",
      "Implemented responsive designs ensuring cross-browser compatibility",
      "Gained expertise in React.js and modern frontend development practices",
    ],
    technologies: ["React", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
    icon: "solar:palette-bold-duotone",
    color: "from-vintage-cream/80 to-vintage-gray",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-vintage-navy via-vintage-slate/20 to-vintage-navy opacity-50" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-primary mb-4">Career Journey</span>
          <h2 className="section-title text-vintage-cream mb-4">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-subtitle">
            A track record of delivering impactful solutions across diverse industries
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-vintage-burgundy/50 via-vintage-cream/30 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <div
                    className={`vintage-card rounded-xl p-6 card-hover ${
                      index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                    } max-w-xl`}
                  >
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${exp.color} flex items-center justify-center shrink-0 shadow-lg`}>
                        <Icon icon={exp.icon} className="text-2xl text-vintage-cream" />
                      </div>
                      <div className={index % 2 === 0 ? "md:text-right" : ""}>
                        <h3 className="text-xl font-bold text-vintage-cream">{exp.title}</h3>
                        <p className="text-vintage-burgundy font-medium">{exp.company}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-4 text-sm text-vintage-cream/50 mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <span className="flex items-center gap-1">
                        <Icon icon="solar:calendar-bold-duotone" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon icon="solar:map-point-bold-duotone" />
                        {exp.location}
                      </span>
                    </div>

                    <p className="text-vintage-cream/70 mb-4">{exp.description}</p>

                    <ul className={`space-y-2 mb-4 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm text-vintage-cream/60 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                          <Icon icon="solar:check-circle-bold" className="text-vintage-burgundy mt-0.5 shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="badge">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 bg-gradient-to-r from-vintage-burgundy to-vintage-cream rounded-full border-4 border-vintage-navy z-10" />

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
