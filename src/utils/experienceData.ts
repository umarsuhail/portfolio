// Edit this file to update your work experience details.
// Career start: August 2018. Update `CAREER_START_DATE` if needed.

export const CAREER_START_DATE = new Date("2018-08-01");

export function getYearsOfExperience(): number {
  const now = new Date();
  const years =
    (now.getTime() - CAREER_START_DATE.getTime()) /
    (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years);
}

export const experiences = [
  {
    title: "Application Developer",
    company: "Emirates Face Recognition",
    location: "Abu Dhabi, United Arab Emirates",
    period: "FEB 2025 - Present",
    description:
      "Building AI-powered face recognition systems and enterprise dashboards for biometric solutions.",
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
    description:
      "Led frontend development team building MLM software solutions and enterprise web applications.",
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
    description:
      "Developed enterprise web applications and customer-facing solutions for global clients.",
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
    description:
      "Started career building user interfaces and interactive web experiences for various clients.",
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
