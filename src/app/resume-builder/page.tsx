"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import type { jsPDF as JsPdf } from "jspdf";

type ResumeEntry = {
  id: string;
  heading: string;
  subheading: string;
  period: string;
  details: string;
};

type ResumeFact = {
  id: string;
  label: string;
  value: string;
};

type ResumeData = {
  name: string;
  title: string;
  aboutTitle: string;
  aboutText: string;
  declarationTitle: string;
  declarationText: string;
  skillsText: string;
  languagesText: string;
  showExperience: boolean;
  showProjects: boolean;
  showSkills: boolean;
  showLanguages: boolean;
  showContact: boolean;
  showPersonalDetails: boolean;
  showDeclaration: boolean;
  showPhoto: boolean;
  photoTopLeft: boolean;
  photoDataUrl: string;
  education: ResumeEntry[];
  experience: ResumeEntry[];
  projects: ResumeEntry[];
  contact: ResumeFact[];
  personalDetails: ResumeFact[];
};

type PdfAction = "idle" | "viewing" | "downloading";
const RESUME_STORAGE_KEY = "resume-builder-draft-v1";

const initialResume: ResumeData = {
  name: "Umar Suhail",
  title: "Senior Frontend Developer",
  aboutTitle: "About Me",
  aboutText:
    "Full-stack software architect with 6+ years of experience building polished, high-performance web products with React, Next.js, and TypeScript. I enjoy turning complex product needs into clean interfaces and scalable systems.",
  declarationTitle: "Declaration",
  declarationText:
    "I hereby declare that the information provided above is true and correct to the best of my knowledge.",
  skillsText: "React\nNext.js\nTypeScript\nTailwind CSS\nRedux\nNode.js",
  languagesText: "English\nHindi\nArabic",
  showExperience: true,
  showProjects: false,
  showSkills: false,
  showLanguages: false,
  showContact: false,
  showPersonalDetails: false,
  showDeclaration: false,
  showPhoto: false,
  photoTopLeft: true,
  photoDataUrl: "",
  education: [
    {
      id: "education-1",
      heading: "B.Tech in Computer Engineering",
      subheading: "KMP College of Engineering",
      period: "2014 - 2018",
      details:
        "Graduated with a strong focus on software engineering, UI development, and modern web technologies.",
    },
  ],
  experience: [
    {
      id: "experience-1",
      heading: "Application Developer",
      subheading: "Emirates Face Recognition",
      period: "2024 - Present",
      details:
        "Built enterprise dashboards for real-time monitoring and analytics.\nLed frontend architecture decisions and shipped responsive UI systems.\nCollaborated closely with product and backend teams on scalable features.",
    },
  ],
  projects: [
    {
      id: "project-1",
      heading: "AI Chat Assistant",
      subheading: "Next.js, TypeScript, OpenAI API",
      period: "2024",
      details:
        "Built a conversational product experience for business workflows.\nDesigned reusable UI patterns and responsive dashboard views.",
    },
  ],
  contact: [
    { id: "contact-1", label: "Email", value: "umarsuhail112@gmail.com" },
    { id: "contact-2", label: "Phone", value: "+971 56 832 3258" },
  ],
  personalDetails: [
    { id: "personal-1", label: "Location", value: "Dubai, UAE" },
    { id: "personal-2", label: "Nationality", value: "Indian" },
  ],
};

function normalizeEntry(entry: unknown): ResumeEntry | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const value = entry as Partial<ResumeEntry>;

  return {
    id: typeof value.id === "string" && value.id ? value.id : createItemId("entry"),
    heading: typeof value.heading === "string" ? value.heading : "",
    subheading: typeof value.subheading === "string" ? value.subheading : "",
    period: typeof value.period === "string" ? value.period : "",
    details: typeof value.details === "string" ? value.details : "",
  };
}

function normalizeFact(fact: unknown, prefix: string): ResumeFact | null {
  if (!fact || typeof fact !== "object") {
    return null;
  }

  const value = fact as Partial<ResumeFact>;

  return {
    id: typeof value.id === "string" && value.id ? value.id : createItemId(prefix),
    label: typeof value.label === "string" ? value.label : "",
    value: typeof value.value === "string" ? value.value : "",
  };
}

