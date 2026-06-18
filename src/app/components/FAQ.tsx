"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const faqs = [
  {
    q: "Who is Umar Suhail?",
    a: "Umar Suhail is a Lead Frontend Engineer and software developer from India, currently based in Abu Dhabi, UAE. With 7+ years of experience, he builds high-performance web applications using React and Next.js, and currently works at Emirates Face Recognition (EFR) in Abu Dhabi.",
  },
  {
    q: "What does Umar Suhail specialise in?",
    a: "Umar Suhail specialises in React.js, Next.js, TypeScript, and UI/UX design. He is an expert in frontend architecture, design systems, Redux Toolkit, Tailwind CSS, performance optimisation, and accessibility (WCAG). He also designs with Figma and Adobe Creative Suite.",
  },
  {
    q: "Where does Umar Suhail work?",
    a: "Umar Suhail works at Emirates Face Recognition (EFR) in Abu Dhabi, UAE, as an Application Developer. Previously he was Development Team Lead at Epixel Solutions, Software Engineer at Aspire Systems, and UI Developer at Uvionics Tech — all in India.",
  },
  {
    q: "Is Umar Suhail available for freelance or new roles?",
    a: "Yes — Umar Suhail is available for senior frontend engineering roles and select freelance projects. He is open to opportunities in UAE, India, and remote positions. You can reach him at umarsuhail112@gmail.com or via LinkedIn.",
  },
  {
    q: "How can I contact Umar Suhail?",
    a: "You can contact Umar Suhail by email at umarsuhail112@gmail.com, on LinkedIn at linkedin.com/in/umar-suhail, or on WhatsApp at +971 568 323 258. His portfolio is at umar.website.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-20 md:py-28"
      style={{ background: "#EFF2F8" }}
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              background: "rgba(200,168,75,0.09)",
              color: "#8A6A1A",
              border: "1px solid rgba(200,168,75,0.30)",
            }}
          >
            Quick Answers
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ color: "#0F172A" }}
          >
            Frequently Asked{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #C8A84B 0%, #0F172A 100%)",
              }}
            >
              Questions
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#64748B" }}>
            Common questions about Umar Suhail — software developer from India,
            based in Abu Dhabi UAE.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-shadow duration-300"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(15,23,42,0.07)",
                  boxShadow: isOpen
                    ? "0 4px 24px rgba(15,23,42,0.09)"
                    : "0 1px 4px rgba(15,23,42,0.05)",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200"
                  aria-expanded={isOpen}
                  style={{
                    background: isOpen ? "rgba(200,168,75,0.04)" : "transparent",
                  }}
                >
                  <span
                    className="font-semibold text-base leading-snug"
                    style={{ color: "#0F172A" }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: isOpen
                        ? "linear-gradient(135deg, #8A6A1A, #5F4A10)"
                        : "rgba(71,85,105,0.09)",
                      color: isOpen ? "#fff" : "#475569",
                    }}
                  >
                    <Icon icon="solar:add-linear" className="text-sm" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p
                        className="px-6 pb-5 text-sm leading-relaxed"
                        style={{ color: "#334155" }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
