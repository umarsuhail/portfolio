import bot from "../public/images/bot.jpg";
import web from "../public/images/web.jpg";
import business_2 from "../public/images/business-2.png";
import confidential from "../public/images/confidential.png";

export const texts = {
  about:
    "Software developer from India, based in Dubai, UAE — Lead Frontend Engineer with 7+ years building scalable React & Next.js applications at Emirates Face Recognition (EFR). Specialising in UI/UX design, TypeScript, and frontend architecture.",
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
  "I'm Umar Suhail, a software developer from India currently based in Dubai, UAE. As a Lead Frontend Engineer with 7+ years of experience, I build high-performance web applications at Emirates Face Recognition (EFR), Dubai. My career spans UI Developer at Uvionics Tech (India), Software Engineer at Aspire Systems (India), Development Team Lead at Epixel Solutions (India), and now Application Developer at EFR (UAE). I specialise in React, Next.js, TypeScript, Redux Toolkit, Tailwind CSS, and UI/UX design with Figma and Adobe Creative Suite.";

export const resumeUrl =
  process.env.NEXT_PUBLIC_RESUME_URL?.trim() || "/umar-suhail-resume-2026.pdf";