function getStoredResume(rawValue: string): ResumeData | null {
  try {
    const parsed = JSON.parse(rawValue) as Partial<ResumeData>;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      ...initialResume,
      ...parsed,
      education: Array.isArray(parsed.education)
        ? parsed.education.map(normalizeEntry).filter((entry): entry is ResumeEntry => Boolean(entry))
        : initialResume.education,
      experience: Array.isArray(parsed.experience)
        ? parsed.experience.map(normalizeEntry).filter((entry): entry is ResumeEntry => Boolean(entry))
        : initialResume.experience,
      projects: Array.isArray(parsed.projects)
        ? parsed.projects.map(normalizeEntry).filter((entry): entry is ResumeEntry => Boolean(entry))
        : initialResume.projects,
      contact: Array.isArray(parsed.contact)
        ? parsed.contact
            .map((fact) => normalizeFact(fact, "contact"))
            .filter((fact): fact is ResumeFact => Boolean(fact))
        : initialResume.contact,
      personalDetails: Array.isArray(parsed.personalDetails)
        ? parsed.personalDetails
            .map((fact) => normalizeFact(fact, "personal"))
            .filter((fact): fact is ResumeFact => Boolean(fact))
        : initialResume.personalDetails,
    };
  } catch {
    return null;
  }
}

function createItemId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getVisibleFacts(facts: ResumeFact[]) {
  return facts.filter((fact) => fact.label.trim() || fact.value.trim());
}

function inferImageFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  if (dataUrl.startsWith("data:image/png")) {
    return "PNG";
  }

  if (dataUrl.startsWith("data:image/webp")) {
    return "WEBP";
  }

  return "JPEG";
}

function addWrappedText(
  doc: JsPdf,
  text: string,
  x: number,
  y: number,
  width: number,
  lineHeight: number,
) {
  const lines = doc.splitTextToSize(text, width) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function drawSectionHeading(doc: JsPdf, title: string, x: number, y: number, width: number) {
  doc.setDrawColor(215, 222, 231);
  doc.line(x, y + 1.4, x + width, y + 1.4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(82, 97, 115);
  doc.text(title.toUpperCase(), x, y);
  return y + 6;
}

function drawParagraphSection(
  doc: JsPdf,
  title: string,
  text: string,
  x: number,
  y: number,
  width: number,
) {
  let cursorY = drawSectionHeading(doc, title, x, y, width);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(16, 32, 54);
  cursorY = addWrappedText(doc, text, x, cursorY, width, 4.5);
  return cursorY + 4;
}

function drawFactSection(
  doc: JsPdf,
  title: string,
  facts: ResumeFact[],
  x: number,
  y: number,
  width: number,
) {
  const visibleFacts = getVisibleFacts(facts);

  if (!visibleFacts.length) {
    return y;
  }

  let cursorY = drawSectionHeading(doc, title, x, y, width);

  visibleFacts.forEach((fact) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.6);
    doc.setTextColor(82, 97, 115);
    doc.text((fact.label || "Label").toUpperCase(), x, cursorY);
    cursorY += 3.6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(16, 32, 54);
    cursorY = addWrappedText(doc, fact.value || "Value", x, cursorY, width, 4.3);
    cursorY += 3.5;
  });

  return cursorY;
}

function drawTagSection(
  doc: JsPdf,
  title: string,
  text: string,
  x: number,
  y: number,
  width: number,
) {
  const items = splitLines(text);

  if (!items.length) {
    return y;
  }

  let cursorY = drawSectionHeading(doc, title, x, y, width);
  let cursorX = x;
  const rowHeight = 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  items.forEach((item) => {
    const pillWidth = doc.getTextWidth(item) + 6;

    if (cursorX + pillWidth > x + width) {
      cursorX = x;
      cursorY += rowHeight + 2;
    }

    doc.setFillColor(238, 243, 247);
    doc.roundedRect(cursorX, cursorY - 3.7, pillWidth, rowHeight, 2.2, 2.2, "F");
    doc.setTextColor(16, 32, 54);
    doc.text(item, cursorX + 3, cursorY);
    cursorX += pillWidth + 2;
  });

  return cursorY + rowHeight + 3;
}

function drawEntrySection(
  doc: JsPdf,
  title: string,
  entries: ResumeEntry[],
  x: number,
  y: number,
  width: number,
) {
  if (!entries.length) {
    return y;
  }

  let cursorY = drawSectionHeading(doc, title, x, y, width);

  entries.forEach((entry) => {
    const heading = entry.heading || "Untitled item";
    const subheading = entry.subheading || "Add a subtitle";
    const period = entry.period || "";
    const detailLines = splitLines(entry.details);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(16, 32, 54);

    const periodWidth = period ? doc.getTextWidth(period) : 0;
    const headingWidth = period ? width - periodWidth - 4 : width;
    const wrappedHeading = doc.splitTextToSize(heading, headingWidth) as string[];
    doc.text(wrappedHeading, x, cursorY);

    if (period) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(82, 97, 115);
      doc.text(period, x + width, cursorY, { align: "right" });
    }

    cursorY += wrappedHeading.length * 4.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(82, 97, 115);
    cursorY = addWrappedText(doc, subheading, x, cursorY, width, 4.2);
    cursorY += 1;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.7);
    doc.setTextColor(16, 32, 54);

    detailLines.forEach((line) => {
      const bulletLines = doc.splitTextToSize(`- ${line}`, width - 2) as string[];
      doc.text(bulletLines, x + 1.5, cursorY);
      cursorY += bulletLines.length * 4;
    });

    cursorY += 4;
  });

  return cursorY;
}

