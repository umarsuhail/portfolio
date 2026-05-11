"use client";

import Image from "next/image";
import Link from "next/link";
import mediaDefaultPhoto from "../../public/images/Media.jpg";
import { ChangeEvent, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import type { jsPDF as JsPdf } from "jspdf";

// ── Types ─────────────────────────────────────────────────────────────────────

type TemplateId = "sidebar" | "professional" | "modern";
type FontId = "roboto" | "lato" | "raleway" | "playfair" | "merriweather" | "montserrat" | "gelasio" | "ramaraja" | "googlesans" | "urbanist" | "gabriela" | "parkinsans";

type ResumeEntry = {
  id: string;
  heading: string;
  subheading: string;
  period: string;
  details: string;
};
type ResumePresetId = "airport-management" | "cabin-crew" | "ground-support";
type ResumeFact = {
  id: string;
  label: string;
  value: string;
};

type FontSizes = {
  overall: number;  // -5 to +5, step 1 (each step ≈ 0.5px)
  name: number;
  heading: number;
  body: number;
  detail: number;
  label: number;
};

type ResumeData = {
  template: TemplateId;
  fontFamily: FontId;
  name: string;
  title: string;
  aboutTitle: string;
  aboutText: string;
  declarationTitle: string;
  declarationText: string;
  skillsText: string;
  languagesText: string;
  certificationsText: string;
  achievementsText: string;
  showAchievements: boolean;
  showExperience: boolean;
  showProjects: boolean;
  showSkills: boolean;
  showLanguages: boolean;
  showContact: boolean;
  showPersonalDetails: boolean;
  showDeclaration: boolean;
  showCertifications: boolean;
  showPhoto: boolean;
  photoTopLeft: boolean;
  photoDataUrl: string;
  fontSizes: FontSizes;
  education: ResumeEntry[];
  experience: ResumeEntry[];
  projects: ResumeEntry[];
  contact: ResumeFact[];
  personalDetails: ResumeFact[];
};

type PdfAction = "idle" | "viewing" | "downloading";
type SaveStatus = "saved" | "unsaved" | "saving";

const RESUME_STORAGE_KEY = "resume-builder-draft-v4";

const RESUME_FONTS: {
  id: FontId;
  name: string;
  label: string;
  cssFamily: string;
  googleParam: string;
  ttfBase: string;
  ttfBold: string;
}[] = [
  {
    id: "roboto",
    name: "Roboto",
    label: "Modern & clean",
    cssFamily: "'Roboto', sans-serif",
    googleParam: "Roboto:wght@400;700",
    ttfBase: "/fonts/roboto-normal.ttf",
    ttfBold: "/fonts/roboto-bold.ttf",
  },
  {
    id: "lato",
    name: "Lato",
    label: "Friendly & professional",
    cssFamily: "'Lato', sans-serif",
    googleParam: "Lato:wght@400;700",
    ttfBase: "/fonts/lato-normal.ttf",
    ttfBold: "/fonts/lato-bold.ttf",
  },
  {
    id: "raleway",
    name: "Raleway",
    label: "Elegant & stylish",
    cssFamily: "'Raleway', sans-serif",
    googleParam: "Raleway:wght@400;700",
    ttfBase: "/fonts/raleway-normal.ttf",
    ttfBold: "/fonts/raleway-bold.ttf",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    label: "Classic & prestigious",
    cssFamily: "'Playfair Display', serif",
    googleParam: "Playfair+Display:wght@400;700",
    ttfBase: "/fonts/playfair-normal.ttf",
    ttfBold: "/fonts/playfair-bold.ttf",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    label: "Readable & trustworthy",
    cssFamily: "'Merriweather', serif",
    googleParam: "Merriweather:wght@400;700",
    ttfBase: "/fonts/merriweather-normal.ttf",
    ttfBold: "/fonts/merriweather-bold.ttf",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    label: "Bold & geometric",
    cssFamily: "'Montserrat', sans-serif",
    googleParam: "Montserrat:wght@400;700",
    ttfBase: "/fonts/Montserrat-Regular.ttf",
    ttfBold: "/fonts/Montserrat-Bold.ttf",
  },
  {
    id: "gelasio",
    name: "Gelasio",
    label: "Warm & editorial",
    cssFamily: "'Gelasio', serif",
    googleParam: "Gelasio:wght@400;700",
    ttfBase: "/fonts/Gelasio-Regular.ttf",
    ttfBold: "/fonts/Gelasio-Bold.ttf",
  },
  {
    id: "ramaraja",
    name: "Ramaraja",
    label: "Traditional & distinct",
    cssFamily: "'Ramaraja', serif",
    googleParam: "Ramaraja",
    ttfBase: "/fonts/Ramaraja-Regular.ttf",
    ttfBold: "/fonts/Ramaraja-Regular.ttf",
  },
  {
    id: "googlesans",
    name: "Google Sans",
    label: "Clean & modern",
    cssFamily: "'Google Sans Flex', 'Google Sans', sans-serif",
    googleParam: "",
    ttfBase: "/fonts/GoogleSansFlex_24pt-Regular.ttf",
    ttfBold: "/fonts/GoogleSansFlex_24pt-Bold.ttf",
  },
  {
    id: "urbanist",
    name: "Urbanist",
    label: "Minimal & geometric",
    cssFamily: "'Urbanist', sans-serif",
    googleParam: "",
    ttfBase: "/fonts/Urbanist-Regular.ttf",
    ttfBold: "/fonts/Urbanist-Black.ttf",
  },
  {
    id: "gabriela",
    name: "Gabriela",
    label: "Elegant serif",
    cssFamily: "'Gabriela', serif",
    googleParam: "",
    ttfBase: "/fonts/Gabriela-Regular.ttf",
    ttfBold: "/fonts/Gabriela-Regular.ttf",
  },
  {
    id: "parkinsans",
    name: "Parkinsans",
    label: "Friendly & rounded",
    cssFamily: "'Parkinsans', sans-serif",
    googleParam: "",
    ttfBase: "/fonts/Parkinsans-Regular.ttf",
    ttfBold: "/fonts/Parkinsans-Bold.ttf",
  },
];

const TEMPLATES: {
  id: TemplateId;
  name: string;
  desc: string;
  ats: boolean;
}[] = [
  {
    id: "sidebar",
    name: "Sidebar Classic",
    desc: "Two-column with photo sidebar",
    ats: false,
  },
  {
    id: "professional",
    name: "ATS Pro",
    desc: "Single-column, ATS optimized",
    ats: true,
  },
  {
    id: "modern",
    name: "Modern Bold",
    desc: "Dark header, two-column body",
    ats: false,
  },
];

const TEMPLATE_BASE_SIZES: Record<
  TemplateId,
  { name: number; titleSub: number; heading: number; body: number; detail: number; label: number }
> = {
  sidebar:      { name: 30, titleSub: 12.5, heading: 12,   body: 13,   detail: 12.5, label: 11   },
  professional: { name: 30, titleSub: 12,   heading: 12,   body: 11.5, detail: 11,   label: 11   },
  modern:       { name: 24, titleSub: 11,   heading: 12,   body: 11.5, detail: 11,   label: 10.5 },
};

const CAREER_PRESETS: {
  id: ResumePresetId;
  name: string;
  shortName: string;
  desc: string;
  recommendedTemplate: TemplateId;
}[] = [
  {
    id: "airport-management",
    name: "Airport Management",
    shortName: "Airport Ops",
    desc: "FAA, AVSEC, cargo, compliance, and terminal operations keywords.",
    recommendedTemplate: "professional",
  },
  {
    id: "cabin-crew",
    name: "Cabin Crew",
    shortName: "Cabin Crew",
    desc: "Passenger safety, service recovery, grooming, and multilingual support.",
    recommendedTemplate: "modern",
  },
  {
    id: "ground-support",
    name: "Ground Staff & Support",
    shortName: "Ground Staff",
    desc: "Check-in, baggage, passenger assistance, and frontline terminal support.",
    recommendedTemplate: "professional",
  },
];

function computeFontSizes(resume: ResumeData) {
  const b = TEMPLATE_BASE_SIZES[resume.template];
  const fs = resume.fontSizes;
  const o = fs.overall * 0.5;
  return {
    name:    `${b.name    + o + fs.name    * 0.5}px`,
    titleSub:`${b.titleSub+ o             }px`,
    heading: `${b.heading + o + fs.heading * 0.5}px`,
    body:    `${b.body    + o + fs.body    * 0.5}px`,
    detail:  `${b.detail  + o + fs.detail  * 0.5}px`,
    label:   `${b.label   + o + fs.label   * 0.5}px`,
  };
}

// ── Initial data ──────────────────────────────────────────────────────────────

const initialResume: ResumeData = {
  template: "sidebar",
  fontFamily: "roboto",
  name: "Shahana V. N",
  title: "Airport Management Professional",
  aboutTitle: "Profile Summary",
  aboutText:
    "Motivated and detail-oriented BBA candidate specialising in Human Resource Management, with a completed IATA-certified Diploma in Airport Management. Strong communication skills with a calm, customer-focused approach and a clear goal to build a career in the aviation industry. Equipped with academic knowledge of passenger handling, terminal workflows, aviation security, and cargo operations — eager to bring these foundations into a professional airport environment.",
  declarationTitle: "Declaration",
  declarationText:
    "I hereby declare that the above information is true and correct to the best of my knowledge and belief.",
  skillsText:
    "Aviation Security (AVSEC) Basics\nAir Cargo Operations Fundamentals\nAirport Operations Awareness\nAmadeus & Sabre GDS\nPassenger Service Basics\nCustomer Communication\nTeam Collaboration\nDocumentation & Reporting\nTime Management\nHR Fundamentals (BBA)",
  languagesText: "English\nMalayalam",
  certificationsText:
    "IATA Certified Airport Professional - Aviation Security & Cargo Operations\nSabre GDS\nAmadeus GDS",
  achievementsText:
    "Completed Amadeus and Sabre GDS training with distinction during airport management studies<br>Participated in airport simulation exercises focused on passenger flow, terminal coordination, and safety response<br>Translated customer-facing experience into aviation-ready strengths such as service recovery, calm communication, and conflict handling",
  showAchievements: true,
  showExperience: true,
  showProjects: false,
  showSkills: true,
  showLanguages: true,
  showContact: true,
  showPersonalDetails: true,
  showDeclaration: true,
  showCertifications: true,
  showPhoto: false,
  photoTopLeft: true,
  photoDataUrl: "",
  fontSizes: { overall: 0, name: 0, heading: 0, body: 0, detail: 0, label: 0 },
  education: [
    {
      id: "education-1",
      heading: "Bachelor of Business Administration (BBA)",
      subheading: "",
      period: "",
      details:
        "University of Calicut\nSpecialization: Human Resource Management\nRelevant Coursework: Organizational Behavior, Labor Laws, and Strategic Management\nApplying HR principles to large-scale workforce environments such as international airports\n2023 - 2026 (Expected)",
    },
    {
      id: "education-2",
      heading: "Diploma in Airport Management",
      subheading: "",
      period: "",
      details:
        "Vision School of Aviation\nIATA Certified\nCore Focus: Aviation Security (AVSEC) and Air Cargo Operations\nTrained in international standards for cargo handling, dangerous goods awareness, and terminal security protocols\n2024 - 2025",
    },
    {
      id: "education-3",
      heading: "Higher Secondary in Commerce",
      subheading: "",
      period: "",
      details: "Kerala State Board\n2021 - 2023",
    },
  ],
  experience: [
    {
      id: "experience-ux-1",
      heading: "UX Contributor — User Journey & Planning",
      subheading: "Generic Ticketing Application · Academic / Personal Project",
      period: "",
      details:
        "Contributed to the planning and definition of end-to-end user journeys for a ticketing application, mapping key flows including registration, event discovery, seat selection, payment, and e-ticket retrieval.\nParticipated in requirements gathering sessions to translate user pain points — such as booking confusion and long queue waits — into structured user stories aligned with the development roadmap.\nCreated low-fidelity wireframes and journey maps for core screens (home, listing, checkout, confirmation), facilitating early-stage design reviews with team members.\nCollaborated on the definition of user personas and edge-case scenarios — including first-time buyers and group bookings — to ensure the flow was accessible and friction-free.\nAssisted in documenting the application's userflow logic for handoff to the development team, ensuring feature specifications matched intended user experience outcomes.\nConducted informal usability walkthroughs with peers to validate flow assumptions, noting friction points that were incorporated into the next planning iteration.",
    },
  ],
  projects: [],
  contact: [
    { id: "contact-1", label: "Phone", value: "8891412426" },
    { id: "contact-2", label: "Email", value: "sshahanavn@gmail.com" },
    { id: "contact-3", label: "LinkedIn", value: "linkedin.com/in/shahana VN" },
    { id: "contact-4", label: "Location", value: "Thrissur, Kerala" },
  ],
  personalDetails: [
    { id: "personal-1", label: "DOB", value: "17/03/2006" },
    { id: "personal-2", label: "Gender", value: "Female" },
    { id: "personal-3", label: "Blood Group", value: "AB+" },
    { id: "personal-4", label: "Nationality", value: "Indian" },
    { id: "personal-5", label: "Passport No", value: "AK117356" },
  ],
};

const cabinCrewPreset: ResumeData = {
  ...initialResume,
  template: "modern",
  title: "Cabin Crew Candidate",
  aboutText:
    "Service-oriented aviation candidate with an IATA-backed foundation in passenger handling, cabin safety awareness, and conflict resolution. Recognized for calm communication, professional presentation, and multilingual passenger support in fast-paced environments. Ready to deliver a safe, welcoming onboard experience while supporting service excellence and regulatory discipline.",
  skillsText:
    "Cabin Safety Awareness (Academic)\nPassenger Service Basics\nEmergency Procedures Awareness\nCustomer Communication\nTeam Collaboration\nGrooming & Presentation\nTime Management\nMultilingual Communication\nConflict Handling Basics\nAmadeus & Sabre GDS",
  certificationsText:
    "IATA Certified Airport Professional - Aviation Security & Cargo Operations\nSabre GDS\nAmadeus GDS",
  achievementsText:
    "Built passenger-facing communication skills through service-oriented environments where calm issue resolution and courtesy were essential<br>Maintained professionalism and service quality during high-volume, time-sensitive interactions<br>Developed aviation-ready awareness of safety, service flow, and customer confidence through airport studies and simulations",
  showExperience: true,
  showProjects: false,
  showPhoto: false,
  education: [...initialResume.education],
  experience: [
    {
      id: "experience-ux-1",
      heading: "UX Contributor — User Journey & Planning",
      subheading: "Generic Ticketing Application · Academic / Personal Project",
      period: "",
      details:
        "Contributed to the planning and definition of end-to-end user journeys for a ticketing application, mapping key flows including registration, event discovery, seat selection, payment, and e-ticket retrieval.\nParticipated in requirements gathering sessions to translate user pain points — such as booking confusion and long queue waits — into structured user stories aligned with the development roadmap.\nCreated low-fidelity wireframes and journey maps for core screens (home, listing, checkout, confirmation), facilitating early-stage design reviews with team members.\nCollaborated on the definition of user personas and edge-case scenarios — including first-time buyers and group bookings — to ensure the flow was accessible and friction-free.\nAssisted in documenting the application's userflow logic for handoff to the development team, ensuring feature specifications matched intended user experience outcomes.\nConducted informal usability walkthroughs with peers to validate flow assumptions, noting friction points that were incorporated into the next planning iteration.",
    },
  ],
  projects: [],
};

const groundSupportPreset: ResumeData = {
  ...initialResume,
  template: "professional",
  title: "Airport Ground Staff & Passenger Support Candidate",
  aboutText:
    "Aspiring airport ground operations professional with an IATA-certified diploma in Airport Management and an ongoing BBA in Human Resource Management. Academic foundation covers check-in procedures, baggage handling awareness, passenger service basics, and terminal operations. Eager to apply classroom knowledge in a hands-on ground support role.",
  skillsText:
    "Check-in & Boarding Procedures (Academic)\nPassenger Service Awareness (Academic)\nBaggage Handling Fundamentals (Academic)\nAirport Operations Basics\nAVSEC Awareness\nAmadeus & Sabre GDS\nCustomer Communication\nDocumentation Accuracy\nTeam Collaboration\nTime Management",
  certificationsText:
    "IATA Certified Airport Professional - Aviation Security & Cargo Operations\nSabre GDS\nAmadeus GDS",
  achievementsText:
    "Completed IATA-certified coursework covering ground operations, passenger handling procedures, and terminal safety protocols<br>Studied check-in and baggage coordination workflows through airport management training and GDS simulation exercises<br>Developed awareness of documentation standards and passenger communication practices through academic coursework",
  showExperience: true,
  showProjects: false,
  showPhoto: false,
  education: [...initialResume.education],
  experience: [
    {
      id: "experience-ux-1",
      heading: "UX Contributor — User Journey & Planning",
      subheading: "Generic Ticketing Application · Academic / Personal Project",
      period: "",
      details:
        "Contributed to the planning and definition of end-to-end user journeys for a ticketing application, mapping key flows including registration, event discovery, seat selection, payment, and e-ticket retrieval.\nParticipated in requirements gathering sessions to translate user pain points — such as booking confusion and long queue waits — into structured user stories aligned with the development roadmap.\nCreated low-fidelity wireframes and journey maps for core screens (home, listing, checkout, confirmation), facilitating early-stage design reviews with team members.\nCollaborated on the definition of user personas and edge-case scenarios — including first-time buyers and group bookings — to ensure the flow was accessible and friction-free.\nAssisted in documenting the application's userflow logic for handoff to the development team, ensuring feature specifications matched intended user experience outcomes.\nConducted informal usability walkthroughs with peers to validate flow assumptions, noting friction points that were incorporated into the next planning iteration.",
    },
  ],
  projects: [],
};

const RESUME_PRESETS: Record<ResumePresetId, ResumeData> = {
  "airport-management": initialResume,
  "cabin-crew": cabinCrewPreset,
  "ground-support": groundSupportPreset,
};

// ── Utilities ─────────────────────────────────────────────────────────────────

function normalizeEntry(entry: unknown): ResumeEntry | null {
  if (!entry || typeof entry !== "object") return null;
  const v = entry as Partial<ResumeEntry>;
  return {
    id: typeof v.id === "string" && v.id ? v.id : createItemId("entry"),
    heading: typeof v.heading === "string" ? v.heading : "",
    subheading: typeof v.subheading === "string" ? v.subheading : "",
    period: typeof v.period === "string" ? v.period : "",
    details: typeof v.details === "string" ? v.details : "",
  };
}

function normalizeFact(fact: unknown, prefix: string): ResumeFact | null {
  if (!fact || typeof fact !== "object") return null;
  const v = fact as Partial<ResumeFact>;
  return {
    id: typeof v.id === "string" && v.id ? v.id : createItemId(prefix),
    label: typeof v.label === "string" ? v.label : "",
    value: typeof v.value === "string" ? v.value : "",
  };
}

function getStoredResume(raw: string): ResumeData | null {
  try {
    const parsed = JSON.parse(raw) as Partial<ResumeData>;
    if (!parsed || typeof parsed !== "object") return null;
    const validFonts: FontId[] = [
      "roboto",
      "lato",
      "raleway",
      "playfair",
      "merriweather",
      "montserrat",
      "gelasio",
      "ramaraja",
      "googlesans",
      "urbanist",
      "gabriela",
      "parkinsans",
    ];
    return {
      ...initialResume,
      ...parsed,
      fontFamily: validFonts.includes(parsed.fontFamily as FontId)
        ? (parsed.fontFamily as FontId)
        : initialResume.fontFamily,
      education: Array.isArray(parsed.education)
        ? parsed.education
            .map(normalizeEntry)
            .filter((e): e is ResumeEntry => Boolean(e))
        : initialResume.education,
      experience: Array.isArray(parsed.experience)
        ? parsed.experience
            .map(normalizeEntry)
            .filter((e): e is ResumeEntry => Boolean(e))
        : initialResume.experience,
      projects: Array.isArray(parsed.projects)
        ? parsed.projects
            .map(normalizeEntry)
            .filter((e): e is ResumeEntry => Boolean(e))
        : initialResume.projects,
      contact: Array.isArray(parsed.contact)
        ? parsed.contact
            .map((f) => normalizeFact(f, "contact"))
            .filter((f): f is ResumeFact => Boolean(f))
        : initialResume.contact,
      personalDetails: Array.isArray(parsed.personalDetails)
        ? parsed.personalDetails
            .map((f) => normalizeFact(f, "personal"))
            .filter((f): f is ResumeFact => Boolean(f))
        : initialResume.personalDetails,
      fontSizes:
        parsed.fontSizes && typeof parsed.fontSizes === "object"
          ? {
              overall: typeof (parsed.fontSizes as FontSizes).overall === "number" ? (parsed.fontSizes as FontSizes).overall : 0,
              name:    typeof (parsed.fontSizes as FontSizes).name    === "number" ? (parsed.fontSizes as FontSizes).name    : 0,
              heading: typeof (parsed.fontSizes as FontSizes).heading === "number" ? (parsed.fontSizes as FontSizes).heading : 0,
              body:    typeof (parsed.fontSizes as FontSizes).body    === "number" ? (parsed.fontSizes as FontSizes).body    : 0,
              detail:  typeof (parsed.fontSizes as FontSizes).detail  === "number" ? (parsed.fontSizes as FontSizes).detail  : 0,
              label:   typeof (parsed.fontSizes as FontSizes).label   === "number" ? (parsed.fontSizes as FontSizes).label   : 0,
            }
          : initialResume.fontSizes,
    };
  } catch {
    return null;
  }
}

function createItemId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneResumeData(resume: ResumeData): ResumeData {
  return {
    ...resume,
    education: resume.education.map((entry) => ({ ...entry })),
    experience: resume.experience.map((entry) => ({ ...entry })),
    projects: resume.projects.map((entry) => ({ ...entry })),
    contact: resume.contact.map((fact) => ({ ...fact })),
    personalDetails: resume.personalDetails.map((fact) => ({ ...fact })),
    fontSizes: { ...resume.fontSizes },
  };
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function splitLinesHtml(value: string): string[] {
  // Split HTML content on <br>, </p>, </div> or plain \n
  if (/<br|<\/p>|<\/div>/i.test(value)) {
    return value
      .replace(/<\/?(p|div)[^>]*>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}

type PreviewSection = {
  key: string;
  estimatedHeight: number;
  content: ReactNode;
};

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateWrappedLines(value: string, charsPerLine: number) {
  const clean = stripHtml(value);
  if (!clean) return 0;
  return Math.max(1, Math.ceil(clean.length / Math.max(charsPerLine, 1)));
}

function estimateBulletsHeight(
  items: string[],
  charsPerLine: number,
  lineHeight: number,
  gap = 1.5,
) {
  return items.reduce((sum, item) => {
    const lines = estimateWrappedLines(item, charsPerLine);
    return sum + lines * lineHeight + gap;
  }, 0);
}

function estimateEntryHeight(
  entry: ResumeEntry,
  charsPerLine: number,
  lineHeight: number,
  headingHeight = 7,
  tailGap = 4,
) {
  const bullets = [
    ...(entry.subheading ? [entry.subheading] : []),
    ...splitLinesHtml(entry.details),
    ...(entry.period ? [entry.period] : []),
  ];
  return (
    headingHeight +
    estimateBulletsHeight(bullets, charsPerLine, lineHeight, 1.2) +
    tailGap
  );
}

function estimateChipRows(items: string[], rowCapacity: number) {
  const total = items.reduce((sum, item) => sum + item.length + 6, 0);
  return Math.max(1, Math.ceil(total / Math.max(rowCapacity, 1)));
}

function paginatePreviewSections(
  sections: PreviewSection[],
  availableHeight: number,
) {
  const pages: PreviewSection[][] = [];
  let currentPage: PreviewSection[] = [];
  let usedHeight = 0;

  sections.forEach((section) => {
    const sectionHeight = Math.min(section.estimatedHeight, availableHeight);
    if (
      currentPage.length > 0 &&
      usedHeight + sectionHeight > availableHeight
    ) {
      pages.push(currentPage);
      currentPage = [section];
      usedHeight = sectionHeight;
      return;
    }
    currentPage.push(section);
    usedHeight += sectionHeight;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [[]];
}

function getVisibleFacts(facts: ResumeFact[]) {
  return facts.filter((f) => f.label.trim() || f.value.trim());
}

function inferImageFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  if (dataUrl.startsWith("data:image/png")) return "PNG";
  if (dataUrl.startsWith("data:image/webp")) return "WEBP";
  return "JPEG";
}

function getImageAspectRatio(dataUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
    img.onerror = () => resolve(0.75);
    img.src = dataUrl;
  });
}

// ── PDF font loading ──────────────────────────────────────────────────────────

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i += 8192) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, Math.min(i + 8192, bytes.byteLength)),
    );
  }
  return btoa(binary);
}

