"use client";

import { Icon } from "@iconify/react";
import { experiences } from "@/utils/experienceData";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-vintage-navy via-vintage-slate/30 to-vintage-navy" />
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-vintage-burgundy/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-vintage-cream/10 blur-3xl" />
      <div className="section-container relative z-10">
        <Reveal inView y={30} duration={0.6} className="text-center mb-16">
          <span className="badge badge-primary mb-4">Career Journey</span>
          <h2 className="section-title text-vintage-cream mb-4">
            Professional <span className="text-vintage-burgundy/90">Experience</span>
          </h2>
          <p className="section-subtitle">
            A track record of delivering impactful solutions across diverse industries
          </p>
        </Reveal>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-vintage-burgundy/60 via-vintage-cream/40 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <Reveal
                key={exp.title}
                inView
                y={50}
                duration={0.5}
                delay={index * 0.2}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <div
                    className={`relative rounded-2xl p-6 md:p-7 border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_-35px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 ${
                      index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                    } max-w-xl`}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />
                    <div className={`relative flex items-center gap-4 mb-5 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${exp.color} flex items-center justify-center shrink-0 shadow-lg`}>
                        <Icon icon={exp.icon} className="text-2xl text-vintage-cream" />
                      </div>
                      <div className={index % 2 === 0 ? "md:text-right" : ""}>
                        <p className="text-xs uppercase tracking-[0.2em] text-vintage-cream/60">
                          {exp.company}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-vintage-burgundy/90">
                          {exp.title}
                        </h3>
                      </div>
                    </div>

                    <div className={`relative flex flex-wrap items-center gap-3 text-xs text-vintage-cream/70 mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        <Icon icon="solar:calendar-bold-duotone" className="text-vintage-burgundy" />
                        {exp.period}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        <Icon icon="solar:map-point-bold-duotone" className="text-vintage-burgundy" />
                        {exp.location}
                      </span>
                    </div>

                    <p className="relative text-vintage-cream/80 mb-5 leading-relaxed">
                      {exp.description}
                    </p>

                    <ul className={`relative space-y-2.5 mb-5 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm text-vintage-cream/70 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                          <Icon icon="solar:check-circle-bold" className="text-vintage-burgundy mt-0.5 shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`relative flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="badge bg-white/10 border border-white/10 text-vintage-cream/80">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute left-6 md:left-1/2 w-4 h-4 -translate-x-1/2 bg-gradient-to-r from-vintage-burgundy to-vintage-cream rounded-full border-[3px] border-vintage-navy shadow-[0_0_0_6px_rgba(12,12,22,0.4)] z-10" />

                <div className="flex-1 hidden md:block" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