async function createResumePdfBlob(resume: ResumeData) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 210;
  const marginX = 16;
  const topY = 18;
  const contentTopY = 44;
  const columnGap = 10;
  const leftColumnWidth = 72;
  const rightColumnWidth = pageWidth - marginX * 2 - columnGap - leftColumnWidth;
  const rightColumnX = marginX + leftColumnWidth + columnGap;
  const visibleEducation = resume.education.filter(
    (entry) =>
      entry.heading.trim() || entry.subheading.trim() || entry.period.trim() || entry.details.trim(),
  );
  const visibleExperience = resume.experience.filter(
    (entry) =>
      entry.heading.trim() || entry.subheading.trim() || entry.period.trim() || entry.details.trim(),
  );
  const visibleProjects = resume.projects.filter(
    (entry) =>
      entry.heading.trim() || entry.subheading.trim() || entry.period.trim() || entry.details.trim(),
  );

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  if (resume.showPhoto && resume.photoTopLeft && resume.photoDataUrl) {
    try {
      doc.addImage(
        resume.photoDataUrl,
        inferImageFormat(resume.photoDataUrl),
        marginX,
        topY,
        34,
        34,
      );
    } catch {
      // Ignore invalid image data and continue building the PDF.
    }
  }

  const headerTextX =
    resume.showPhoto && resume.photoTopLeft && resume.photoDataUrl ? marginX + 40 : marginX;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.setTextColor(16, 32, 54);
  doc.text(resume.name || "Your Name", headerTextX, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(11, 143, 176);
  doc.text((resume.title || "Your Title").toUpperCase(), headerTextX, 33);

  doc.setDrawColor(16, 32, 54);
  doc.setLineWidth(0.45);
  doc.line(marginX, 39.5, pageWidth - marginX, 39.5);

  let leftY = contentTopY;
  let rightY = contentTopY;

  leftY = drawParagraphSection(
    doc,
    resume.aboutTitle || "About Me",
    resume.aboutText || "Write a short professional summary here.",
    marginX,
    leftY,
    leftColumnWidth,
  );

  if (resume.showContact) {
    leftY = drawFactSection(doc, "Contact", resume.contact, marginX, leftY, leftColumnWidth);
  }

  if (resume.showPersonalDetails) {
    leftY = drawFactSection(
      doc,
      "Personal Details",
      resume.personalDetails,
      marginX,
      leftY,
      leftColumnWidth,
    );
  }

  if (resume.showSkills) {
    leftY = drawTagSection(doc, "Skills", resume.skillsText, marginX, leftY, leftColumnWidth);
  }

  if (resume.showLanguages) {
    leftY = drawTagSection(doc, "Languages", resume.languagesText, marginX, leftY, leftColumnWidth);
  }

  if (resume.showDeclaration && resume.declarationText.trim()) {
    drawParagraphSection(
      doc,
      resume.declarationTitle || "Declaration",
      resume.declarationText,
      marginX,
      leftY,
      leftColumnWidth,
    );
  }

  rightY = drawEntrySection(
    doc,
    "Education",
    visibleEducation.length ? visibleEducation : resume.education,
    rightColumnX,
    rightY,
    rightColumnWidth,
  );

  if (resume.showExperience) {
    rightY = drawEntrySection(
      doc,
      "Experience",
      visibleExperience,
      rightColumnX,
      rightY,
      rightColumnWidth,
    );
  }

  if (resume.showProjects) {
    drawEntrySection(
      doc,
      "Projects",
      visibleProjects,
      rightColumnX,
      rightY,
      rightColumnWidth,
    );
  }

  return doc.output("blob");
}