const pdfFontCache = new Map<string, string>();

// Built-in jsPDF fallback for each custom font (used when TTF fetch/parse fails)
const PDF_FONT_FALLBACK: Record<FontId, string> = {
  roboto: "helvetica",
  lato: "helvetica",
  raleway: "helvetica",
  playfair: "times",
  merriweather: "times",
  montserrat: "helvetica",
  gelasio: "times",
  ramaraja: "times",
  googlesans: "helvetica",
  urbanist: "helvetica",
  gabriela: "times",
  parkinsans: "helvetica",
};

async function loadFontIntoDoc(doc: JsPdf, fontId: FontId): Promise<string> {
  const def = RESUME_FONTS.find((f) => f.id === fontId);
  if (!def) return "helvetica";

  const pairs: Array<{ key: string; url: string; style: string }> = [
    { key: `${fontId}-normal`, url: def.ttfBase, style: "normal" },
    { key: `${fontId}-bold`, url: def.ttfBold, style: "bold" },
  ];

  try {
    for (const { key, url, style } of pairs) {
      if (!pdfFontCache.has(key)) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        // Sanity-check: TTF files start with 0x00010000 or 'OTTO'
        if (buf.byteLength < 12) throw new Error("Truncated font");
        pdfFontCache.set(key, arrayBufferToBase64(buf));
      }
      const b64 = pdfFontCache.get(key)!;
      const filename = `${key}.ttf`;
      doc.addFileToVFS(filename, b64);
      doc.addFont(filename, fontId, style);
    }
    return fontId;
  } catch {
    // Evict any partially-cached data so the next attempt retries
    pairs.forEach(({ key }) => pdfFontCache.delete(key));
    return PDF_FONT_FALLBACK[fontId] ?? "helvetica";
  }
}

function addWrappedText(
  doc: JsPdf,
  text: string,
  x: number,
  y: number,
  w: number,
  lh: number,
) {
  const lines = doc.splitTextToSize(text, w) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lh;
}

// ── PDF: Classic (Sidebar) ────────────────────────────────────────────────────

