// ── Types (mirror page.tsx) ───────────────────────────────────────────────────

export interface ResumeEntry {
  id: string;
  heading: string;
  subheading: string;
  period: string;
  details: string;
}

export interface ResumeFact {
  id: string;
  label: string;
  value: string;
}

export interface ResumeData {
  template: "sidebar" | "professional" | "modern";
  fontFamily: "roboto" | "lato" | "raleway" | "playfair" | "merriweather";
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
  photoDataUrl: string;
  education: ResumeEntry[];
  experience: ResumeEntry[];
  projects: ResumeEntry[];
  contact: ResumeFact[];
  personalDetails: ResumeFact[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sl(value: string): string[] {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function vf(facts: ResumeFact[]): ResumeFact[] {
  return facts.filter((f) => f.label.trim() || f.value.trim());
}

const FONT_CSS: Record<string, string> = {
  roboto: "'Roboto', sans-serif",
  lato: "'Lato', sans-serif",
  raleway: "'Raleway', sans-serif",
  playfair: "'Playfair Display', serif",
  merriweather: "'Merriweather', serif",
};

const FONT_GOOGLE: Record<string, string> = {
  roboto: "Roboto:wght@400;700",
  lato: "Lato:wght@400;700",
  raleway: "Raleway:wght@400;700",
  playfair: "Playfair+Display:wght@400;700",
  merriweather: "Merriweather:wght@400;700",
};

// ── Shared component helpers ──────────────────────────────────────────────────

/** Matches <ResumeSection accent="slate"> */
function sectionH(title: string, content: string, accent: "slate" | "navy" = "slate"): string {
  const cls =
    accent === "navy"
      ? "border-b border-b-[#161e2e]/20 border-l-[3px] border-l-[#161e2e] pl-[2.5mm] pb-[2mm] text-[12px] font-black uppercase tracking-[0.14em] text-[#161e2e]"
      : "border-b border-b-slate-200 border-l-[3px] border-l-slate-700 pl-[2.5mm] pb-[2mm] text-[12px] font-black uppercase tracking-[0.14em] text-slate-800";
  return `<section class="space-y-[3.5mm] break-inside-avoid" style="break-inside: avoid-page; page-break-inside: avoid;"><h2 class="${cls}">${esc(title)}</h2>${content}</section>`;
}

/** Matches <EntryBlock> */
function entryH(entry: ResumeEntry, accentHeading = false): string {
  const bullets = [
    ...(entry.subheading ? [entry.subheading] : []),
    ...sl(entry.details),
    ...(entry.period ? [entry.period] : []),
  ];
  const hCls = `text-[12.5px] font-extrabold uppercase tracking-[0.04em] ${accentHeading ? "text-[#161e2e]" : "text-slate-900"}`;
  const bulletsHtml = bullets
    .map(
      (line) =>
        `<div class="flex items-start gap-[2.5mm] text-[12.5px] leading-[1.8] text-slate-700">` +
        `<span class="mt-[3px] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-slate-400"></span>` +
        `<span>${esc(line)}</span></div>`,
    )
    .join("");
  return (
    `<article class="space-y-[2mm] break-inside-avoid" style="break-inside: avoid-page; page-break-inside: avoid;">` +
    `<div class="flex items-start justify-between gap-2"><h3 class="${hCls}">${esc(entry.heading || "Untitled item")}</h3></div>` +
    (bullets.length > 0 ? `<div class="space-y-[2mm]">${bulletsHtml}</div>` : "") +
    `</article>`
  );
}

// ── Classic (Sidebar) template ────────────────────────────────────────────────

function classicHtml(resume: ResumeData): string {
  const vc = vf(resume.contact);
  const vp = vf(resume.personalDetails);

  // Left sidebar
  let left = "";

  if (resume.showPhoto && resume.photoDataUrl) {
    left += `<div class="flex justify-center"><img src="${resume.photoDataUrl}" class="h-[57mm] w-[46mm] rounded-sm border border-slate-200 object-cover object-top shadow-sm" /></div>`;
  }

  if (resume.showContact && vc.length > 0) {
    left += sectionH(
      "Contact",
      `<div class="space-y-[3mm]">${vc.map((f) => `<p class="break-all text-[12.5px] leading-[2] text-slate-700">${esc(f.value)}</p>`).join("")}</div>`,
    );
  }

  if (resume.showSkills && sl(resume.skillsText).length > 0) {
    left += sectionH(
      "Skills",
      `<div class="flex flex-wrap gap-[2mm]">${sl(resume.skillsText)
        .map((item) => `<span class="inline-block rounded-md bg-slate-100 px-[3mm] leading-[5.5mm] text-[11px] text-slate-700">${esc(item)}</span>`)
        .join("")}</div>`,
    );
  }

  if (resume.showLanguages && sl(resume.languagesText).length > 0) {
    left += sectionH(
      "Language",
      `<div class="flex flex-wrap gap-[2mm]">${sl(resume.languagesText)
        .map((item) => `<span class="inline-block rounded-md bg-slate-100 px-[3mm] leading-[5.5mm] text-[11px] text-slate-700">${esc(item)}</span>`)
        .join("")}</div>`,
    );
  }

  if (resume.showPersonalDetails && vp.length > 0) {
    left += sectionH(
      "Personal Details",
      `<div class="space-y-[3mm]">${vp
        .map(
          (f) =>
            `<p class="text-[12.5px] leading-[2] text-slate-700">${f.label ? `<span class="font-bold text-slate-800">${esc(f.label)}:</span> ` : ""}${esc(f.value)}</p>`,
        )
        .join("")}</div>`,
    );
  }

  // Right column
  let right =
    `<div class="border-b-2 border-slate-800 pb-[3mm]">` +
    `<h1 class="text-[30px] font-black uppercase leading-none tracking-[0.06em] text-slate-900">${esc(resume.name || "Your Name")}</h1>` +
    (resume.title ? `<p class="mt-[2mm] text-[12.5px] font-semibold uppercase tracking-[0.2em] text-slate-500">${esc(resume.title)}</p>` : "") +
    `</div>`;

  right += sectionH(
    resume.aboutTitle || "Profile Summary",
    `<p class="text-justify text-[13px] leading-[2] text-slate-700">${esc(resume.aboutText || "Write a short summary here.")}</p>`,
  );

  right += sectionH(
    "Education",
    `<div class="space-y-[5mm]">${resume.education
      .map((e) => `<div class="border-l-2 border-slate-200 pl-[3mm]">${entryH(e)}</div>`)
      .join("")}</div>`,
  );

  if (resume.showExperience && resume.experience.length > 0) {
    right += sectionH(
      "Experience",
      `<div class="space-y-[5mm]">${resume.experience
        .map((e) => `<div class="border-l-2 border-slate-200 pl-[3mm]">${entryH(e)}</div>`)
        .join("")}</div>`,
    );
  }

  if (resume.showProjects && resume.projects.length > 0) {
    right += sectionH(
      "Projects",
      `<div class="space-y-[5mm]">${resume.projects
        .map((e) => `<div class="border-l-2 border-slate-200 pl-[3mm]">${entryH(e)}</div>`)
        .join("")}</div>`,
    );
  }

  if (resume.showCertifications && sl(resume.certificationsText).length > 0) {
    right += sectionH(
      "Certifications",
      `<div class="flex flex-wrap gap-[2mm]">${sl(resume.certificationsText)
        .map((item) => `<span class="inline-block rounded-md bg-slate-100 px-[3mm] leading-[5.5mm] text-[11px] text-slate-700">${esc(item)}</span>`)
        .join("")}</div>`,
    );
  }

  if (resume.showAchievements && sl(resume.achievementsText).length > 0) {
    right += sectionH(
      "Achievements",
      `<div class="space-y-[2mm]">${sl(resume.achievementsText)
        .map(
          (item) =>
            `<div class="flex items-start gap-[2.5mm] text-[12.5px] leading-[1.8] text-slate-700">` +
            `<span class="mt-[3px] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-slate-400"></span>` +
            `<span>${esc(item)}</span></div>`,
        )
        .join("")}</div>`,
    );
  }

  if (resume.showDeclaration) {
    right += sectionH(
      resume.declarationTitle || "Declaration",
      `<p class="text-justify text-[12.5px] leading-[1.75] text-slate-700">${esc(resume.declarationText || "")}</p>`,
    );
  }

  return (
    `<div class="mx-auto min-h-[297mm] w-[210mm] min-w-[210mm] bg-white text-slate-900">` +
    `<div class="flex min-h-[297mm]">` +
    `<div class="w-[74mm] shrink-0 flex flex-col gap-[8mm] border-r border-slate-200 bg-slate-50 px-[5.5mm] py-[9mm]">${left}</div>` +
    `<div class="flex flex-col gap-[7mm] min-w-0 px-[9mm] pt-[18mm] pb-[8mm]">${right}</div>` +
    `</div></div>`
  );
}

// ── Professional (ATS) template ───────────────────────────────────────────────

function atsSectionH(title: string, content: string): string {
  return (
    `<section class="space-y-[3.5mm] break-inside-avoid" style="break-inside: avoid-page; page-break-inside: avoid;">` +
    `<h2 class="border-b border-b-slate-300 border-l-[3px] border-l-slate-700 pb-[1.5mm] pl-[2.5mm] text-[12px] font-black uppercase tracking-[0.16em] text-slate-900">${esc(title)}</h2>` +
    content +
    `</section>`
  );
}

function professionalHtml(resume: ResumeData): string {
  const vc = vf(resume.contact);
  const showPhoto = resume.showPhoto && resume.photoDataUrl;

  const contactLine =
    vc.length > 0
      ? `<p class="mt-[3mm] text-[11px] text-slate-500">${esc(vc.map((f) => f.value).join("   •   "))}</p>`
      : "";

  let header = "";
  if (showPhoto) {
    header =
      `<div class="flex items-center gap-[6mm]">` +
      `<div class="flex-1 text-left">` +
      `<h1 class="text-[30px] font-black uppercase tracking-[0.08em] text-slate-900 leading-none">${esc(resume.name || "Your Name")}</h1>` +
      (resume.title ? `<p class="mt-[2mm] text-[12px] font-semibold uppercase tracking-[0.25em] text-slate-500">${esc(resume.title)}</p>` : "") +
      contactLine +
      `</div>` +
      `<img src="${resume.photoDataUrl}" class="h-[30mm] w-[26mm] shrink-0 rounded-sm border border-slate-200 object-cover object-top shadow-sm" />` +
      `</div>`;
  } else {
    header =
      `<div class="text-center">` +
      `<h1 class="text-[30px] font-black uppercase tracking-[0.08em] text-slate-900 leading-none">${esc(resume.name || "Your Name")}</h1>` +
      (resume.title ? `<p class="mt-[2mm] text-[12px] font-semibold uppercase tracking-[0.25em] text-slate-500">${esc(resume.title)}</p>` : "") +
      contactLine +
      `</div>`;
  }
  header += `<div class="mx-auto mt-[3mm] h-[2px] bg-slate-900"></div>`;

  let content = "";

  if (resume.aboutText) {
    content += atsSectionH(
      resume.aboutTitle || "Profile Summary",
      `<p class="text-justify text-[11.5px] leading-[1.75] text-slate-700">${esc(resume.aboutText)}</p>`,
    );
  }

  if (resume.education.length > 0) {
    content += atsSectionH(
      "Education",
      `<div class="space-y-[3.5mm]">${resume.education
        .map((entry) => {
          const bullets = [
            ...(entry.subheading ? [entry.subheading] : []),
            ...sl(entry.details),
            ...(entry.period ? [entry.period] : []),
          ];
          return (
            `<article class="space-y-[1.5mm] border-l-2 border-slate-200 pl-[3mm]">` +
            `<h3 class="text-[12px] font-extrabold uppercase tracking-[0.04em] text-slate-900">${esc(entry.heading)}</h3>` +
            (bullets.length > 0
              ? `<div class="space-y-[1mm]">${bullets
                  .map(
                    (l) =>
                      `<div class="flex items-start gap-[2mm] text-[11px] leading-[1.65] text-slate-700">` +
                      `<span class="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400"></span>` +
                      `<span>${esc(l)}</span></div>`,
                  )
                  .join("")}</div>`
              : "") +
            `</article>`
          );
        })
        .join("")}</div>`,
    );
  }

  if (resume.showExperience && resume.experience.length > 0) {
    content += atsSectionH(
      "Work Experience",
      `<div class="space-y-[3.5mm]">${resume.experience
        .map(
          (entry) =>
            `<article class="space-y-[1.5mm] border-l-2 border-slate-200 pl-[3mm]">` +
            `<div class="flex items-start justify-between">` +
            `<h3 class="text-[12px] font-extrabold text-slate-900">${esc(entry.heading)}</h3>` +
            (entry.period ? `<span class="shrink-0 text-[11px] text-slate-500">${esc(entry.period)}</span>` : "") +
            `</div>` +
            (entry.subheading ? `<p class="text-[11px] italic text-slate-500">${esc(entry.subheading)}</p>` : "") +
            (sl(entry.details).length > 0
              ? `<div class="space-y-[1mm]">${sl(entry.details)
                  .map(
                    (l) =>
                      `<div class="flex items-start gap-[2mm] text-[11px] leading-[1.65] text-slate-700">` +
                      `<span class="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400"></span>` +
                      `<span>${esc(l)}</span></div>`,
                  )
                  .join("")}</div>`
              : "") +
            `</article>`,
        )
        .join("")}</div>`,
    );
  }

  if (resume.showSkills && sl(resume.skillsText).length > 0) {
    content += atsSectionH(
      "Skills",
      `<div class="space-y-[1.5mm]">${sl(resume.skillsText)
        .map(
          (item) =>
            `<div class="flex items-start gap-[2mm] text-[11px] leading-[1.65] text-slate-700">` +
            `<span class="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400"></span>` +
            `<span>${esc(item)}</span></div>`,
        )
        .join("")}</div>`,
    );
  }

  if (resume.showLanguages && sl(resume.languagesText).length > 0) {
    content += atsSectionH(
      "Languages",
      `<div class="space-y-[1.5mm]">${sl(resume.languagesText)
        .map(
          (item) =>
            `<div class="flex items-start gap-[2mm] text-[11px] leading-[1.65] text-slate-700">` +
            `<span class="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400"></span>` +
            `<span>${esc(item)}</span></div>`,
        )
        .join("")}</div>`,
    );
  }

  if (resume.showCertifications && sl(resume.certificationsText).length > 0) {
    content += atsSectionH(
      "Certifications",
      `<div class="space-y-[1.5mm]">${sl(resume.certificationsText)
        .map(
          (item) =>
            `<div class="flex items-start gap-[2mm] text-[11px] leading-[1.65] text-slate-700">` +
            `<span class="mt-[3px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-slate-400"></span>` +
            `<span>${esc(item)}</span></div>`,
        )
        .join("")}</div>`,
    );
  }

  if (resume.showPersonalDetails && vf(resume.personalDetails).length > 0) {
    content += atsSectionH(
      "Personal Information",
      `<div class="flex flex-wrap gap-x-[8mm] gap-y-[1.5mm]">${vf(resume.personalDetails)
        .map(
          (f) =>
            `<p class="text-[11px] text-slate-700">${f.label ? `<span class="font-bold">${esc(f.label)}:</span> ` : ""}${esc(f.value)}</p>`,
        )
        .join("")}</div>`,
    );
  }

  if (resume.showDeclaration && resume.declarationText) {
    content += atsSectionH(
      resume.declarationTitle || "Declaration",
      `<p class="text-justify text-[11.5px] leading-[1.75] text-slate-700">${esc(resume.declarationText)}</p>`,
    );
  }

  return (
    `<div class="mx-auto min-h-[297mm] w-[210mm] min-w-[210mm] flex flex-col bg-white px-[15mm] py-[12mm] text-slate-900">` +
    `<div class="mb-[6mm] shrink-0">${header}</div>` +
    `<div class="flex flex-col gap-[6mm]">${content}</div>` +
    `</div>`
  );
}

// ── Modern Bold template ──────────────────────────────────────────────────────

function modernSidebarH(title: string, content: string): string {
  return (
    `<section class="space-y-[3.5mm] break-inside-avoid" style="break-inside: avoid-page; page-break-inside: avoid;">` +
    `<h2 class="border-b border-b-[#161e2e]/20 border-l-[3px] border-l-[#161e2e] pb-[1.5mm] pl-[2mm] text-[11.5px] font-black uppercase tracking-[0.14em] text-[#161e2e]">${esc(title)}</h2>` +
    content +
    `</section>`
  );
}

function modernMainH(title: string, content: string): string {
  return (
    `<section class="space-y-[3.5mm] break-inside-avoid" style="break-inside: avoid-page; page-break-inside: avoid;">` +
    `<h2 class="border-b-[2px] border-b-[#161e2e] border-l-[3px] border-l-[#161e2e] pb-[1.5mm] pl-[2mm] text-[12.5px] font-black uppercase tracking-[0.14em] text-[#161e2e]">${esc(title)}</h2>` +
    content +
    `</section>`
  );
}

function modernHtml(resume: ResumeData): string {
  const vc = vf(resume.contact);
  const vp = vf(resume.personalDetails);

  // Header
  let header = "";
  if (resume.showPhoto && resume.photoDataUrl) {
    header += `<img src="${resume.photoDataUrl}" class="h-[36mm] w-[32mm] shrink-0 rounded-sm border border-white/20 object-cover object-top shadow-md" />`;
  }
  header +=
    `<div class="min-w-0">` +
    `<h1 class="text-[24px] font-black uppercase leading-none tracking-[0.06em] text-white">${esc(resume.name || "Your Name")}</h1>` +
    (resume.title ? `<p class="mt-[2mm] text-[11px] font-light uppercase tracking-[0.25em] text-white/60">${esc(resume.title)}</p>` : "") +
    (vc.length > 0 ? `<p class="mt-[3mm] break-all text-[10px] leading-[1.7] text-white/50">${esc(vc.map((f) => f.value).join("  ·  "))}</p>` : "") +
    `</div>`;

  // Left sidebar
  let sidebar = "";
  if (resume.showSkills && sl(resume.skillsText).length > 0) {
    sidebar += modernSidebarH(
      "Skills",
      `<div class="flex flex-wrap gap-[1.5mm]">${sl(resume.skillsText)
        .map((item) => `<span class="inline-block rounded-md bg-[#161e2e]/10 px-[2.5mm] leading-[5mm] text-[10.5px] text-[#161e2e]">${esc(item)}</span>`)
        .join("")}</div>`,
    );
  }
  if (resume.showLanguages && sl(resume.languagesText).length > 0) {
    sidebar += modernSidebarH(
      "Language",
      `<div class="flex flex-wrap gap-[1.5mm]">${sl(resume.languagesText)
        .map((item) => `<span class="inline-block rounded-md bg-[#161e2e]/10 px-[2.5mm] leading-[5mm] text-[10.5px] text-[#161e2e]">${esc(item)}</span>`)
        .join("")}</div>`,
    );
  }
  if (resume.showCertifications && sl(resume.certificationsText).length > 0) {
    sidebar += modernSidebarH(
      "Certifications",
      `<div class="flex flex-wrap gap-[1.5mm]">${sl(resume.certificationsText)
        .map((item) => `<span class="inline-block rounded-md bg-[#161e2e]/10 px-[2.5mm] leading-[5mm] text-[10.5px] text-[#161e2e]">${esc(item)}</span>`)
        .join("")}</div>`,
    );
  }
  if (resume.showPersonalDetails && vp.length > 0) {
    sidebar += modernSidebarH(
      "Personal Details",
      `<div class="space-y-[2mm]">${vp
        .map(
          (f) =>
            `<p class="text-[11px] leading-[1.6] text-slate-700">${f.label ? `<span class="font-bold text-[#161e2e]">${esc(f.label)}:</span> ` : ""}${esc(f.value)}</p>`,
        )
        .join("")}</div>`,
    );
  }

  // Right main
  let main = "";
  if (resume.aboutText) {
    main += modernMainH(
      resume.aboutTitle || "Profile Summary",
      `<p class="text-justify text-[11.5px] leading-[1.75] text-slate-700">${esc(resume.aboutText)}</p>`,
    );
  }
  if (resume.education.length > 0) {
    main += modernMainH(
      "Education",
      `<div class="space-y-[4mm]">${resume.education
        .map((e) => `<div class="border-l-2 border-[#161e2e]/20 pl-[3mm]">${entryH(e, true)}</div>`)
        .join("")}</div>`,
    );
  }
  if (resume.showExperience && resume.experience.length > 0) {
    main += modernMainH(
      "Experience",
      `<div class="space-y-[4mm]">${resume.experience
        .map((e) => `<div class="border-l-2 border-[#161e2e]/20 pl-[3mm]">${entryH(e, true)}</div>`)
        .join("")}</div>`,
    );
  }
  if (resume.showProjects && resume.projects.length > 0) {
    main += modernMainH(
      "Projects",
      `<div class="space-y-[4mm]">${resume.projects
        .map((e) => `<div class="border-l-2 border-[#161e2e]/20 pl-[3mm]">${entryH(e, true)}</div>`)
        .join("")}</div>`,
    );
  }
  if (resume.showDeclaration && resume.declarationText) {
    main += modernMainH(
      resume.declarationTitle || "Declaration",
      `<p class="text-justify text-[11.5px] leading-[1.75] text-slate-700">${esc(resume.declarationText)}</p>`,
    );
  }

  return (
    `<div class="mx-auto min-h-[297mm] w-[210mm] min-w-[210mm] flex flex-col bg-white text-slate-900">` +
    `<div class="flex shrink-0 min-h-[46mm] items-center gap-[5mm] bg-[#161e2e] px-[7mm] py-[5mm]">${header}</div>` +
    `<div class="flex min-h-[251mm] items-stretch">` +
    `<div class="w-[74mm] shrink-0 flex flex-col gap-[8mm] border-r border-slate-200 bg-[#f3f5f7] px-[5.5mm] py-[8mm]">${sidebar}</div>` +
    `<div class="flex flex-col gap-[7mm] bg-white px-[7mm] py-[8mm]">${main}</div>` +
    `</div></div>`
  );
}

// ── Page wrapper ──────────────────────────────────────────────────────────────

export function generateResumeHtml(resume: ResumeData): string {
  const fontParam = FONT_GOOGLE[resume.fontFamily] ?? FONT_GOOGLE.roboto;
  const fontFamily = FONT_CSS[resume.fontFamily] ?? FONT_CSS.roboto;

  const bodyHtml =
    resume.template === "professional"
      ? professionalHtml(resume)
      : resume.template === "modern"
        ? modernHtml(resume)
        : classicHtml(resume);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=${fontParam}&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4; margin: 0; }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box;
    }
    body { margin: 0; padding: 0; background: #fff; font-family: ${fontFamily}; }
    .break-inside-avoid { break-inside: avoid-page; page-break-inside: avoid; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}