function PreviewEntry({ entry }: { entry: ResumeEntry }) {
  const detailLines = splitLines(entry.details);

  return (
    <article className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-bold text-slate-900">
            {entry.heading || "Untitled item"}
          </h3>
          <p className="text-[12px] text-slate-500">{entry.subheading || "Add a subtitle"}</p>
        </div>
        <p className="shrink-0 text-[11px] font-medium text-slate-500">{entry.period || "Year"}</p>
      </div>
      {detailLines.length ? (
        <ul className="ml-4 list-disc space-y-1 text-[12px] leading-5 text-slate-700">
          {detailLines.map((line) => (
            <li key={`${entry.id}-${line}`}>{line}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="border-b border-slate-200 pb-2 text-[11px] font-extrabold uppercase tracking-[0.3em] text-slate-500">
        {title}
      </div>
      {children}
    </section>
  );
}

function ToggleField({
  checked,
  label,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 text-sm ${
        disabled ? "text-vintage-cream/40" : "text-vintage-cream/80"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-vintage-cream/30 bg-vintage-navy text-vintage-burgundy"
      />
      {label}
    </label>
  );
}

function FactPreview({ facts }: { facts: ResumeFact[] }) {
  const visibleFacts = getVisibleFacts(facts);

  if (!visibleFacts.length) {
    return <p className="text-[12px] leading-[1.65] text-slate-500">No details added yet.</p>;
  }

  return (
    <div className="space-y-2">
      {visibleFacts.map((fact) => (
        <div key={fact.id} className="space-y-0.5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            {fact.label || "Label"}
          </p>
          <p className="text-[12px] leading-[1.55] text-slate-700">{fact.value || "Value"}</p>
        </div>
      ))}
    </div>
  );
}

function TagPreview({ text, emptyText }: { text: string; emptyText: string }) {
  const items = splitLines(text);

  if (!items.length) {
    return <p className="text-[12px] leading-[1.65] text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-vintage-cream/10 bg-vintage-navy/40 p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-vintage-cream/60">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState(initialResume);
  const [pdfAction, setPdfAction] = useState<PdfAction>("idle");
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(RESUME_STORAGE_KEY);

      if (storedValue) {
        const storedResume = getStoredResume(storedValue);

        if (storedResume) {
          setResume(storedResume);
        }
      }
    } catch {
      // Ignore storage access issues and continue with the demo data.
    } finally {
      setIsStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    try {
      window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
    } catch {
      // Ignore storage quota or browser privacy issues.
    }
  }, [isStorageReady, resume]);

  function updateResumeField<K extends keyof ResumeData>(field: K, value: ResumeData[K]) {
    setResume((current) => ({ ...current, [field]: value }));
  }

  function updateEntry(
    section: "education" | "experience" | "projects",
    entryId: string,
    field: keyof ResumeEntry,
    value: string,
  ) {
    setResume((current) => ({
      ...current,
      [section]: current[section].map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry,
      ),
    }));
  }

  function addEntry(section: "education" | "experience" | "projects") {
    const nextEntry: ResumeEntry = {
      id: createItemId(section),
      heading: "",
      subheading: "",
      period: "",
      details: "",
    };

    setResume((current) => ({
      ...current,
      [section]: [...current[section], nextEntry],
    }));
  }

  function removeEntry(section: "education" | "experience" | "projects", entryId: string) {
    setResume((current) => ({
      ...current,
      [section]: current[section].filter((entry) => entry.id !== entryId),
    }));
  }

  function updateFact(
    section: "contact" | "personalDetails",
    factId: string,
    field: keyof ResumeFact,
    value: string,
  ) {
    setResume((current) => ({
      ...current,
      [section]: current[section].map((fact) =>
        fact.id === factId ? { ...fact, [field]: value } : fact,
      ),
    }));
  }

  function addFact(section: "contact" | "personalDetails") {
    const prefix = section === "contact" ? "contact" : "personal";
    const nextFact: ResumeFact = {
      id: createItemId(prefix),
      label: "",
      value: "",
    };

    setResume((current) => ({
      ...current,
      [section]: [...current[section], nextFact],
    }));
  }

  function removeFact(section: "contact" | "personalDetails", factId: string) {
    setResume((current) => ({
      ...current,
      [section]: current[section].filter((fact) => fact.id !== factId),
    }));
  }

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setResume((current) => ({
          ...current,
          photoDataUrl: result,
          showPhoto: true,
        }));
      }
    };
    reader.readAsDataURL(selectedFile);
  }

  async function handlePdf(action: Exclude<PdfAction, "idle">) {
    setPdfAction(action);

    try {
      const blob = await createResumePdfBlob(resume);
      const url = URL.createObjectURL(blob);
      const safeName = (resume.name || "resume").trim().replace(/\s+/g, "-").toLowerCase();
      const filename = `${safeName}-resume.pdf`;
      const anchor = document.createElement("a");

      anchor.href = url;

      if (action === "viewing") {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      } else {
        anchor.download = filename;
      }

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, action === "viewing" ? 60000 : 5000);
    } finally {
      setPdfAction("idle");
    }
  }

  const visibleContact = getVisibleFacts(resume.contact);
  const visiblePersonalDetails = getVisibleFacts(resume.personalDetails);
  const isBusy = pdfAction !== "idle";

  function handleReset() {
    setResume(initialResume);

    try {
      window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(initialResume));
    } catch {
      // Ignore storage access issues and still reset in memory.
    }
  }

  return (
    <main className="relative px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-vintage-cream/70 transition-colors hover:text-vintage-cream"
            >
              <Icon icon="solar:arrow-left-linear" />
              Back to portfolio
            </Link>
            <div>
              <p className="badge badge-primary mb-3">Resume Builder</p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-vintage-cream md:text-5xl">
                Build a one-page resume with a live A4 preview.
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-vintage-cream/70">
                Edit the content on the left, review the resume on the right, then open it in the
                browser PDF viewer or download the PDF directly.
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
                icon={pdfAction === "viewing" ? "solar:refresh-linear" : "solar:eye-linear"}
                className={`text-lg ${pdfAction === "viewing" ? "animate-spin" : ""}`}
              />
              {pdfAction === "viewing" ? "Opening PDF..." : "View Resume"}
            </button>
            <button
              onClick={() => handlePdf("downloading")}
              disabled={isBusy}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon
                icon={
                  pdfAction === "downloading" ? "solar:refresh-linear" : "solar:download-linear"
                }
                className={`text-lg ${pdfAction === "downloading" ? "animate-spin" : ""}`}
              />
              {pdfAction === "downloading" ? "Preparing PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[460px_minmax(0,1fr)]">
          <section className="glass rounded-[28px] border border-vintage-cream/15 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-vintage-cream">Resume Details</h2>
                <p className="mt-1 text-sm text-vintage-cream/60">
                  Keep the content concise so the resume stays comfortably on one A4 page.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="rounded-full border border-vintage-cream/15 px-4 py-2 text-sm font-medium text-vintage-cream/70 transition-colors hover:border-vintage-cream/30 hover:text-vintage-cream"
              >
                Reset demo
              </button>
            </div>

            <div className="space-y-6">
              <SectionCard title="Basic Info">
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm text-vintage-cream/80">Full name</span>
                    <input
                      value={resume.name}
                      onChange={(event) => updateResumeField("name", event.target.value)}
                      className="input-field"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-vintage-cream/80">
                      Professional title
                    </span>
                    <input
                      value={resume.title}
                      onChange={(event) => updateResumeField("title", event.target.value)}
                      className="input-field"
                      placeholder="Senior Frontend Developer"
                    />
                  </label>
                </div>
              </SectionCard>

              <SectionCard title="Photo">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-vintage-cream/80">Profile photo</span>
                    {resume.photoDataUrl ? (
                      <button
                        onClick={() =>
                          setResume((current) => ({
                            ...current,
                            photoDataUrl: "",
                            showPhoto: false,
                          }))
                        }
                        className="text-sm text-vintage-cream/60 transition-colors hover:text-vintage-cream"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm text-vintage-cream/80">Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full rounded-lg border border-dashed border-vintage-cream/20 bg-vintage-slate/20 px-4 py-3 text-sm text-vintage-cream/70 file:mr-4 file:rounded-full file:border-0 file:bg-vintage-burgundy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-vintage-burgundy/90"
                    />
                  </label>

                  <ToggleField
                    checked={resume.showPhoto}
                    onChange={(checked) => updateResumeField("showPhoto", checked)}
                    label="Show photo on resume"
                    disabled={!resume.photoDataUrl}
                  />

                  <label className="flex items-center gap-3 text-sm text-vintage-cream/80">
                    <input
                      type="checkbox"
                      checked={resume.photoTopLeft}
                      onChange={(event) => updateResumeField("photoTopLeft", event.target.checked)}
                      disabled={!resume.showPhoto}
                      className="h-4 w-4 rounded border-vintage-cream/30 bg-vintage-navy text-vintage-burgundy"
                    />
                    Place photo on the top-left of the A4 resume
                  </label>
                </div>
              </SectionCard>

              <SectionCard title="About Section">
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm text-vintage-cream/80">Section title</span>
                    <input
                      value={resume.aboutTitle}
                      onChange={(event) => updateResumeField("aboutTitle", event.target.value)}
                      className="input-field"
                      placeholder="About Me"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-vintage-cream/80">About text</span>
                    <textarea
                      value={resume.aboutText}
                      onChange={(event) => updateResumeField("aboutText", event.target.value)}
                      className="input-field min-h-[140px] resize-y"
                      placeholder="Write a concise summary about yourself"
                    />
                  </label>
                </div>
              </SectionCard>

              <SectionCard title="Education">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-vintage-cream/80">Education entries</span>
                  <button onClick={() => addEntry("education")} className="btn-secondary px-4 py-2 text-sm">
                    <Icon icon="solar:add-circle-linear" />
                    Add entry
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.education.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-vintage-cream/10 bg-vintage-slate/20 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-vintage-cream/80">
                          Education {index + 1}
                        </p>
                        {resume.education.length > 1 ? (
                          <button
                            onClick={() => removeEntry("education", entry.id)}
                            className="text-sm text-vintage-cream/60 transition-colors hover:text-vintage-cream"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                      <div className="space-y-3">
                        <input
                          value={entry.heading}
                          onChange={(event) =>
                            updateEntry("education", entry.id, "heading", event.target.value)
                          }
                          className="input-field"
                          placeholder="Degree or course"
                        />
                        <input
                          value={entry.subheading}
                          onChange={(event) =>
                            updateEntry("education", entry.id, "subheading", event.target.value)
                          }
                          className="input-field"
                          placeholder="School or university"
                        />
                        <input
                          value={entry.period}
                          onChange={(event) =>
                            updateEntry("education", entry.id, "period", event.target.value)
                          }
                          className="input-field"
                          placeholder="2020 - 2024"
                        />
                        <textarea
                          value={entry.details}
                          onChange={(event) =>
                            updateEntry("education", entry.id, "details", event.target.value)
                          }
                          className="input-field min-h-[100px] resize-y"
                          placeholder="Highlights or details"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Experience">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-vintage-cream/80">Experience entries</span>
                  <ToggleField
                    checked={resume.showExperience}
                    onChange={(checked) => updateResumeField("showExperience", checked)}
                    label="Include"
                  />
                </div>

                {resume.showExperience ? (
                  <div className="space-y-4">
                    <button onClick={() => addEntry("experience")} className="btn-secondary px-4 py-2 text-sm">
                      <Icon icon="solar:add-circle-linear" />
                      Add entry
                    </button>

                    {resume.experience.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-vintage-cream/10 bg-vintage-slate/20 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-vintage-cream/80">
                            Experience {index + 1}
                          </p>
                          {resume.experience.length > 1 ? (
                            <button
                              onClick={() => removeEntry("experience", entry.id)}
                              className="text-sm text-vintage-cream/60 transition-colors hover:text-vintage-cream"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        <div className="space-y-3">
                          <input
                            value={entry.heading}
                            onChange={(event) =>
                              updateEntry("experience", entry.id, "heading", event.target.value)
                            }
                            className="input-field"
                            placeholder="Job title"
                          />
                          <input
                            value={entry.subheading}
                            onChange={(event) =>
                              updateEntry("experience", entry.id, "subheading", event.target.value)
                            }
                            className="input-field"
                            placeholder="Company name"
                          />
                          <input
                            value={entry.period}
                            onChange={(event) =>
                              updateEntry("experience", entry.id, "period", event.target.value)
                            }
                            className="input-field"
                            placeholder="2023 - Present"
                          />
                          <textarea
                            value={entry.details}
                            onChange={(event) =>
                              updateEntry("experience", entry.id, "details", event.target.value)
                            }
                            className="input-field min-h-[120px] resize-y"
                            placeholder="Use one line per bullet point"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-vintage-cream/60">
                    Experience is currently hidden from the resume.
                  </p>
                )}
              </SectionCard>

              <SectionCard title="Projects">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-vintage-cream/80">Project entries</span>
                  <ToggleField
                    checked={resume.showProjects}
                    onChange={(checked) => updateResumeField("showProjects", checked)}
                    label="Include"
                  />
                </div>

                {resume.showProjects ? (
                  <div className="space-y-4">
                    <button onClick={() => addEntry("projects")} className="btn-secondary px-4 py-2 text-sm">
                      <Icon icon="solar:add-circle-linear" />
                      Add entry
                    </button>

                    {resume.projects.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-vintage-cream/10 bg-vintage-slate/20 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-vintage-cream/80">
                            Project {index + 1}
                          </p>
                          {resume.projects.length > 1 ? (
                            <button
                              onClick={() => removeEntry("projects", entry.id)}
                              className="text-sm text-vintage-cream/60 transition-colors hover:text-vintage-cream"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        <div className="space-y-3">
                          <input
                            value={entry.heading}
                            onChange={(event) =>
                              updateEntry("projects", entry.id, "heading", event.target.value)
                            }
                            className="input-field"
                            placeholder="Project title"
                          />
                          <input
                            value={entry.subheading}
                            onChange={(event) =>
                              updateEntry("projects", entry.id, "subheading", event.target.value)
                            }
                            className="input-field"
                            placeholder="Tech stack or role"
                          />
                          <input
                            value={entry.period}
                            onChange={(event) =>
                              updateEntry("projects", entry.id, "period", event.target.value)
                            }
                            className="input-field"
                            placeholder="2024"
                          />
                          <textarea
                            value={entry.details}
                            onChange={(event) =>
                              updateEntry("projects", entry.id, "details", event.target.value)
                            }
                            className="input-field min-h-[120px] resize-y"
                            placeholder="Use one line per bullet point"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-vintage-cream/60">
                    Projects are optional and currently hidden.
                  </p>
                )}
              </SectionCard>

              <SectionCard title="Skills">
                <div className="space-y-4">
                  <ToggleField
                    checked={resume.showSkills}
                    onChange={(checked) => updateResumeField("showSkills", checked)}
                    label="Include skills"
                  />
                  <label className="block">
                    <span className="mb-2 block text-sm text-vintage-cream/80">
                      One skill per line
                    </span>
                    <textarea
                      value={resume.skillsText}
                      onChange={(event) => updateResumeField("skillsText", event.target.value)}
                      className="input-field min-h-[120px] resize-y"
                      placeholder={"React\nNext.js\nTypeScript"}
                    />
                  </label>
                </div>
              </SectionCard>

              <SectionCard title="Language">
                <div className="space-y-4">
                  <ToggleField
                    checked={resume.showLanguages}
                    onChange={(checked) => updateResumeField("showLanguages", checked)}
                    label="Include languages"
                  />
                  <label className="block">
                    <span className="mb-2 block text-sm text-vintage-cream/80">
                      One language per line
                    </span>
                    <textarea
                      value={resume.languagesText}
                      onChange={(event) => updateResumeField("languagesText", event.target.value)}
                      className="input-field min-h-[110px] resize-y"
                      placeholder={"English\nHindi\nArabic"}
                    />
                  </label>
                </div>
              </SectionCard>

              <SectionCard title="Contact">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-vintage-cream/80">Contact rows</span>
                  <ToggleField
                    checked={resume.showContact}
                    onChange={(checked) => updateResumeField("showContact", checked)}
                    label="Include"
                  />
                </div>

                {resume.showContact ? (
                  <div className="space-y-4">
                    <button onClick={() => addFact("contact")} className="btn-secondary px-4 py-2 text-sm">
                      <Icon icon="solar:add-circle-linear" />
                      Add row
                    </button>
                    {resume.contact.map((fact, index) => (
                      <div
                        key={fact.id}
                        className="rounded-2xl border border-vintage-cream/10 bg-vintage-slate/20 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-vintage-cream/80">
                            Contact {index + 1}
                          </p>
                          {resume.contact.length > 1 ? (
                            <button
                              onClick={() => removeFact("contact", fact.id)}
                              className="text-sm text-vintage-cream/60 transition-colors hover:text-vintage-cream"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        <div className="space-y-3">
                          <input
                            value={fact.label}
                            onChange={(event) =>
                              updateFact("contact", fact.id, "label", event.target.value)
                            }
                            className="input-field"
                            placeholder="Email"
                          />
                          <input
                            value={fact.value}
                            onChange={(event) =>
                              updateFact("contact", fact.id, "value", event.target.value)
                            }
                            className="input-field"
                            placeholder="name@example.com"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-vintage-cream/60">
                    Contact details are optional and currently hidden.
                  </p>
                )}
              </SectionCard>

              <SectionCard title="Personal Details">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-vintage-cream/80">Personal detail rows</span>
                  <ToggleField
                    checked={resume.showPersonalDetails}
                    onChange={(checked) => updateResumeField("showPersonalDetails", checked)}
                    label="Include"
                  />
                </div>

                {resume.showPersonalDetails ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => addFact("personalDetails")}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      <Icon icon="solar:add-circle-linear" />
                      Add row
                    </button>
                    {resume.personalDetails.map((fact, index) => (
                      <div
                        key={fact.id}
                        className="rounded-2xl border border-vintage-cream/10 bg-vintage-slate/20 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-vintage-cream/80">
                            Personal Detail {index + 1}
                          </p>
                          {resume.personalDetails.length > 1 ? (
                            <button
                              onClick={() => removeFact("personalDetails", fact.id)}
                              className="text-sm text-vintage-cream/60 transition-colors hover:text-vintage-cream"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        <div className="space-y-3">
                          <input
                            value={fact.label}
                            onChange={(event) =>
                              updateFact("personalDetails", fact.id, "label", event.target.value)
                            }
                            className="input-field"
                            placeholder="Location"
                          />
                          <input
                            value={fact.value}
                            onChange={(event) =>
                              updateFact("personalDetails", fact.id, "value", event.target.value)
                            }
                            className="input-field"
                            placeholder="Dubai, UAE"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-vintage-cream/60">
                    Personal details are optional and currently hidden.
                  </p>
                )}
              </SectionCard>

              <SectionCard title="Declaration">
                <div className="space-y-4">
                  <ToggleField
                    checked={resume.showDeclaration}
                    onChange={(checked) => updateResumeField("showDeclaration", checked)}
                    label="Include declaration"
                  />

                  {resume.showDeclaration ? (
                    <>
                      <label className="block">
                        <span className="mb-2 block text-sm text-vintage-cream/80">
                          Section title
                        </span>
                        <input
                          value={resume.declarationTitle}
                          onChange={(event) =>
                            updateResumeField("declarationTitle", event.target.value)
                          }
                          className="input-field"
                          placeholder="Declaration"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-vintage-cream/80">
                          Declaration text
                        </span>
                        <textarea
                          value={resume.declarationText}
                          onChange={(event) =>
                            updateResumeField("declarationText", event.target.value)
                          }
                          className="input-field min-h-[120px] resize-y"
                          placeholder="I hereby declare..."
                        />
                      </label>
                    </>
                  ) : (
                    <p className="text-sm text-vintage-cream/60">
                      Declaration is optional and currently hidden.
                    </p>
                  )}
                </div>
              </SectionCard>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-vintage-cream">A4 Preview</h2>
                <p className="mt-1 text-sm text-vintage-cream/60">
                  This preview is sized for a single A4 page.
                </p>
              </div>
              <div className="badge">210mm x 297mm</div>
            </div>

            <div className="overflow-x-auto rounded-[28px] border border-vintage-cream/10 bg-black/10 p-4 shadow-2xl shadow-black/20">
              <div className="mx-auto w-[210mm] min-w-[210mm] bg-white p-[18mm_16mm] text-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
                <header
                  className={`mb-6 border-b-2 border-slate-900 pb-4 ${
                    resume.showPhoto && resume.photoDataUrl && resume.photoTopLeft
                      ? "flex items-start gap-5"
                      : ""
                  }`}
                >
                  {resume.showPhoto && resume.photoDataUrl && resume.photoTopLeft ? (
                    <Image
                      src={resume.photoDataUrl}
                      alt="Resume profile preview"
                      width={129}
                      height={129}
                      unoptimized
                      className="h-[34mm] w-[34mm] rounded-xl border-2 border-slate-200 object-cover"
                    />
                  ) : null}
                  <div>
                    <h1 className="text-[28px] font-extrabold leading-tight tracking-[0.02em]">
                      {resume.name || "Your Name"}
                    </h1>
                    <p className="mt-2 text-[14px] font-bold uppercase tracking-[0.22em] text-[#0b8fb0]">
                      {resume.title || "Your Title"}
                    </p>
                  </div>
                </header>

                <main className="grid grid-cols-[0.95fr_1.25fr] gap-5">
                  <div className="space-y-5">
                    <PreviewSection title={resume.aboutTitle || "About Me"}>
                      <p className="text-[12px] leading-[1.65] text-slate-700">
                        {resume.aboutText || "Write a short professional summary here."}
                      </p>
                    </PreviewSection>

                    {resume.showContact ? (
                      <PreviewSection title="Contact">
                        <FactPreview facts={visibleContact} />
                      </PreviewSection>
                    ) : null}

                    {resume.showPersonalDetails ? (
                      <PreviewSection title="Personal Details">
                        <FactPreview facts={visiblePersonalDetails} />
                      </PreviewSection>
                    ) : null}

                    {resume.showSkills ? (
                      <PreviewSection title="Skills">
                        <TagPreview text={resume.skillsText} emptyText="Add at least one skill." />
                      </PreviewSection>
                    ) : null}

                    {resume.showLanguages ? (
                      <PreviewSection title="Languages">
                        <TagPreview
                          text={resume.languagesText}
                          emptyText="Add at least one language."
                        />
                      </PreviewSection>
                    ) : null}

                    {resume.showDeclaration ? (
                      <PreviewSection title={resume.declarationTitle || "Declaration"}>
                        <p className="text-[12px] leading-[1.65] text-slate-700">
                          {resume.declarationText || "Declaration text goes here."}
                        </p>
                      </PreviewSection>
                    ) : null}
                  </div>

                  <div className="space-y-5">
                    <PreviewSection title="Education">
                      <div className="space-y-4">
                        {resume.education.map((entry) => (
                          <PreviewEntry key={entry.id} entry={entry} />
                        ))}
                      </div>
                    </PreviewSection>

                    {resume.showExperience ? (
                      <PreviewSection title="Experience">
                        <div className="space-y-4">
                          {resume.experience.map((entry) => (
                            <PreviewEntry key={entry.id} entry={entry} />
                          ))}
                        </div>
                      </PreviewSection>
                    ) : null}

                    {resume.showProjects ? (
                      <PreviewSection title="Projects">
                        <div className="space-y-4">
                          {resume.projects.map((entry) => (
                            <PreviewEntry key={entry.id} entry={entry} />
                          ))}
                        </div>
                      </PreviewSection>
                    ) : null}
                  </div>
                </main>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