async function createClassicPdfBlob(resume: ResumeData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const fn = await loadFontIntoDoc(doc, resume.fontFamily);

  const leftColEnd = 74;
  const lx = 6;
  const lw = leftColEnd - 12;
  const rx = leftColEnd + 9;
  const rw = 210 - rx - 9;

  doc.setFillColor(245, 245, 242);
  doc.rect(0, 0, leftColEnd, 297, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(leftColEnd, 0, 210 - leftColEnd, 297, "F");
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(leftColEnd, 0, leftColEnd, 297);

  let ly = 10;
  let ry = 22;

  // Photo — natural aspect ratio, moderate size
  if (resume.showPhoto && resume.photoDataUrl) {
    try {
      const ratio = await getImageAspectRatio(resume.photoDataUrl);
      const ph = 58;
      const pw = Math.min(ph * ratio, lw);
      const px = lx + (lw - pw) / 2;
      doc.addImage(
        resume.photoDataUrl,
        inferImageFormat(resume.photoDataUrl),
        px,
        ly,
        pw,
        ph,
      );
      ly += ph + 9;
    } catch {
      /* skip */
    }
  }

  function leftSection(title: string) {
    doc.setFont(fn, "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), lx, ly);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(lx, ly + 1.5, lx + lw, ly + 1.5);
    ly += 7.5;
  }

  const LFT = 10.5;
  const LLH = 6.5; // increased line-height to fill left column

  if (resume.showContact) {
    const vis = getVisibleFacts(resume.contact);
    if (vis.length) {
      leftSection("Contact");
      doc.setFont(fn, "normal");
      doc.setFontSize(LFT);
      doc.setTextColor(40, 40, 40);
      vis.forEach((f) => {
        const ls = doc.splitTextToSize(f.value, lw) as string[];
        doc.text(ls, lx, ly);
        ly += ls.length * LLH + 3;
      });
      ly += 10;
    }
  }
  if (resume.showSkills) {
    const items = splitLines(resume.skillsText);
    if (items.length) {
      leftSection("Skills");
      doc.setFont(fn, "normal");
      doc.setFontSize(LFT);
      doc.setTextColor(40, 40, 40);
      items.forEach((item) => {
        const ls = doc.splitTextToSize(`• ${item}`, lw) as string[];
        doc.text(ls, lx, ly);
        ly += ls.length * LLH + 2.5;
      });
      ly += 10;
    }
  }
  if (resume.showLanguages) {
    const items = splitLines(resume.languagesText);
    if (items.length) {
      leftSection("Language");
      doc.setFont(fn, "normal");
      doc.setFontSize(LFT);
      doc.setTextColor(40, 40, 40);
      items.forEach((item) => {
        const ls = doc.splitTextToSize(`• ${item}`, lw) as string[];
        doc.text(ls, lx, ly);
        ly += ls.length * LLH + 2.5;
      });
      ly += 10;
    }
  }
  if (resume.showPersonalDetails) {
    const vis = getVisibleFacts(resume.personalDetails);
    if (vis.length) {
      leftSection("Personal Details");
      doc.setFont(fn, "normal");
      doc.setFontSize(LFT);
      doc.setTextColor(40, 40, 40);
      vis.forEach((f) => {
        const t = f.label ? `${f.label}: ${f.value}` : f.value;
        const ls = doc.splitTextToSize(t, lw) as string[];
        doc.text(ls, lx, ly);
        ly += ls.length * LLH + 2.5;
      });
    }
  }

  // ── Right column ──────────────────────────────────────────────────────────────
  doc.setFont(fn, "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  const nameLines = doc.splitTextToSize(
    (resume.name || "Your Name").toUpperCase(),
    rw,
  ) as string[];
  doc.text(nameLines, rx, ry);
  ry += nameLines.length * 10;
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.9);
  doc.line(rx, ry + 1, rx + rw, ry + 1);
  ry += 8;

  if (resume.title) {
    doc.setFont(fn, "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(resume.title.toUpperCase(), rx, ry);
    ry += 9;
  }

  const RFT = 11;
  const RLH = 7; // increased line-height to fill right column

  function rightSection(title: string) {
    doc.setFont(fn, "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), rx, ry);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(rx, ry + 1.5, rx + rw, ry + 1.5);
    ry += 9.5;
  }

  if (resume.aboutText.trim()) {
    rightSection(resume.aboutTitle || "Profile Summary");
    doc.setFont(fn, "normal");
    doc.setFontSize(RFT);
    doc.setTextColor(40, 40, 40);
    ry = addWrappedText(doc, resume.aboutText, rx, ry, rw, RLH);
    ry += 9;
  }

  const visEdu = resume.education.filter(
    (e) => e.heading.trim() || e.details.trim(),
  );
  if (visEdu.length) {
    rightSection("Education");
    visEdu.forEach((entry) => {
      doc.setFont(fn, "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const hl = doc.splitTextToSize(
        (entry.heading || "Untitled").toUpperCase(),
        rw,
      ) as string[];
      doc.text(hl, rx, ry);
      ry += hl.length * 6.5;
      const bullets = [
        ...(entry.subheading ? [entry.subheading] : []),
        ...splitLines(entry.details),
        ...(entry.period ? [entry.period] : []),
      ];
      bullets.forEach((line) => {
        doc.setFont(fn, "normal");
        doc.setFontSize(RFT);
        doc.setTextColor(40, 40, 40);
        const bl = doc.splitTextToSize(`• ${line}`, rw - 4) as string[];
        doc.text(bl, rx + 3, ry);
        ry += bl.length * RLH;
      });
      ry += 7;
    });
    ry += 3;
  }

  if (resume.showExperience) {
    const vis = resume.experience.filter((e) => e.heading.trim());
    if (vis.length) {
      rightSection("Experience");
      vis.forEach((entry) => {
        doc.setFont(fn, "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const hl = doc.splitTextToSize(entry.heading, rw) as string[];
        doc.text(hl, rx, ry);
        if (entry.period) {
          doc.setFont(fn, "normal");
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.text(entry.period, rx + rw, ry, { align: "right" });
        }
        ry += hl.length * 6;
        if (entry.subheading) {
          doc.setFont(fn, "normal");
          doc.setFontSize(RFT);
          doc.setTextColor(80, 80, 80);
          ry = addWrappedText(doc, entry.subheading, rx, ry, rw, RLH);
          ry += 1;
        }
        splitLines(entry.details).forEach((line) => {
          doc.setFont(fn, "normal");
          doc.setFontSize(RFT);
          doc.setTextColor(40, 40, 40);
          const bl = doc.splitTextToSize(`• ${line}`, rw - 4) as string[];
          doc.text(bl, rx + 3, ry);
          ry += bl.length * RLH;
        });
        ry += 5;
      });
    }
  }

  if (resume.showCertifications) {
    const items = splitLines(resume.certificationsText);
    if (items.length) {
      rightSection("Certifications");
      doc.setFont(fn, "normal");
      doc.setFontSize(RFT);
      doc.setTextColor(40, 40, 40);
      items.forEach((item) => {
        doc.text(`• ${item}`, rx + 3, ry);
        ry += RLH + 1;
      });
      ry += 5;
    }
  }

  if (resume.showDeclaration && resume.declarationText.trim()) {
    rightSection(resume.declarationTitle || "Declaration");
    doc.setFont(fn, "normal");
    doc.setFontSize(RFT);
    doc.setTextColor(40, 40, 40);
    addWrappedText(doc, resume.declarationText, rx, ry, rw, RLH);
  }

  return doc.output("blob");
}

// ── PDF: Professional (ATS single-column) ────────────────────────────────────

async function createProfessionalPdfBlob(resume: ResumeData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const fn = await loadFontIntoDoc(doc, resume.fontFamily);

  const mx = 16;
  const cw = 210 - mx * 2;
  let y = 14;

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  // Photo in top-right corner
  let nameCw = cw;
  if (resume.showPhoto && resume.photoDataUrl) {
    try {
      const ratio = await getImageAspectRatio(resume.photoDataUrl);
      const ph = 30;
      const pw = Math.min(ph * ratio, 26);
      const px = 210 - mx - pw;
      doc.addImage(
        resume.photoDataUrl,
        inferImageFormat(resume.photoDataUrl),
        px,
        y,
        pw,
        ph,
      );
      nameCw = cw - pw - 6;
    } catch {
      /* skip */
    }
  }

  doc.setFont(fn, "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  const nameLines = doc.splitTextToSize(
    (resume.name || "Your Name").toUpperCase(),
    nameCw,
  ) as string[];
  const nameAlign = nameCw < cw ? "left" : "center";
  const nameX = nameCw < cw ? mx : 105;
  doc.text(nameLines, nameX, y, { align: nameAlign });
  y += nameLines.length * 9;

  if (resume.title) {
    doc.setFont(fn, "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(70, 70, 70);
    doc.text(resume.title.toUpperCase(), nameX, y, {
      align: nameAlign,
      maxWidth: nameCw,
    });
    y += 6;
  }

  const contactItems = getVisibleFacts(resume.contact).map((f) => f.value);
  if (contactItems.length) {
    doc.setFont(fn, "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const cl = doc.splitTextToSize(
      contactItems.join("   |   "),
      nameCw,
    ) as string[];
    doc.text(cl, nameX, y, { align: nameAlign });
    y += cl.length * 4.5 + 1;
  }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.7);
  doc.line(mx, y, 210 - mx, y);
  y += 6;

  function atsSection(title: string): number {
    doc.setFont(fn, "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), mx, y);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.45);
    doc.line(mx, y + 1.5, mx + cw, y + 1.5);
    return y + 6;
  }

  if (resume.aboutText.trim()) {
    y = atsSection(resume.aboutTitle || "Profile Summary");
    doc.setFont(fn, "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    y = addWrappedText(doc, resume.aboutText, mx, y, cw, 5);
    y += 5;
  }

  const visEdu = resume.education.filter(
    (e) => e.heading.trim() || e.details.trim(),
  );
  if (visEdu.length) {
    y = atsSection("Education");
    visEdu.forEach((entry) => {
      doc.setFont(fn, "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(entry.heading.toUpperCase(), mx, y);
      y += 5;
      const bullets = [
        ...(entry.subheading ? [entry.subheading] : []),
        ...splitLines(entry.details),
        ...(entry.period ? [entry.period] : []),
      ];
      bullets.forEach((line) => {
        doc.setFont(fn, "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(40, 40, 40);
        const bl = doc.splitTextToSize(`• ${line}`, cw - 4) as string[];
        doc.text(bl, mx + 3, y);
        y += bl.length * 4.8;
      });
      y += 3;
    });
    y += 1;
  }

  if (resume.showExperience) {
    const vis = resume.experience.filter((e) => e.heading.trim());
    if (vis.length) {
      y = atsSection("Work Experience");
      vis.forEach((entry) => {
        doc.setFont(fn, "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(entry.heading, mx, y);
        if (entry.period) {
          doc.setFont(fn, "normal");
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.text(entry.period, 210 - mx, y, { align: "right" });
        }
        y += 5;
        if (entry.subheading) {
          doc.setFont(fn, "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(80, 80, 80);
          y = addWrappedText(doc, entry.subheading, mx, y, cw, 4.8);
          y += 1;
        }
        splitLines(entry.details).forEach((line) => {
          doc.setFont(fn, "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(40, 40, 40);
          const bl = doc.splitTextToSize(`• ${line}`, cw - 4) as string[];
          doc.text(bl, mx + 3, y);
          y += bl.length * 4.8;
        });
        y += 3;
      });
    }
  }

  if (resume.showSkills) {
    const items = splitLines(resume.skillsText);
    if (items.length) {
      y = atsSection("Skills");
      doc.setFont(fn, "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      const sl = doc.splitTextToSize(items.join("   •   "), cw) as string[];
      doc.text(sl, mx, y);
      y += sl.length * 5 + 4;
    }
  }

  if (resume.showLanguages) {
    const items = splitLines(resume.languagesText);
    if (items.length) {
      y = atsSection("Languages");
      doc.setFont(fn, "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      doc.text(items.join("   •   "), mx, y);
      y += 5 + 4;
    }
  }

  if (resume.showCertifications) {
    const items = splitLines(resume.certificationsText);
    if (items.length) {
      y = atsSection("Certifications");
      doc.setFont(fn, "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      items.forEach((item) => {
        doc.text(`• ${item}`, mx + 3, y);
        y += 5;
      });
      y += 3;
    }
  }

  if (resume.showPersonalDetails) {
    const vis = getVisibleFacts(resume.personalDetails);
    if (vis.length) {
      y = atsSection("Personal Information");
      doc.setFont(fn, "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      vis.forEach((f) => {
        const t = f.label ? `${f.label}: ${f.value}` : f.value;
        doc.text(t, mx, y);
        y += 5;
      });
      y += 2;
    }
  }

  if (resume.showDeclaration && resume.declarationText.trim()) {
    y = atsSection(resume.declarationTitle || "Declaration");
    doc.setFont(fn, "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    addWrappedText(doc, resume.declarationText, mx, y, cw, 5);
  }

  return doc.output("blob");
}

// ── PDF: Modern (dark header + two columns) ───────────────────────────────────

async function createModernPdfBlob(resume: ResumeData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const fn = await loadFontIntoDoc(doc, resume.fontFamily);

  const headerH = 46;
  const lColEnd = 74;
  const lx = 6;
  const lw = lColEnd - 12;
  const rx = lColEnd + 7;
  const rw = 210 - rx - 7;

  // Dark header
  doc.setFillColor(22, 30, 46);
  doc.rect(0, 0, 210, headerH, "F");

  // Left sidebar below header
  doc.setFillColor(240, 242, 245);
  doc.rect(0, headerH, lColEnd, 297 - headerH, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(lColEnd, headerH, 210 - lColEnd, 297 - headerH, "F");
  doc.setDrawColor(210, 215, 220);
  doc.setLineWidth(0.3);
  doc.line(lColEnd, headerH, lColEnd, 297);

  // Photo in header
  let nameX = 10;
  if (resume.showPhoto && resume.photoDataUrl) {
    try {
      const ph = headerH - 10;
      doc.addImage(
        resume.photoDataUrl,
        inferImageFormat(resume.photoDataUrl),
        8,
        5,
        ph * 0.82,
        ph,
      );
      nameX = 8 + ph * 0.82 + 7;
    } catch {
      /* skip */
    }
  }

  doc.setFont(fn, "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  const nl = doc.splitTextToSize(
    (resume.name || "Your Name").toUpperCase(),
    210 - nameX - 8,
  ) as string[];
  doc.text(nl, nameX, 16);

  if (resume.title) {
    doc.setFont(fn, "normal");
    doc.setFontSize(9);
    doc.setTextColor(180, 200, 220);
    doc.text(resume.title.toUpperCase(), nameX, 16 + nl.length * 8 + 1);
  }

  const contactY = resume.title
    ? 16 + nl.length * 8 + 8
    : 16 + nl.length * 8 + 3;
  const cItems = getVisibleFacts(resume.contact).map((f) => f.value);
  if (cItems.length) {
    doc.setFont(fn, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(160, 185, 210);
    const cl = doc.splitTextToSize(
      cItems.join("  ·  "),
      210 - nameX - 8,
    ) as string[];
    doc.text(cl, nameX, contactY);
  }

  let ly = headerH + 8;

  function modernLeftHeading(title: string) {
    doc.setFont(fn, "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(22, 30, 46);
    doc.text(title.toUpperCase(), lx, ly);
    doc.setDrawColor(22, 30, 46);
    doc.setLineWidth(0.45);
    doc.line(lx, ly + 1.5, lx + lw, ly + 1.5);
    ly += 6;
  }

  if (resume.showSkills) {
    const items = splitLines(resume.skillsText);
    if (items.length) {
      modernLeftHeading("Skills");
      doc.setFont(fn, "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      items.forEach((item) => {
        const ls = doc.splitTextToSize(`• ${item}`, lw) as string[];
        doc.text(ls, lx, ly);
        ly += ls.length * 4.5 + 0.6;
      });
      ly += 3;
    }
  }

  if (resume.showLanguages) {
    const items = splitLines(resume.languagesText);
    if (items.length) {
      modernLeftHeading("Language");
      doc.setFont(fn, "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      items.forEach((item) => {
        const ls = doc.splitTextToSize(`• ${item}`, lw) as string[];
        doc.text(ls, lx, ly);
        ly += ls.length * 4.5 + 0.6;
      });
      ly += 3;
    }
  }

  if (resume.showCertifications) {
    const items = splitLines(resume.certificationsText);
    if (items.length) {
      modernLeftHeading("Certifications");
      doc.setFont(fn, "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      items.forEach((item) => {
        const ls = doc.splitTextToSize(`• ${item}`, lw) as string[];
        doc.text(ls, lx, ly);
        ly += ls.length * 4.5 + 0.6;
      });
      ly += 3;
    }
  }

  if (resume.showPersonalDetails) {
    const vis = getVisibleFacts(resume.personalDetails);
    if (vis.length) {
      modernLeftHeading("Personal Details");
      doc.setFont(fn, "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      vis.forEach((f) => {
        const t = f.label ? `${f.label}: ${f.value}` : f.value;
        const ls = doc.splitTextToSize(t, lw) as string[];
        doc.text(ls, lx, ly);
        ly += ls.length * 4.5 + 0.6;
      });
    }
  }

  let ry = headerH + 8;

  function modernRightHeading(title: string) {
    doc.setFont(fn, "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(22, 30, 46);
    doc.text(title.toUpperCase(), rx, ry);
    doc.setDrawColor(22, 30, 46);
    doc.setLineWidth(0.5);
    doc.line(rx, ry + 1.5, rx + rw, ry + 1.5);
    ry += 6.5;
  }

  if (resume.aboutText.trim()) {
    modernRightHeading(resume.aboutTitle || "Profile Summary");
    doc.setFont(fn, "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    ry = addWrappedText(doc, resume.aboutText, rx, ry, rw, 5);
    ry += 5;
  }

  const visEdu = resume.education.filter(
    (e) => e.heading.trim() || e.details.trim(),
  );
  if (visEdu.length) {
    modernRightHeading("Education");
    visEdu.forEach((entry) => {
      doc.setFont(fn, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(22, 30, 46);
      const hl = doc.splitTextToSize(
        entry.heading.toUpperCase(),
        rw,
      ) as string[];
      doc.text(hl, rx, ry);
      ry += hl.length * 5;
      const bullets = [
        ...(entry.subheading ? [entry.subheading] : []),
        ...splitLines(entry.details),
        ...(entry.period ? [entry.period] : []),
      ];
      bullets.forEach((line) => {
        doc.setFont(fn, "normal");
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        const bl = doc.splitTextToSize(`• ${line}`, rw - 3) as string[];
        doc.text(bl, rx + 2, ry);
        ry += bl.length * 4.5;
      });
      ry += 3.5;
    });
  }

  if (resume.showExperience) {
    const vis = resume.experience.filter((e) => e.heading.trim());
    if (vis.length) {
      modernRightHeading("Experience");
      vis.forEach((entry) => {
        doc.setFont(fn, "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(22, 30, 46);
        doc.text(entry.heading, rx, ry);
        if (entry.period) {
          doc.setFont(fn, "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(80, 80, 80);
          doc.text(entry.period, rx + rw, ry, { align: "right" });
        }
        ry += 5;
        if (entry.subheading) {
          doc.setFont(fn, "normal");
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          ry = addWrappedText(doc, entry.subheading, rx, ry, rw, 4.5);
          ry += 1;
        }
        splitLines(entry.details).forEach((line) => {
          doc.setFont(fn, "normal");
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          const bl = doc.splitTextToSize(`• ${line}`, rw - 3) as string[];
          doc.text(bl, rx + 2, ry);
          ry += bl.length * 4.5;
        });
        ry += 3;
      });
    }
  }

  if (resume.showDeclaration && resume.declarationText.trim()) {
    modernRightHeading(resume.declarationTitle || "Declaration");
    doc.setFont(fn, "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    addWrappedText(doc, resume.declarationText, rx, ry, rw, 5);
  }

  return doc.output("blob");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function createResumePdfBlob(resume: ResumeData): Promise<Blob> {
  if (resume.template === "professional")
    return createProfessionalPdfBlob(resume);
  if (resume.template === "modern") return createModernPdfBlob(resume);
  return createClassicPdfBlob(resume);
}

// ── Rich text editor ──────────────────────────────────────────────────────────

type FormatCmd = "bold" | "italic" | "underline" | "strikeThrough";

function RichEditor({
  value,
  onChange,
  placeholder,
  className,
  minHeight = "70px",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<{
    visible: boolean;
    top: number;
    left: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
  }>({ visible: false, top: 0, left: 0, bold: false, italic: false, underline: false, strike: false });
  const savedRange = useRef<Range | null>(null);

  // Sync external value into editor (only when it truly differs to avoid caret reset)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  function refreshToolbar() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setToolbar((t) => ({ ...t, visible: false }));
      return;
    }
    const range = sel.getRangeAt(0);
    const el = editorRef.current;
    if (!el || !el.contains(range.commonAncestorContainer)) {
      setToolbar((t) => ({ ...t, visible: false }));
      return;
    }
    savedRange.current = range.cloneRange();
    const rect = range.getBoundingClientRect();
    const parentRect = el.closest(".rich-editor-wrap")?.getBoundingClientRect() ?? { top: 0, left: 0 };
    setToolbar({
      visible: true,
      top: rect.top - parentRect.top - 40,
      left: Math.max(0, rect.left - parentRect.left),
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strike: document.queryCommandState("strikeThrough"),
    });
  }

  function applyFormat(cmd: FormatCmd) {
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    document.execCommand(cmd, false);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    refreshToolbar();
  }

  function applyFontSize(px: string) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    if (savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = px;
    range.surroundContents(span);
    sel.removeAllRanges();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function applyColor(color: string) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    if (savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    document.execCommand("foreColor", false, color);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  const btnBase =
    "flex h-6 w-6 items-center justify-center rounded text-xs transition-colors hover:bg-white/20";
  const btnActive = "bg-white/30 text-white";
  const btnInactive = "text-white/80";

  return (
    <div className="rich-editor-wrap relative">
      {toolbar.visible && (
        <div
          className="absolute z-50 flex items-center gap-0.5 rounded-lg bg-[#1e293b] px-1.5 py-1 shadow-xl"
          style={{ top: toolbar.top, left: toolbar.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button className={`${btnBase} font-bold ${toolbar.bold ? btnActive : btnInactive}`} onMouseDown={() => applyFormat("bold")}>B</button>
          <button className={`${btnBase} italic ${toolbar.italic ? btnActive : btnInactive}`} onMouseDown={() => applyFormat("italic")}>I</button>
          <button className={`${btnBase} underline ${toolbar.underline ? btnActive : btnInactive}`} onMouseDown={() => applyFormat("underline")}>U</button>
          <button className={`${btnBase} line-through ${toolbar.strike ? btnActive : btnInactive}`} onMouseDown={() => applyFormat("strikeThrough")}>S</button>
          <div className="mx-1 h-4 w-px bg-white/20" />
          {["9px","10px","11px","12px","13px","14px","16px"].map((sz) => (
            <button key={sz} className={`${btnBase} w-auto px-1 text-[10px] ${btnInactive}`} onMouseDown={() => applyFontSize(sz)}>{sz.replace("px","")}</button>
          ))}
          <div className="mx-1 h-4 w-px bg-white/20" />
          {["#000000","#374151","#1e40af","#dc2626","#065f46"].map((c) => (
            <button
              key={c}
              className="h-4 w-4 rounded-full border border-white/30 hover:scale-110 transition-transform"
              style={{ background: c }}
              onMouseDown={() => applyColor(c)}
            />
          ))}
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onMouseUp={refreshToolbar}
        onKeyUp={refreshToolbar}
        onBlur={() => setTimeout(() => setToolbar((t) => ({ ...t, visible: false })), 150)}
        className={`w-full rounded-md border border-vintage-cream/10 bg-vintage-slate/30 px-3 py-2 text-xs text-vintage-cream outline-none focus:border-vintage-cream/30 focus:ring-1 focus:ring-vintage-cream/20 empty:before:text-vintage-cream/30 empty:before:content-[attr(data-placeholder)] ${className ?? ""}`}
        style={{ minHeight, resize: "vertical", overflow: "auto" }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

// ── Preview shared components ─────────────────────────────────────────────────

function ResumeSection({
  title,
  children,
  accent = "slate",
}: {
  title: string;
  children: ReactNode;
  accent?: "slate" | "navy";
}) {
  const headingClass =
    accent === "navy"
      ? "border-b border-b-[#161e2e]/20 border-l-[3px] border-l-[#161e2e] pl-[2.5mm] pb-[2mm] font-black uppercase tracking-[0.14em] text-[#161e2e]"
      : "border-b border-b-slate-200 border-l-[3px] border-l-slate-700 pl-[2.5mm] pb-[2mm] font-black uppercase tracking-[0.14em] text-slate-800";
  return (
    <section
      className="space-y-[3.5mm]"
      style={{ breakInside: "avoid-page", pageBreakInside: "avoid" }}
    >
      <h2 className={headingClass} style={{ fontSize: 'var(--fs-heading)' }}>{title}</h2>
      {children}
    </section>
  );
}

function EntryBlock({
  entry,
  accentHeading = false,
}: {
  entry: ResumeEntry;
  accentHeading?: boolean;
}) {
  const bullets = [
    ...(entry.subheading ? [entry.subheading] : []),
    ...splitLines(entry.details),
    ...(entry.period ? [entry.period] : []),
  ];
  return (
    <article
      className="space-y-[2mm]"
      style={{ breakInside: "avoid-page", pageBreakInside: "avoid" }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-extrabold uppercase tracking-[0.04em] ${accentHeading ? "text-[#161e2e]" : "text-slate-900"}`}
          style={{ fontSize: 'var(--fs-detail)' }}
        >
          {entry.heading || "Untitled item"}
        </h3>
      </div>
      {bullets.length > 0 && (
        <div className="space-y-[2mm]">
          {bullets.map((line, i) => (
            <div key={`${entry.id}-${i}`} className="flex items-start gap-[2.5mm] leading-[1.8] text-slate-700" style={{ fontSize: 'var(--fs-detail)' }}>
              <span className="mt-[3px] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-slate-400" />
              <span dangerouslySetInnerHTML={{ __html: line }} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

// ── Preview: Sidebar Classic ──────────────────────────────────────────────────

function ClassicPreview({ resume }: { resume: ResumeData }) {
  const vc = getVisibleFacts(resume.contact);
  const vp = getVisibleFacts(resume.personalDetails);
  const fontDef = RESUME_FONTS.find((f) => f.id === resume.fontFamily);
  const fontStyle = fontDef ? { fontFamily: fontDef.cssFamily } : {};
  const sz = computeFontSizes(resume);

  const leftSections: PreviewSection[] = [];
  const rightSections: PreviewSection[] = [];

  if (resume.showPhoto && resume.photoDataUrl) {
    leftSections.push({
      key: "photo",
      estimatedHeight: 66,
      content: (
        <div className="flex justify-center">
          <Image
            src={resume.photoDataUrl}
            alt="Profile"
            width={174}
            height={197}
            unoptimized
            className="h-[57mm] w-[46mm] rounded-sm border border-slate-200 object-cover object-top shadow-sm"
          />
        </div>
      ),
    });
  }

  if (resume.showContact && vc.length > 0) {
    leftSections.push({
      key: "contact",
      estimatedHeight:
        12 +
        estimateBulletsHeight(
          vc.map((fact) => fact.value),
          26,
          6,
          2,
        ) +
        4,
      content: (
        <ResumeSection title="Contact">
          <div className="space-y-[3mm]">
            {vc.map((f) => (
              <p
                key={f.id}
                className="break-all leading-[2] text-slate-700"
                style={{ fontSize: 'var(--fs-label)' }}
              >
                {f.value}
              </p>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  const skillItems = splitLines(resume.skillsText);
  if (resume.showSkills && skillItems.length > 0) {
    leftSections.push({
      key: "skills",
      estimatedHeight: 12 + estimateChipRows(skillItems, 28) * 8 + 4,
      content: (
        <ResumeSection title="Skills">
          <div className="flex flex-wrap gap-[2mm]">
            {skillItems.map((item) => (
              <span
                key={item}
                className="inline-block rounded-md bg-slate-100 px-[3mm] leading-[5.5mm] text-slate-700"
                style={{ fontSize: 'var(--fs-label)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  const languageItems = splitLines(resume.languagesText);
  if (resume.showLanguages && languageItems.length > 0) {
    leftSections.push({
      key: "languages",
      estimatedHeight: 12 + estimateChipRows(languageItems, 28) * 8 + 4,
      content: (
        <ResumeSection title="Language">
          <div className="flex flex-wrap gap-[2mm]">
            {languageItems.map((item) => (
              <span
                key={item}
                className="inline-block rounded-md bg-slate-100 px-[3mm] leading-[5.5mm] text-slate-700"
                style={{ fontSize: 'var(--fs-label)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  if (resume.showPersonalDetails && vp.length > 0) {
    leftSections.push({
      key: "personal-details",
      estimatedHeight:
        12 +
        estimateBulletsHeight(
          vp.map((fact) => `${fact.label ? `${fact.label}: ` : ""}${fact.value}`),
          28,
          6.3,
          2,
        ) +
        4,
      content: (
        <ResumeSection title="Personal Details">
          <div className="space-y-[3mm]">
            {vp.map((f) => (
              <p
                key={f.id}
                className="leading-[2] text-slate-700"
                style={{ fontSize: 'var(--fs-label)' }}
              >
                {f.label && (
                  <span className="font-bold text-slate-800">
                    {f.label}:
                  </span>
                )}{" "}
                {f.value}
              </p>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  rightSections.push({
    key: "header",
    estimatedHeight: resume.title ? 30 : 22,
    content: (
      <div className="border-b-2 border-slate-800 pb-[3mm]">
        <h1 className="font-black uppercase leading-none tracking-[0.06em] text-slate-900" style={{ fontSize: 'var(--fs-name)' }}>
          {resume.name || "Your Name"}
        </h1>
        {resume.title && (
          <p className="mt-[2mm] font-semibold uppercase tracking-[0.2em] text-slate-500" style={{ fontSize: 'var(--fs-label)' }}>
            {resume.title}
          </p>
        )}
      </div>
    ),
  });

  if (resume.aboutText.trim()) {
    rightSections.push({
      key: "about",
      estimatedHeight:
        12 + estimateWrappedLines(resume.aboutText, 82) * 6 + 6,
      content: (
        <ResumeSection title={resume.aboutTitle || "Profile Summary"}>
          <p className="text-justify leading-[2] text-slate-700 [&_b]:font-bold [&_i]:italic [&_u]:underline" style={{ fontSize: 'var(--fs-body)' }} dangerouslySetInnerHTML={{ __html: resume.aboutText || "Write a short summary here." }} />
        </ResumeSection>
      ),
    });
  }

  const educationEntries = resume.education.filter(
    (entry) => entry.heading.trim() || entry.details.trim(),
  );
  if (educationEntries.length > 0) {
    rightSections.push({
      key: "education",
      estimatedHeight:
        12 +
        educationEntries.reduce(
          (sum, entry) => sum + estimateEntryHeight(entry, 74, 5.8, 7, 4),
          0,
        ) +
        4,
      content: (
        <ResumeSection title="Education">
          <div className="space-y-[5mm]">
            {resume.education.map((e) => (
              <div key={e.id} className="border-l-2 border-slate-200 pl-[3mm]">
                <EntryBlock entry={e} />
              </div>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  if (resume.showExperience && resume.experience.length > 0) {
    rightSections.push({
      key: "experience",
      estimatedHeight:
        12 +
        resume.experience.reduce(
          (sum, entry) => sum + estimateEntryHeight(entry, 74, 5.8, 7, 4),
          0,
        ) +
        4,
      content: (
        <ResumeSection title="Experience">
          <div className="space-y-[5mm]">
            {resume.experience.map((e) => (
              <div key={e.id} className="border-l-2 border-slate-200 pl-[3mm]">
                <EntryBlock entry={e} />
              </div>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  if (resume.showProjects && resume.projects.length > 0) {
    rightSections.push({
      key: "projects",
      estimatedHeight:
        12 +
        resume.projects.reduce(
          (sum, entry) => sum + estimateEntryHeight(entry, 74, 5.8, 7, 4),
          0,
        ) +
        4,
      content: (
        <ResumeSection title="Projects">
          <div className="space-y-[5mm]">
            {resume.projects.map((e) => (
              <div key={e.id} className="border-l-2 border-slate-200 pl-[3mm]">
                <EntryBlock entry={e} />
              </div>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  const certificationItems = splitLines(resume.certificationsText);
  if (resume.showCertifications && certificationItems.length > 0) {
    rightSections.push({
      key: "certifications",
      estimatedHeight:
        12 + estimateChipRows(certificationItems, 68) * 8 + 4,
      content: (
        <ResumeSection title="Certifications">
          <div className="flex flex-wrap gap-[2mm]">
            {certificationItems.map((item) => (
              <span
                key={item}
                className="inline-block rounded-md bg-slate-100 px-[3mm] leading-[5.5mm] text-slate-700"
                style={{ fontSize: 'var(--fs-label)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  const achievementItems = splitLinesHtml(resume.achievementsText);
  if (resume.showAchievements && achievementItems.length > 0) {
    rightSections.push({
      key: "achievements",
      estimatedHeight:
        12 + estimateBulletsHeight(achievementItems, 78, 5.8, 1.5) + 4,
      content: (
        <ResumeSection title="Achievements">
          <div className="space-y-[2mm]">
            {achievementItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-[2.5mm] leading-[1.8] text-slate-700"
                style={{ fontSize: 'var(--fs-detail)' }}
              >
                <span className="mt-[3px] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-slate-400" />
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            ))}
          </div>
        </ResumeSection>
      ),
    });
  }

  if (resume.showDeclaration) {
    rightSections.push({
      key: "declaration",
      estimatedHeight:
        12 + estimateWrappedLines(resume.declarationText || "", 82) * 5.8 + 4,
      content: (
        <ResumeSection title={resume.declarationTitle || "Declaration"}>
          <p className="text-justify leading-[1.75] text-slate-700 [&_b]:font-bold [&_i]:italic [&_u]:underline" style={{ fontSize: 'var(--fs-body)' }} dangerouslySetInnerHTML={{ __html: resume.declarationText || "Declaration text goes here." }} />
        </ResumeSection>
      ),
    });
  }

  const leftPages = paginatePreviewSections(leftSections, 279);
  const rightPages = paginatePreviewSections(rightSections, 271);
  const totalPages = Math.max(leftPages.length, rightPages.length, 1);

  return (
    <div
      style={{ ...fontStyle, '--fs-name': sz.name, '--fs-heading': sz.heading, '--fs-body': sz.body, '--fs-detail': sz.detail, '--fs-label': sz.label } as unknown as React.CSSProperties}
      className="resume-preview-stack mx-auto flex w-[210mm] min-w-[210mm] flex-col gap-[10mm]"
    >
      {Array.from({ length: totalPages }, (_, pageIndex) => (
        <div
          key={`classic-page-${pageIndex}`}
          className="resume-preview-page min-h-[297mm] w-[210mm] overflow-hidden bg-white text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
        >
          <div className="flex min-h-[297mm] items-stretch">
            <div className="flex w-[74mm] shrink-0 flex-col gap-[8mm] border-r border-slate-200 bg-slate-50 px-[5.5mm] py-[9mm]">
              {(leftPages[pageIndex] ?? []).map((section) => (
                <div key={section.key}>{section.content}</div>
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-[7mm] min-w-0 px-[9mm] pt-[18mm] pb-[8mm]">
              {(rightPages[pageIndex] ?? []).map((section) => (
                <div key={section.key}>{section.content}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Preview: Professional (ATS) ───────────────────────────────────────────────

function ProfessionalPreview({ resume }: { resume: ResumeData }) {
  const vc = getVisibleFacts(resume.contact);
  const fontDef = RESUME_FONTS.find((f) => f.id === resume.fontFamily);
  const fontStyle = fontDef ? { fontFamily: fontDef.cssFamily } : {};
  const sz = computeFontSizes(resume);
  const showPhoto = resume.showPhoto && resume.photoDataUrl;
  const rootRef = useRef<HTMLDivElement>(null);

  // Push sections that land inside a new page's top margin zone down to the correct inset
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pageH = 297 * (96 / 25.4);
    const padT = 12 * (96 / 25.4);
    const sects = Array.from(root.querySelectorAll<HTMLElement>("section"));
    sects.forEach((s) => { s.style.marginTop = ""; });
    for (let pass = 0; pass < 8; pass++) {
      let hit = false;
      const rootTop = root.getBoundingClientRect().top;
      sects.forEach((s) => {
        const t = s.getBoundingClientRect().top - rootTop;
        const pg = Math.floor(t / pageH);
        if (pg === 0) return;
        const pos = t - pg * pageH;
        if (pos < padT) {
          s.style.marginTop = `${(parseFloat(s.style.marginTop) || 0) + (padT - pos)}px`;
          hit = true;
        }
      });
      if (!hit) break;
    }
  }, [resume]);

  function AtsSection({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) {
    return (
      <section
        className="space-y-[3.5mm]"
        style={{ breakInside: "avoid-page", pageBreakInside: "avoid" }}
      >
        <h2 className="border-b border-b-slate-300 border-l-[3px] border-l-slate-700 pb-[1.5mm] pl-[2.5mm] font-black uppercase tracking-[0.16em] text-slate-900" style={{ fontSize: 'var(--fs-heading)' }}>
          {title}
        </h2>
        {children}
      </section>
    );
  }

  return (
    <div
      style={{ ...fontStyle, '--fs-name': sz.name, '--fs-heading': sz.heading, '--fs-body': sz.body, '--fs-detail': sz.detail, '--fs-label': sz.label } as unknown as React.CSSProperties}
      ref={rootRef}
      className="relative mx-auto flex min-h-[297mm] w-[210mm] min-w-[210mm] flex-col bg-white px-[15mm] py-[12mm] text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-[6mm] shrink-0">
        {showPhoto ? (
          <div className="flex items-center gap-[6mm]">
            <div className="flex-1 text-left">
              <h1 className="font-black uppercase tracking-[0.08em] text-slate-900 leading-none" style={{ fontSize: 'var(--fs-name)' }}>
                {resume.name || "Your Name"}
              </h1>
              {resume.title && (
                <p className="mt-[2mm] font-semibold uppercase tracking-[0.25em] text-slate-500" style={{ fontSize: 'var(--fs-label)' }}>
                  {resume.title}
                </p>
              )}
              {vc.length > 0 && (
                <p className="mt-[3mm] text-slate-500" style={{ fontSize: 'var(--fs-label)' }}>
                  {vc.map((f) => f.value).join("   •   ")}
                </p>
              )}
            </div>
            <Image
              src={resume.photoDataUrl}
              alt="Profile"
              width={110}
              height={120}
              unoptimized
              className="h-[30mm] w-[26mm] shrink-0 rounded-sm border border-slate-200 object-cover object-top shadow-sm"
            />
          </div>
        ) : (
          <div className="text-center">
            <h1 className="font-black uppercase tracking-[0.08em] text-slate-900 leading-none" style={{ fontSize: 'var(--fs-name)' }}>
              {resume.name || "Your Name"}
            </h1>
            {resume.title && (
              <p className="mt-[2mm] font-semibold uppercase tracking-[0.25em] text-slate-500" style={{ fontSize: 'var(--fs-label)' }}>
                {resume.title}
              </p>
            )}
            {vc.length > 0 && (
              <p className="mt-[3mm] text-slate-500" style={{ fontSize: 'var(--fs-label)' }}>
                {vc.map((f) => f.value).join("   •   ")}
              </p>
            )}
          </div>
        )}
        <div className="mx-auto mt-[3mm] h-[2px] bg-slate-900" />
      </div>

      <div className="flex flex-1 flex-col gap-[6mm]">
        {resume.aboutText && (
          <AtsSection title={resume.aboutTitle || "Profile Summary"}>
            <p className="text-justify leading-[1.75] text-slate-700 [&_b]:font-bold [&_i]:italic [&_u]:underline" style={{ fontSize: 'var(--fs-body)' }} dangerouslySetInnerHTML={{ __html: resume.aboutText }} />
          </AtsSection>
        )}

        {resume.education.length > 0 && (
          <AtsSection title="Education">
            <div className="space-y-[3.5mm]">
              {resume.education.map((entry) => {
                const bullets = [
                  ...(entry.subheading ? [entry.subheading] : []),
                  ...splitLines(entry.details),
                  ...(entry.period ? [entry.period] : []),
                ];
                return (
                  <article key={entry.id} className="space-y-[1.5mm] border-l-2 border-slate-200 pl-[3mm]">
                    <h3 className="font-extrabold uppercase tracking-[0.04em] text-slate-900" style={{ fontSize: 'var(--fs-detail)' }}>
                      {entry.heading}
                    </h3>
                    {bullets.length > 0 && (
                      <div className="space-y-[1mm]">
                        {bullets.map((l, i) => (
                          <div key={i} className="flex items-start gap-[2mm] leading-[1.65] text-slate-700" style={{ fontSize: 'var(--fs-detail)' }}>
                            <span className="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400" />
                            <span dangerouslySetInnerHTML={{ __html: l }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </AtsSection>
        )}

        {resume.showExperience && resume.experience.length > 0 && (
          <AtsSection title="Work Experience">
            <div className="space-y-[3.5mm]">
              {resume.experience.map((entry) => (
                <article key={entry.id} className="space-y-[1.5mm] border-l-2 border-slate-200 pl-[3mm]">
                  <div className="flex items-start justify-between">
                    <h3 className="font-extrabold text-slate-900" style={{ fontSize: 'var(--fs-detail)' }}>
                      {entry.heading}
                    </h3>
                    {entry.period && (
                      <span className="shrink-0 text-slate-500" style={{ fontSize: 'var(--fs-label)' }}>
                        {entry.period}
                      </span>
                    )}
                  </div>
                  {entry.subheading && (
                    <p className="italic text-slate-500" style={{ fontSize: 'var(--fs-label)' }}>
                      {entry.subheading}
                    </p>
                  )}
                  {splitLines(entry.details).length > 0 && (
                    <div className="space-y-[1mm]">
                      {splitLines(entry.details).map((l, i) => (
                        <div key={i} className="flex items-start gap-[2mm] leading-[1.65] text-slate-700" style={{ fontSize: 'var(--fs-detail)' }}>
                          <span className="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400" />
                          <span dangerouslySetInnerHTML={{ __html: l }} />
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </AtsSection>
        )}

        {resume.showSkills && splitLines(resume.skillsText).length > 0 && (
          <AtsSection title="Skills">
            <div className="space-y-[1.5mm]">
              {splitLines(resume.skillsText).map((item) => (
                <div key={item} className="flex items-start gap-[2mm] leading-[1.65] text-slate-700" style={{ fontSize: 'var(--fs-label)' }}>
                  <span className="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </AtsSection>
        )}

        {resume.showLanguages &&
          splitLines(resume.languagesText).length > 0 && (
            <AtsSection title="Languages">
              <div className="space-y-[1.5mm]">
                {splitLines(resume.languagesText).map((item) => (
                  <div key={item} className="flex items-start gap-[2mm] leading-[1.65] text-slate-700" style={{ fontSize: 'var(--fs-label)' }}>
                    <span className="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </AtsSection>
          )}

        {resume.showCertifications &&
          splitLines(resume.certificationsText).length > 0 && (
            <AtsSection title="Certifications">
              <div className="space-y-[1.5mm]">
                {splitLines(resume.certificationsText).map((item) => (
                  <div key={item} className="flex items-start gap-[2mm] leading-[1.65] text-slate-700" style={{ fontSize: 'var(--fs-label)' }}>
                    <span className="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </AtsSection>
          )}

        {resume.showPersonalDetails &&
          getVisibleFacts(resume.personalDetails).length > 0 && (
            <AtsSection title="Personal Information">
              <div className="flex flex-wrap gap-x-[8mm] gap-y-[1.5mm]">
                {getVisibleFacts(resume.personalDetails).map((f) => (
                  <p key={f.id} className="text-slate-700" style={{ fontSize: 'var(--fs-label)' }}>
                    {f.label && <span className="font-bold">{f.label}:</span>}{" "}
                    {f.value}
                  </p>
                ))}
              </div>
            </AtsSection>
          )}

        {resume.showDeclaration && (
          <div className="mt-auto">
            <AtsSection title={resume.declarationTitle || "Declaration"}>
              <p className="text-justify leading-[1.75] text-slate-700 [&_b]:font-bold [&_i]:italic [&_u]:underline" style={{ fontSize: 'var(--fs-body)' }} dangerouslySetInnerHTML={{ __html: resume.declarationText || "I hereby declare that the above information is true and correct to the best of my knowledge and belief." }} />
            </AtsSection>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Preview: Modern Bold ──────────────────────────────────────────────────────

function ModernPreview({ resume }: { resume: ResumeData }) {
  const vc = getVisibleFacts(resume.contact);
  const vp = getVisibleFacts(resume.personalDetails);
  const fontDef = RESUME_FONTS.find((f) => f.id === resume.fontFamily);
  const fontStyle = fontDef ? { fontFamily: fontDef.cssFamily } : {};
  const sz = computeFontSizes(resume);

  function ModernSidebar({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) {
    return (
      <section
        className="space-y-[3.5mm]"
        style={{ breakInside: "avoid-page", pageBreakInside: "avoid" }}
      >
        <h2 className="border-b border-b-[#161e2e]/20 border-l-[3px] border-l-[#161e2e] pb-[1.5mm] pl-[2mm] font-black uppercase tracking-[0.14em] text-[#161e2e]" style={{ fontSize: 'var(--fs-label)' }}>
          {title}
        </h2>
        {children}
      </section>
    );
  }

  function ModernMain({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) {
    return (
      <section
        className="space-y-[3.5mm]"
        style={{ breakInside: "avoid-page", pageBreakInside: "avoid" }}
      >
        <h2 className="border-b-[2px] border-b-[#161e2e] border-l-[3px] border-l-[#161e2e] pb-[1.5mm] pl-[2mm] font-black uppercase tracking-[0.14em] text-[#161e2e]" style={{ fontSize: 'var(--fs-heading)' }}>
          {title}
        </h2>
        {children}
      </section>
    );
  }

  return (
    <div
      style={{ ...fontStyle, '--fs-name': sz.name, '--fs-heading': sz.heading, '--fs-body': sz.body, '--fs-detail': sz.detail, '--fs-label': sz.label } as unknown as React.CSSProperties}
      className="mx-auto flex min-h-[297mm] w-[210mm] min-w-[210mm] flex-col bg-white text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
    >
      {/* Dark header */}
      <div className="flex shrink-0 min-h-[46mm] items-center gap-[5mm] bg-[#161e2e] px-[7mm] py-[5mm]">
        {resume.showPhoto && resume.photoDataUrl && (
          <Image
            src={resume.photoDataUrl}
            alt="Profile"
            width={140}
            height={155}
            unoptimized
            className="h-[36mm] w-[32mm] shrink-0 rounded-sm border border-white/20 object-cover object-top shadow-md"
          />
        )}
        <div className="min-w-0">
          <h1 className="font-black uppercase leading-none tracking-[0.06em] text-white" style={{ fontSize: 'var(--fs-name)' }}>
            {resume.name || "Your Name"}
          </h1>
          {resume.title && (
            <p className="mt-[2mm] font-light uppercase tracking-[0.25em] text-white/60" style={{ fontSize: 'var(--fs-label)' }}>
              {resume.title}
            </p>
          )}
          {vc.length > 0 && (
            <p className="mt-[3mm] break-all leading-[1.7] text-white/50" style={{ fontSize: 'var(--fs-label)' }}>
              {vc.map((f) => f.value).join("  ·  ")}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-[251mm] items-stretch">
        <div className="flex w-[74mm] shrink-0 flex-col gap-[8mm] border-r border-slate-200 bg-[#f3f5f7] px-[5.5mm] py-[8mm]">
          {resume.showSkills && splitLines(resume.skillsText).length > 0 && (
            <ModernSidebar title="Skills">
              <div className="flex flex-wrap gap-[1.5mm]">
                {splitLines(resume.skillsText).map((item) => (
                  <span
                    key={item}
                    className="inline-block rounded-md bg-[#161e2e]/10 px-[2.5mm] leading-[5mm] text-[#161e2e]"
                    style={{ fontSize: 'var(--fs-label)' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </ModernSidebar>
          )}
          {resume.showLanguages &&
            splitLines(resume.languagesText).length > 0 && (
              <ModernSidebar title="Language">
                <div className="flex flex-wrap gap-[1.5mm]">
                  {splitLines(resume.languagesText).map((item) => (
                    <span
                      key={item}
                      className="inline-block rounded-md bg-[#161e2e]/10 px-[2.5mm] leading-[5mm] text-[#161e2e]"
                      style={{ fontSize: 'var(--fs-label)' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </ModernSidebar>
            )}
          {resume.showCertifications &&
            splitLines(resume.certificationsText).length > 0 && (
              <ModernSidebar title="Certifications">
                <div className="flex flex-wrap gap-[1.5mm]">
                  {splitLines(resume.certificationsText).map((item) => (
                    <span
                      key={item}
                      className="inline-block rounded-md bg-[#161e2e]/10 px-[2.5mm] leading-[5mm] text-[#161e2e]"
                      style={{ fontSize: 'var(--fs-label)' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </ModernSidebar>
            )}
          {resume.showPersonalDetails && vp.length > 0 && (
            <ModernSidebar title="Personal Details">
              <div className="space-y-[2mm]">
                {vp.map((f) => (
                  <p
                    key={f.id}
                    className="leading-[1.6] text-slate-700"
                    style={{ fontSize: 'var(--fs-label)' }}
                  >
                    {f.label && (
                      <span className="font-bold text-[#161e2e]">
                        {f.label}:
                      </span>
                    )}{" "}
                    {f.value}
                  </p>
                ))}
              </div>
            </ModernSidebar>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-[7mm] bg-white px-[7mm] py-[8mm]">
          {resume.aboutText && (
            <ModernMain title={resume.aboutTitle || "Profile Summary"}>
              <p className="text-justify leading-[1.75] text-slate-700 [&_b]:font-bold [&_i]:italic [&_u]:underline" style={{ fontSize: 'var(--fs-body)' }} dangerouslySetInnerHTML={{ __html: resume.aboutText }} />
            </ModernMain>
          )}
          {resume.education.length > 0 && (
            <ModernMain title="Education">
              <div className="space-y-[4mm]">
                {resume.education.map((e) => (
                  <div key={e.id} className="border-l-2 border-[#161e2e]/20 pl-[3mm]">
                    <EntryBlock entry={e} accentHeading />
                  </div>
                ))}
              </div>
            </ModernMain>
          )}
          {resume.showExperience && resume.experience.length > 0 && (
            <ModernMain title="Experience">
              <div className="space-y-[4mm]">
                {resume.experience.map((e) => (
                  <div key={e.id} className="border-l-2 border-[#161e2e]/20 pl-[3mm]">
                    <EntryBlock entry={e} accentHeading />
                  </div>
                ))}
              </div>
            </ModernMain>
          )}
          {resume.showProjects && resume.projects.length > 0 && (
            <ModernMain title="Projects">
              <div className="space-y-[4mm]">
                {resume.projects.map((e) => (
                  <div key={e.id} className="border-l-2 border-[#161e2e]/20 pl-[3mm]">
                    <EntryBlock entry={e} accentHeading />
                  </div>
                ))}
              </div>
            </ModernMain>
          )}
          {resume.showDeclaration && resume.declarationText && (
            <ModernMain title={resume.declarationTitle || "Declaration"}>
              <p className="text-justify leading-[1.75] text-slate-700 [&_b]:font-bold [&_i]:italic [&_u]:underline" style={{ fontSize: 'var(--fs-body)' }} dangerouslySetInnerHTML={{ __html: resume.declarationText }} />
            </ModernMain>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Edit form helpers ─────────────────────────────────────────────────────────

function ToggleField({
  checked,
  label,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  label: string;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 text-sm ${disabled ? "text-vintage-cream/40" : "text-vintage-cream/80"}`}
    >
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked && !disabled ? "bg-vintage-burgundy" : "bg-vintage-cream/20"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </div>
      {label}
    </label>
  );
}

function SectionCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-vintage-cream/10 bg-vintage-navy/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-vintage-cream/5"
      >
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-vintage-cream/70">
          {title}
        </h3>
        <Icon
          icon={
            open ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"
          }
          className="text-lg text-vintage-cream/40 transition-transform"
        />
      </button>
      {open && (
        <div className="border-t border-vintage-cream/5 px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Misc ──────────────────────────────────────────────────────────────────────

function loadDefaultPhoto(onLoad: (dataUrl: string) => void) {
  fetch(mediaDefaultPhoto.src)
    .then((res) => res.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onLoad(reader.result);
      };
      reader.readAsDataURL(blob);
    })
    .catch(() => {});
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState(() => cloneResumeData(initialResume));
  const [pdfAction, setPdfAction] = useState<PdfAction>("idle");
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [isStorageReady, setIsStorageReady] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  // Inject Google Fonts stylesheet once
  useEffect(() => {
    const id = "resume-google-fonts";
    if (!document.getElementById(id)) {
      const gFonts = RESUME_FONTS.filter((f) => f.googleParam);
      const params = gFonts.map((f) => `family=${f.googleParam}`).join("&");
      if (params) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`;
        document.head.appendChild(link);
      }
    }
    const localId = "resume-local-fonts";
    if (!document.getElementById(localId)) {
      const localFonts = RESUME_FONTS.filter((f) => !f.googleParam);
      if (localFonts.length > 0) {
        const css = localFonts
          .flatMap((f) => [
            `@font-face { font-family: '${f.name}'; src: url('${f.ttfBase}') format('truetype'); font-weight: 400; font-style: normal; }`,
            f.ttfBold !== f.ttfBase
              ? `@font-face { font-family: '${f.name}'; src: url('${f.ttfBold}') format('truetype'); font-weight: 700; font-style: normal; }`
              : "",
          ])
          .filter(Boolean)
          .join("\n");
        const style = document.createElement("style");
        style.id = localId;
        style.textContent = css;
        document.head.appendChild(style);
      }
    }
  }, []);

  useEffect(() => {
    let resolved = initialResume;
    try {
      const stored = window.localStorage.getItem(RESUME_STORAGE_KEY);
      if (stored) {
        const p = getStoredResume(stored);
        if (p) resolved = p;
      }
    } catch {
      /* ignore */
    }
    setResume(cloneResumeData(resolved));
    setIsStorageReady(true);
    if (!resolved.photoDataUrl) {
      loadDefaultPhoto((dataUrl) =>
        setResume((cur) => ({
          ...cur,
          photoDataUrl: dataUrl,
          showPhoto: cur.showPhoto,
        })),
      );
    }
  }, []);

  // Debounced auto-save
  useEffect(() => {
    if (!isStorageReady) return;
    setSaveStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus("saving");
      try {
        window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    }, 1800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume]);

  // Responsive A4 preview: scale down to fit container width
  useEffect(() => {
    const A4_PX = 794;
    const el = previewContainerRef.current;
    if (!el) return;
    const calc = () => setPreviewScale(Math.min(1, el.clientWidth / A4_PX));
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track scaled height to clip bottom blank space
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const calc = () =>
      setScaledHeight(Math.ceil(el.scrollHeight * previewScale));
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewScale]);

  function handleSaveNow() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    try {
      window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
      setSaveStatus("saved");
    } catch {
      setSaveStatus("unsaved");
    }
  }

  function upd<K extends keyof ResumeData>(field: K, value: ResumeData[K]) {
    setResume((cur) => ({ ...cur, [field]: value }));
  }

  function updFontSize(key: keyof FontSizes, delta: number) {
    setResume((r) => ({
      ...r,
      fontSizes: {
        ...r.fontSizes,
        [key]: Math.max(-5, Math.min(5, r.fontSizes[key] + delta)),
      },
    }));
  }

  function updateEntry(
    section: "education" | "experience" | "projects",
    id: string,
    field: keyof ResumeEntry,
    value: string,
  ) {
    setResume((cur) => ({
      ...cur,
      [section]: cur[section].map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));
  }

  function addEntry(section: "education" | "experience" | "projects") {
    setResume((cur) => ({
      ...cur,
      [section]: [
        ...cur[section],
        {
          id: createItemId(section),
          heading: "",
          subheading: "",
          period: "",
          details: "",
        },
      ],
    }));
  }

  function removeEntry(
    section: "education" | "experience" | "projects",
    id: string,
  ) {
    setResume((cur) => ({
      ...cur,
      [section]: cur[section].filter((e) => e.id !== id),
    }));
  }

  function updateFact(
    section: "contact" | "personalDetails",
    id: string,
    field: keyof ResumeFact,
    value: string,
  ) {
    setResume((cur) => ({
      ...cur,
      [section]: cur[section].map((f) =>
        f.id === id ? { ...f, [field]: value } : f,
      ),
    }));
  }

  function addFact(section: "contact" | "personalDetails") {
    const prefix = section === "contact" ? "contact" : "personal";
    setResume((cur) => ({
      ...cur,
      [section]: [
        ...cur[section],
        { id: createItemId(prefix), label: "", value: "" },
      ],
    }));
  }

  function removeFact(section: "contact" | "personalDetails", id: string) {
    setResume((cur) => ({
      ...cur,
      [section]: cur[section].filter((f) => f.id !== id),
    }));
  }

  function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string")
        setResume((cur) => ({
          ...cur,
          photoDataUrl: reader.result as string,
          showPhoto: true,
        }));
    };
    reader.readAsDataURL(file);
  }

  // Build a complete standalone HTML document from the live resume DOM.
  // All stylesheet URLs are made absolute so they load correctly when the
  // document is opened as a blob URL or a new window (which have null origin).
  function buildPrintHtml(opts: { autoprint?: boolean } = {}): string {
    const el = previewRef.current;
    if (!el) return "";

    const origin = window.location.origin;

    const sheetLinks = Array.from(document.styleSheets)
      .filter((s) => s.href)
      .map((s) => {
        const href = s.href!.startsWith("http")
          ? s.href!
          : `${origin}${s.href}`;
        return `<link rel="stylesheet" href="${href}">`;
      })
      .join("\n");

    // Inline <style> tags (Google Fonts + @font-face for local fonts).
    // Make relative /fonts/ URLs absolute so they resolve from a blob context.
    const inlineStyles = Array.from(document.querySelectorAll("style"))
      .map((s) => {
        const text = (s.textContent ?? "").replace(
          /url\(['"]?(\/[^'")\s]+)['"]?\)/g,
          (_, p) => `url('${origin}${p}')`,
        );
        return `<style>${text}</style>`;
      })
      .join("\n");

    const printScript = opts.autoprint
      ? `<script>window.addEventListener('load',function(){document.fonts.ready.then(function(){setTimeout(function(){window.print();},900);})})<\/script>`
      : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${(resume.name || "Resume").replace(/[<>&"]/g, "")}</title>
  ${sheetLinks}
  ${inlineStyles}
  <style>
    @page { size: 210mm 297mm; margin: 0; }
    html, body { margin: 0; padding: 0; background: white; }
    .resume-preview-stack {
      gap: 0 !important;
      width: 210mm !important;
    }
    .resume-preview-page {
      box-shadow: none !important;
      margin: 0 !important;
      break-after: page;
      page-break-after: always;
    }
    .resume-preview-page:last-child {
      break-after: auto;
      page-break-after: auto;
    }
  </style>
  ${printScript}
</head>
<body>${el.outerHTML}</body>
</html>`;
  }

  async function handlePdf(action: Exclude<PdfAction, "idle">) {
    setPdfAction(action);
    try {
      if (!previewRef.current) throw new Error("Preview not ready");
      await document.fonts.ready;

      const html = buildPrintHtml({ autoprint: action === "downloading" });

      if (action === "downloading") {
        // Create a blob URL and navigate a new window to it.
        // The embedded script auto-triggers the browser's Print / Save-as-PDF
        // dialog after fonts are ready.
        const blob = new Blob([html], { type: "text/html" });
        const url  = URL.createObjectURL(blob);
        const w    = window.open(url, "_blank");
        if (!w) {
          URL.revokeObjectURL(url);
          alert(
            "Popups are blocked. Please allow popups for this site and try again.",
          );
          return;
        }
        // Revoke after the window has had time to load
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else {
        // View: render the same HTML inside the modal iframe via a blob URL.
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        if (pdfViewerUrl) URL.revokeObjectURL(pdfViewerUrl);
        setPdfViewerUrl(url);
      }
    } catch (err) {
      console.error("[handlePdf]", err);
    } finally {
      setPdfAction("idle");
    }
  }

  function closePdfViewer() {
    if (pdfViewerUrl) URL.revokeObjectURL(pdfViewerUrl);
    setPdfViewerUrl(null);
  }

  function handleViewerDownload() {
    if (!previewRef.current) return;
    const html = buildPrintHtml({ autoprint: true });
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const w    = window.open(url, "_blank");
    if (w) setTimeout(() => URL.revokeObjectURL(url), 60_000);
    else   URL.revokeObjectURL(url);
  }

  function handleReset() {
    setResume(cloneResumeData(initialResume));
    try {
      window.localStorage.setItem(
        RESUME_STORAGE_KEY,
        JSON.stringify(initialResume),
      );
    } catch {
      /* ignore */
    }
    loadDefaultPhoto((dataUrl) =>
      setResume((cur) => ({
        ...cur,
        photoDataUrl: dataUrl,
        showPhoto: cur.showPhoto,
      })),
    );
  }

  function applyCareerPreset(presetId: ResumePresetId) {
    const preset = cloneResumeData(RESUME_PRESETS[presetId]);
    setResume((cur) => ({
      ...preset,
      name: cur.name,
      contact: cur.contact.map((fact) => ({ ...fact })),
      personalDetails: cur.personalDetails.map((fact) => ({ ...fact })),
      template: cur.template,
      fontFamily: cur.fontFamily,
      photoDataUrl: cur.photoDataUrl,
      showPhoto: preset.showPhoto && Boolean(cur.photoDataUrl),
      fontSizes: { ...cur.fontSizes },
    }));
  }

  const isBusy = pdfAction !== "idle";

  return (
    <main className="relative px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-vintage-cream/70 transition-colors hover:text-vintage-cream"
            >
              <Icon icon="solar:arrow-left-linear" /> Back to portfolio
            </Link>
            <div>
              <p className="badge badge-primary mb-3">Resume Builder</p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-vintage-cream md:text-5xl">
                Build your resume with 3 professional templates.
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-vintage-cream/70">
                Edit on the left, preview live on the right. Download as a
                ready-to-use PDF.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handlePdf("viewing")}
              disabled={isBusy}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon
                icon={
                  pdfAction === "viewing"
                    ? "solar:refresh-linear"
                    : "solar:eye-linear"
                }
                className={`text-lg ${pdfAction === "viewing" ? "animate-spin" : ""}`}
              />
              {pdfAction === "viewing" ? "Opening…" : "View PDF"}
            </button>
            <button
              onClick={() => handlePdf("downloading")}
              disabled={isBusy}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon
                icon={
                  pdfAction === "downloading"
                    ? "solar:refresh-linear"
                    : "solar:download-linear"
                }
                className={`text-lg ${pdfAction === "downloading" ? "animate-spin" : ""}`}
              />
              {pdfAction === "downloading" ? "Preparing…" : "Download PDF"}
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[480px_minmax(0,1fr)]">
          {/* ── Edit panel ── */}
          <section className="glass rounded-[28px] border border-vintage-cream/15 p-6 shadow-2xl shadow-black/20">
            {/* Panel header */}
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-vintage-cream">
                  Resume Editor
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  {saveStatus === "saved" && (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <Icon icon="solar:check-circle-linear" />
                      All changes saved
                    </span>
                  )}
                  {saveStatus === "unsaved" && (
                    <span className="flex items-center gap-1 text-xs text-vintage-cream/50">
                      <Icon icon="solar:pen-linear" />
                      Unsaved changes
                    </span>
                  )}
                  {saveStatus === "saving" && (
                    <span className="flex items-center gap-1 text-xs text-vintage-cream/50">
                      <Icon
                        icon="solar:refresh-linear"
                        className="animate-spin"
                      />
                      Saving…
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveNow}
                  disabled={saveStatus === "saved"}
                  className="flex items-center gap-1.5 rounded-full border border-vintage-cream/15 px-3 py-1.5 text-sm font-medium text-vintage-cream/70 transition-colors hover:border-vintage-cream/30 hover:text-vintage-cream disabled:cursor-default disabled:opacity-40"
                >
                  <Icon icon="solar:floppy-disk-linear" /> Save
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-full border border-vintage-cream/15 px-3 py-1.5 text-sm font-medium text-vintage-cream/50 transition-colors hover:border-vintage-cream/30 hover:text-vintage-cream"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Template selector */}
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-vintage-cream/50">
                Template
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => upd("template", t.id)}
                    className={`relative rounded-xl border p-3 text-left transition-all ${resume.template === t.id ? "border-vintage-burgundy bg-vintage-burgundy/15 shadow-sm shadow-vintage-burgundy/20" : "border-vintage-cream/10 hover:border-vintage-cream/25"}`}
                  >
                    {t.ats && (
                      <span className="absolute right-2 top-2 rounded-full bg-green-800/50 px-1.5 py-0.5 text-[9px] font-bold text-green-300">
                        ATS
                      </span>
                    )}
                    {/* Mini layout icon */}
                    <div className="mb-2 flex gap-1">
                      {t.id === "sidebar" && (
                        <>
                          <div className="h-6 w-[30%] rounded-[2px] bg-vintage-cream/20" />
                          <div className="h-6 flex-1 space-y-1 rounded-[2px] bg-vintage-cream/10 p-1">
                            <div className="h-1 w-3/4 rounded bg-vintage-cream/30" />
                            <div className="h-1 w-1/2 rounded bg-vintage-cream/20" />
                          </div>
                        </>
                      )}
                      {t.id === "professional" && (
                        <div className="h-6 flex-1 space-y-1 rounded-[2px] bg-vintage-cream/10 p-1">
                          <div className="mx-auto h-1.5 w-1/2 rounded bg-vintage-cream/40" />
                          <div className="h-1 w-full rounded bg-vintage-cream/20" />
                          <div className="h-1 w-4/5 rounded bg-vintage-cream/20" />
                        </div>
                      )}
                      {t.id === "modern" && (
                        <div className="flex-1 space-y-1 overflow-hidden rounded-[2px]">
                          <div className="h-2.5 w-full bg-vintage-cream/30" />
                          <div className="flex gap-1 p-1">
                            <div className="h-3 w-[35%] rounded-[1px] bg-vintage-cream/20" />
                            <div className="h-3 flex-1 space-y-0.5 rounded-[1px] bg-vintage-cream/10">
                              <div className="h-0.5 w-3/4 rounded bg-vintage-cream/30" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-vintage-cream/80">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-[9px] text-vintage-cream/40">
                      {t.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Career preset selector */}
            <div className="mb-6 rounded-2xl border border-vintage-cream/10 bg-vintage-slate/20 p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-vintage-cream/50">
                    Career Template
                  </p>
                  <p className="mt-1 text-xs text-vintage-cream/45">
                    Swap in aviation-ready content for airport ops, cabin crew, or ground support while keeping your personal details.
                  </p>
                </div>
                <span className="rounded-full border border-vintage-cream/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-vintage-cream/40">
                  Content only
                </span>
              </div>
              <div className="grid gap-2">
                {CAREER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyCareerPreset(preset.id)}
                    className="rounded-xl border border-vintage-cream/10 bg-vintage-navy/30 p-3 text-left transition-all hover:border-vintage-cream/25 hover:bg-vintage-cream/5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-vintage-cream/85">
                          {preset.name}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-vintage-cream/45">
                          {preset.desc}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-vintage-burgundy/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-vintage-burgundy">
                        {preset.shortName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font picker */}
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-vintage-cream/50">
                Font
              </p>
              <div className="grid grid-cols-1 gap-2">
                {RESUME_FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => upd("fontFamily", f.id)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all ${resume.fontFamily === f.id ? "border-vintage-burgundy bg-vintage-burgundy/15 shadow-sm shadow-vintage-burgundy/20" : "border-vintage-cream/10 hover:border-vintage-cream/25"}`}
                  >
                    <span
                      style={{ fontFamily: f.cssFamily }}
                      className="text-[15px] font-semibold text-vintage-cream/90"
                    >
                      {f.name}
                    </span>
                    <span className="text-[10px] text-vintage-cream/40">
                      {f.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {/* Typography */}
              <SectionCard title="Typography" defaultOpen={false}>
                <div className="space-y-4">
                  {/* Overall */}
                  <div>
                    <p className="mb-2 text-xs font-medium text-vintage-cream/70">Overall size</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updFontSize("overall", -1)}
                        disabled={resume.fontSizes.overall <= -5}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-vintage-cream/20 text-base text-vintage-cream/70 hover:bg-vintage-cream/10 disabled:opacity-30"
                      >−</button>
                      <span className="min-w-[2rem] text-center text-xs text-vintage-cream/60">
                        {resume.fontSizes.overall > 0 ? `+${resume.fontSizes.overall}` : resume.fontSizes.overall}
                      </span>
                      <button
                        onClick={() => updFontSize("overall", 1)}
                        disabled={resume.fontSizes.overall >= 5}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-vintage-cream/20 text-base text-vintage-cream/70 hover:bg-vintage-cream/10 disabled:opacity-30"
                      >+</button>
                      {resume.fontSizes.overall !== 0 && (
                        <button
                          onClick={() => updFontSize("overall", -resume.fontSizes.overall)}
                          className="ml-1 text-[10px] text-vintage-cream/40 hover:text-vintage-cream/70"
                        >reset</button>
                      )}
                    </div>
                  </div>
                  {/* Per-field */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-vintage-cream/70">Per section</p>
                    {(
                      [
                        { key: "name",    label: "Name" },
                        { key: "heading", label: "Headings" },
                        { key: "body",    label: "Body text" },
                        { key: "detail",  label: "Details / bullets" },
                        { key: "label",   label: "Labels / chips" },
                      ] as { key: keyof FontSizes; label: string }[]
                    ).map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-vintage-cream/60">{label}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updFontSize(key, -1)}
                            disabled={resume.fontSizes[key] <= -5}
                            className="flex h-6 w-6 items-center justify-center rounded border border-vintage-cream/20 text-xs text-vintage-cream/70 hover:bg-vintage-cream/10 disabled:opacity-30"
                          >−</button>
                          <span className="min-w-[1.75rem] text-center text-[11px] text-vintage-cream/60">
                            {resume.fontSizes[key] > 0 ? `+${resume.fontSizes[key]}` : resume.fontSizes[key]}
                          </span>
                          <button
                            onClick={() => updFontSize(key, 1)}
                            disabled={resume.fontSizes[key] >= 5}
                            className="flex h-6 w-6 items-center justify-center rounded border border-vintage-cream/20 text-xs text-vintage-cream/70 hover:bg-vintage-cream/10 disabled:opacity-30"
                          >+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* Basic Info */}
              <SectionCard title="Basic Info">
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-vintage-cream/70">
                      Full Name
                    </span>
                    <input
                      value={resume.name}
                      onChange={(e) => upd("name", e.target.value)}
                      className="input-field"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-vintage-cream/70">
                      Job Title / Role
                    </span>
                    <input
                      value={resume.title}
                      onChange={(e) => upd("title", e.target.value)}
                      className="input-field"
                      placeholder="e.g. Airport Management Professional"
                    />
                  </label>
                </div>
              </SectionCard>

              {/* Photo */}
              <SectionCard title="Profile Photo" defaultOpen={false}>
                <div className="space-y-3">
                  {resume.photoDataUrl && (
                    <div className="flex items-center gap-3">
                      <Image
                        src={resume.photoDataUrl}
                        alt="Preview"
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <button
                        onClick={() =>
                          setResume((cur) => ({
                            ...cur,
                            photoDataUrl: "",
                            showPhoto: false,
                          }))
                        }
                        className="text-xs text-vintage-cream/50 hover:text-vintage-cream"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-vintage-cream/70">
                      Upload photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full rounded-lg border border-dashed border-vintage-cream/20 bg-vintage-slate/20 px-3 py-2.5 text-xs text-vintage-cream/60 file:mr-3 file:rounded-full file:border-0 file:bg-vintage-burgundy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                    />
                  </label>
                  <ToggleField
                    checked={resume.showPhoto}
                    onChange={(v) => upd("showPhoto", v)}
                    label="Show photo on resume"
                    disabled={!resume.photoDataUrl}
                  />
                </div>
              </SectionCard>

              {/* Profile Summary */}
              <SectionCard title="Profile Summary">
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-vintage-cream/70">
                      Section heading
                    </span>
                    <input
                      value={resume.aboutTitle}
                      onChange={(e) => upd("aboutTitle", e.target.value)}
                      className="input-field"
                      placeholder="Profile Summary"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-vintage-cream/70">
                      Summary text
                    </span>
                    <RichEditor
                      value={resume.aboutText}
                      onChange={(html) => upd("aboutText", html)}
                      placeholder="Write 3-4 lines about your background and career goals."
                      minHeight="100px"
                    />
                  </label>
                </div>
              </SectionCard>

              {/* Contact */}
              <SectionCard title="Contact" defaultOpen={false}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ToggleField
                      checked={resume.showContact}
                      onChange={(v) => upd("showContact", v)}
                      label="Show on resume"
                    />
                    <button
                      onClick={() => addFact("contact")}
                      className="flex items-center gap-1 text-xs text-vintage-cream/60 hover:text-vintage-cream"
                    >
                      <Icon icon="solar:add-circle-linear" /> Add row
                    </button>
                  </div>
                  {resume.contact.map((fact, i) => (
                    <div key={fact.id} className="flex items-center gap-2">
                      <input
                        value={fact.value}
                        onChange={(e) =>
                          updateFact(
                            "contact",
                            fact.id,
                            "value",
                            e.target.value,
                          )
                        }
                        className="input-field flex-1"
                        placeholder={`Contact ${i + 1} (phone, email, URL…)`}
                      />
                      {resume.contact.length > 1 && (
                        <button
                          onClick={() => removeFact("contact", fact.id)}
                          className="shrink-0 text-vintage-cream/30 hover:text-vintage-cream"
                        >
                          <Icon icon="solar:trash-bin-minimalistic-linear" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Education */}
              <SectionCard title="Education">
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => addEntry("education")}
                      className="flex items-center gap-1 text-xs text-vintage-cream/60 hover:text-vintage-cream"
                    >
                      <Icon icon="solar:add-circle-linear" /> Add entry
                    </button>
                  </div>
                  {resume.education.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-vintage-cream/10 bg-vintage-slate/20 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-vintage-cream/60">
                          Education {index + 1}
                        </span>
                        {resume.education.length > 1 && (
                          <button
                            onClick={() => removeEntry("education", entry.id)}
                            className="text-xs text-vintage-cream/30 hover:text-vintage-cream"
                          >
                            <Icon icon="solar:trash-bin-minimalistic-linear" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          value={entry.heading}
                          onChange={(e) =>
                            updateEntry(
                              "education",
                              entry.id,
                              "heading",
                              e.target.value,
                            )
                          }
                          className="input-field"
                          placeholder="Degree or qualification"
                        />
                        <textarea
                          value={entry.details}
                          onChange={(e) =>
                            updateEntry(
                              "education",
                              entry.id,
                              "details",
                              e.target.value,
                            )
                          }
                          className="input-field min-h-[70px] resize-y text-xs"
                          title="Select text after typing to bold/italic/underline it"
                          placeholder={
                            "One bullet per line:\nSpecialization\nInstitution name\nYear"
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Experience */}
              <SectionCard title="Work Experience" defaultOpen={false}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ToggleField
                      checked={resume.showExperience}
                      onChange={(v) => upd("showExperience", v)}
                      label="Include experience"
                    />
                    {resume.showExperience && (
                      <button
                        onClick={() => addEntry("experience")}
                        className="flex items-center gap-1 text-xs text-vintage-cream/60 hover:text-vintage-cream"
                      >
                        <Icon icon="solar:add-circle-linear" /> Add
                      </button>
                    )}
                  </div>
                  {resume.showExperience &&
                    resume.experience.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-vintage-cream/10 bg-vintage-slate/20 p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-vintage-cream/60">
                            Job {index + 1}
                          </span>
                          {resume.experience.length > 1 && (
                            <button
                              onClick={() =>
                                removeEntry("experience", entry.id)
                              }
                              className="text-xs text-vintage-cream/30 hover:text-vintage-cream"
                            >
                              <Icon icon="solar:trash-bin-minimalistic-linear" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            value={entry.heading}
                            onChange={(e) =>
                              updateEntry(
                                "experience",
                                entry.id,
                                "heading",
                                e.target.value,
                              )
                            }
                            className="input-field"
                            placeholder="Job title"
                          />
                          <input
                            value={entry.subheading}
                            onChange={(e) =>
                              updateEntry(
                                "experience",
                                entry.id,
                                "subheading",
                                e.target.value,
                              )
                            }
                            className="input-field"
                            placeholder="Company / Organisation"
                          />
                          <input
                            value={entry.period}
                            onChange={(e) =>
                              updateEntry(
                                "experience",
                                entry.id,
                                "period",
                                e.target.value,
                              )
                            }
                            className="input-field"
                            placeholder="2023 - Present"
                          />
                          <textarea
                            value={entry.details}
                            onChange={(e) =>
                              updateEntry(
                                "experience",
                                entry.id,
                                "details",
                                e.target.value,
                              )
                            }
                            className="input-field min-h-[80px] resize-y text-xs"
                            title="Select text after typing to bold/italic/underline it"
                            placeholder={
                              "One bullet per line:\nKey achievement or responsibility"
                            }
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </SectionCard>

              {/* Projects */}
              <SectionCard title="Projects" defaultOpen={false}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ToggleField
                      checked={resume.showProjects}
                      onChange={(v) => upd("showProjects", v)}
                      label="Include projects"
                    />
                    {resume.showProjects && (
                      <button
                        onClick={() => addEntry("projects")}
                        className="flex items-center gap-1 text-xs text-vintage-cream/60 hover:text-vintage-cream"
                      >
                        <Icon icon="solar:add-circle-linear" /> Add
                      </button>
                    )}
                  </div>
                  {resume.showProjects &&
                    resume.projects.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-vintage-cream/10 bg-vintage-slate/20 p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-vintage-cream/60">
                            Project {index + 1}
                          </span>
                          {resume.projects.length > 1 && (
                            <button
                              onClick={() => removeEntry("projects", entry.id)}
                              className="text-xs text-vintage-cream/30 hover:text-vintage-cream"
                            >
                              <Icon icon="solar:trash-bin-minimalistic-linear" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            value={entry.heading}
                            onChange={(e) =>
                              updateEntry(
                                "projects",
                                entry.id,
                                "heading",
                                e.target.value,
                              )
                            }
                            className="input-field"
                            placeholder="Project title"
                          />
                          <input
                            value={entry.subheading}
                            onChange={(e) =>
                              updateEntry(
                                "projects",
                                entry.id,
                                "subheading",
                                e.target.value,
                              )
                            }
                            className="input-field"
                            placeholder="Role / Contribution (e.g. Contributor · Ongoing)"
                          />
                          <input
                            value={entry.period}
                            onChange={(e) =>
                              updateEntry(
                                "projects",
                                entry.id,
                                "period",
                                e.target.value,
                              )
                            }
                            className="input-field"
                            placeholder="Duration (e.g. 2024 – Present)"
                          />
                          <textarea
                            value={entry.details}
                            onChange={(e) =>
                              updateEntry(
                                "projects",
                                entry.id,
                                "details",
                                e.target.value,
                              )
                            }
                            className="input-field min-h-[70px] resize-y text-xs"
                            title="Select text after typing to bold/italic/underline it"
                            placeholder="One bullet per line"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </SectionCard>

              {/* Skills */}
              <SectionCard title="Skills" defaultOpen={false}>
                <div className="space-y-3">
                  <ToggleField
                    checked={resume.showSkills}
                    onChange={(v) => upd("showSkills", v)}
                    label="Include skills"
                  />
                  <textarea
                    value={resume.skillsText}
                    onChange={(e) => upd("skillsText", e.target.value)}
                    className="input-field min-h-[90px] resize-y text-xs"
                    placeholder={
                      "One skill per line:\nTeam work\nCommunication"
                    }
                  />
                </div>
              </SectionCard>

              {/* Certifications */}
              <SectionCard title="Certifications" defaultOpen={false}>
                <div className="space-y-3">
                  <ToggleField
                    checked={resume.showCertifications}
                    onChange={(v) => upd("showCertifications", v)}
                    label="Include certifications"
                  />
                  <textarea
                    value={resume.certificationsText}
                    onChange={(e) => upd("certificationsText", e.target.value)}
                    className="input-field min-h-[70px] resize-y text-xs"
                    placeholder={"Sabre\nAmadeus"}
                  />
                </div>
              </SectionCard>

              {/* Languages */}
              <SectionCard title="Languages" defaultOpen={false}>
                <div className="space-y-3">
                  <ToggleField
                    checked={resume.showLanguages}
                    onChange={(v) => upd("showLanguages", v)}
                    label="Include languages"
                  />
                  <textarea
                    value={resume.languagesText}
                    onChange={(e) => upd("languagesText", e.target.value)}
                    className="input-field min-h-[60px] resize-y text-xs"
                    placeholder={"English\nMalayalam"}
                  />
                </div>
              </SectionCard>

              {/* Personal Details */}
              <SectionCard title="Personal Details" defaultOpen={false}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ToggleField
                      checked={resume.showPersonalDetails}
                      onChange={(v) => upd("showPersonalDetails", v)}
                      label="Include personal details"
                    />
                    <button
                      onClick={() => addFact("personalDetails")}
                      className="flex items-center gap-1 text-xs text-vintage-cream/60 hover:text-vintage-cream"
                    >
                      <Icon icon="solar:add-circle-linear" /> Add
                    </button>
                  </div>
                  {resume.personalDetails.map((fact) => (
                    <div key={fact.id} className="flex items-center gap-2">
                      <input
                        value={fact.label}
                        onChange={(e) =>
                          updateFact(
                            "personalDetails",
                            fact.id,
                            "label",
                            e.target.value,
                          )
                        }
                        className="input-field w-[110px] shrink-0 text-xs"
                        placeholder="Label"
                      />
                      <input
                        value={fact.value}
                        onChange={(e) =>
                          updateFact(
                            "personalDetails",
                            fact.id,
                            "value",
                            e.target.value,
                          )
                        }
                        className="input-field flex-1 text-xs"
                        placeholder="Value"
                      />
                      {resume.personalDetails.length > 1 && (
                        <button
                          onClick={() => removeFact("personalDetails", fact.id)}
                          className="shrink-0 text-vintage-cream/30 hover:text-vintage-cream"
                        >
                          <Icon icon="solar:trash-bin-minimalistic-linear" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Achievements */}
              <SectionCard title="Achievements" defaultOpen={false}>
                <div className="space-y-3">
                  <ToggleField
                    checked={resume.showAchievements}
                    onChange={(v) => upd("showAchievements", v)}
                    label="Include achievements"
                  />
                  <RichEditor
                    value={resume.achievementsText}
                    onChange={(html) => upd("achievementsText", html)}
                    placeholder={"One achievement per line:\nCompleted GDS training with distinction\nParticipated in airport simulation"}
                    minHeight="70px"
                  />
                </div>
              </SectionCard>

              {/* Declaration */}
              <SectionCard title="Declaration" defaultOpen={false}>
                <div className="space-y-3">
                  <ToggleField
                    checked={resume.showDeclaration}
                    onChange={(v) => upd("showDeclaration", v)}
                    label="Include declaration"
                  />
                  {resume.showDeclaration && (
                    <>
                      <input
                        value={resume.declarationTitle}
                        onChange={(e) =>
                          upd("declarationTitle", e.target.value)
                        }
                        className="input-field text-xs"
                        placeholder="Declaration"
                      />
                      <RichEditor
                        value={resume.declarationText}
                        onChange={(html) => upd("declarationText", html)}
                        placeholder="I hereby declare…"
                        minHeight="80px"
                      />
                    </>
                  )}
                </div>
              </SectionCard>
            </div>
          </section>

          {/* ── A4 Preview ── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-vintage-cream">
                  Live Preview
                  <span className="ml-3 text-sm font-normal text-vintage-cream/50">
                    {TEMPLATES.find((t) => t.id === resume.template)?.name}
                    {resume.template === "professional" && (
                      <span className="ml-2 rounded-full bg-green-900/40 px-2 py-0.5 text-[10px] font-bold text-green-400">
                        ATS Safe
                      </span>
                    )}
                  </span>
                </h2>
              </div>
              <div className="badge">210mm × 297mm</div>
            </div>

            <div
              ref={previewContainerRef}
              className="overflow-hidden rounded-[28px] border border-vintage-cream/10 bg-black/10 p-4 shadow-2xl shadow-black/20"
            >
              <div
                style={{
                  width: `${Math.round(794 * previewScale)}px`,
                  height: scaledHeight > 0 ? `${scaledHeight}px` : undefined,
                  overflow: "hidden",
                }}
              >
                <div
                  ref={scaleWrapperRef}
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    width: "794px",
                  }}
                >
                  <div ref={previewRef}>
                    {resume.template === "professional" ? (
                      <ProfessionalPreview resume={resume} />
                    ) : resume.template === "modern" ? (
                      <ModernPreview resume={resume} />
                    ) : (
                      <ClassicPreview resume={resume} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── PDF Viewer Modal ─────────────────────────────────────────────── */}
      {pdfViewerUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closePdfViewer()}
        >
          <div
            className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-vintage-cream/15 bg-[#0d1117] shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
            style={{ height: "calc(100vh - 2rem)" }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-vintage-cream/10 bg-[#0d1117] px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-vintage-burgundy/20">
                  <Icon
                    icon="solar:document-text-bold"
                    className="text-[20px] text-vintage-burgundy"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-vintage-cream">
                    {resume.name || "Resume"} &mdash; PDF Preview
                  </p>
                  <p className="text-[11px] text-vintage-cream/40">
                    A4 · 210 × 297 mm ·{" "}
                    {TEMPLATES.find((t) => t.id === resume.template)?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleViewerDownload}
                  className="btn-primary py-2 text-sm"
                >
                  <Icon icon="solar:download-linear" className="text-base" />
                  Download
                </button>
                <button
                  onClick={closePdfViewer}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-vintage-cream/15 text-vintage-cream/60 transition-colors hover:border-vintage-cream/30 hover:text-vintage-cream"
                  aria-label="Close viewer"
                >
                  <Icon icon="solar:close-linear" className="text-lg" />
                </button>
              </div>
            </div>

            {/* PDF embed */}
            <div className="relative flex-1 overflow-hidden bg-[#1a1f2e]">
              <iframe
                src={pdfViewerUrl}
                className="absolute inset-0 h-full w-full border-0"
                title="Resume PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
