import bot from "../public/images/bot.jpg";
import web from "../public/images/web.jpg";
import business_2 from "../public/images/business-2.png";
import confidential from "../public/images/confidential.png";

export const texts = {
  about:
    "Lead Frontend Engineer with 7+ years building scalable React & Next.js applications at Emirates Face Recognition (EFR), UAE. Specialising in UI/UX design, frontend architecture, TypeScript, and performance optimisation — available for senior engineering roles.",
};

export const skills = [
  { name: "React JS", level: "Expert", icon: "logos:react" },
  { name: "Next JS", level: "Expert", icon: "logos:nextjs-icon" },
  { name: "TypeScript", level: "Expert", icon: "logos:typescript-icon" },
  { name: "JavaScript", level: "Expert", icon: "logos:javascript" },
  { name: "HTML5", level: "Expert", icon: "logos:html-5" },
  { name: "CSS3", level: "Expert", icon: "logos:css-3" },
  { name: "Tailwind CSS", level: "Expert", icon: "logos:tailwindcss-icon" },
  { name: "Redux", level: "Expert", icon: "logos:redux" },
  { name: "Node.js", level: "Intermediate", icon: "logos:nodejs-icon" },
  { name: "Material-UI", level: "Expert", icon: "logos:material-ui" },
  { name: "Git", level: "Intermediate", icon: "logos:git-icon" },
  { name: "Jenkins", level: "Intermediate", icon: "logos:jenkins" },
];

export const projects = [
  {
    name: "AI CHATBOTS",
    about:
      "I developed AI-powered chatbot interfaces and a real-time monitoring dashboard using React.js, HTML5, and CSS to streamline accident assessment and reporting.",
    image: bot,
    stacks: ["React.js", "Javascript", "HTML", "CSS", "bootstrap"],
  },
  {
    name: "Loyalty Platform",
    about:
      "I worked on a loyalty app built with Next.js, focusing on creating a robust, high-performance platform to boost customer engagement and retention.",
    image: business_2,
    stacks: ["Next.js", "Typescript", "HTML", "CSS", "Tailwind css"],
  },
  {
    name: "Get-Life",
    about:
      "I designed and developed dynamic UI components and pages for GetLife Insurance UK using Gatsby.js, TypeScript, and Tailwind CSS.",
    image: web,
    stacks: ["Angular.js", "Javascript", "HTML", "CSS", "bootstrap"],
  },
  {
    name: "Confidential",
    about:
      "I designed and developed dynamic UI components and pages for a leading U.S.-based insurance company using React.js, Node.js, Redux, and Bootstrap.",
    image: confidential,
    stacks: ["React.js", "Redux-saga", "HTML", "CSS", "bootstrap"],
  },
];

export const about_me =
  "Lead Frontend Engineer with 7+ years of hands-on experience building high-performance, scalable web applications. Currently at Emirates Face Recognition (EFR) in UAE as an Application Developer, leading React component architecture and performance optimisation. Previously Development Team Lead at Epixel Solutions, Software Engineer at Aspire Systems, and UI Developer at Uvionics Tech. Deep expertise across the full React ecosystem — Next.js, TypeScript, Redux Toolkit, Tailwind CSS, and modern CI/CD pipelines. Equally fluent in UI/UX design with proficiency in Figma and Adobe Creative Suite, enabling seamless design-to-development delivery.";

export const resumeUrl =
  process.env.NEXT_PUBLIC_RESUME_URL?.trim() || "/umar-suhail-resume-2026.pdf";
