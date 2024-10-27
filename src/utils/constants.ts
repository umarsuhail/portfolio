import bot from "../public/images/bot.jpg";
import web from "../public/images/web.jpg";
import business_2 from "../public/images/business-2.png";
import confidential from "../public/images/confidential.png";

export const texts = {
  about:
    "I am a UI/UX Developer with over 6 years of experience in creating high-performance, user-friendly web applications. I specialize in frontend development using modern JavaScript frameworks like React JS, and I have a strong understanding of the JavaScript ecosystem. My expertise extends to leading product teams and building scalable applications, ensuring seamless user experiences across all devices.",
};
export const skills = [
  { name: "React JS", level: "Expert", icon: "logos:react" },
  { name: "Next JS", level: "Intermediate", icon: "logos:nextjs-icon" },
  { name: "Angular", level: "Intermediate", icon: "logos:angular" },
  { name: "JavaScript (ES6+)", level: "Expert", icon: "logos:javascript" },
  { name: "TypeScript", level: "Intermediate", icon: "logos:typescript-icon" },
  { name: "HTML5", level: "Expert", icon: "logos:html-5" },
  { name: "CSS3", level: "Expert", icon: "logos:css-3" },
  {
    name: "Tailwind CSS",
    level: "Intermediate",
    icon: "logos:tailwindcss-icon",
  },
  { name: "Git", level: "Intermediate", icon: "logos:git-icon" },
  { name: "Redux", level: "Intermediate", icon: "logos:redux" },
  { name: "Node.js", level: "Basic", icon: "logos:nodejs-icon" },
  { name: "MongoDB", level: "Basic", icon: "logos:mongodb-icon" },
];
export const projects = [
  {
    name: "AI CHATBOTS",
    about:
      "I developed AI-powered chatbot interfaces and a real-time monitoring dashboard using React.js, HTML5, and CSS to streamline accident assessment and reporting. These chatbots are designed to assess vehicle damages following accidents through user-friendly chat interactions. The system utilizes AI algorithms to analyze images, reports, and user inputs to evaluate the extent of the damage. The chatbot interface collects essential data from users, and based on AI assessments, it generates a comprehensive damage report. The monitoring dashboard provides real-time insights into the chat interactions, assessment results, and other key metrics, enabling faster and more efficient handling of vehicle assessments after accidents.",
    image: bot,
    stacks: ["React.js,Javascript,HTML,CSS,bootstrap"],
  },

  {
    name: "Loyalty Platform",
    about:
      " I worked on a loyalty app built with Next.js, focusing on creating a robust, high-performance platform to boost customer engagement and retention. The app enables users to earn and redeem loyalty points, access exclusive offers, and monitor their rewards seamlessly. Leveraging Next.js’s server-side rendering capabilities, I optimized load times and ensured a smooth, responsive experience across devices. The app includes features like a user dashboard for tracking points, QR code scanning for quick redemption, and real-time notifications on personalized promotions. Through this project, I enhanced the app’s user experience and contributed to measurable increases in customer retention and engagement rates.",
    image: business_2,
    stacks: ["Next.js,Typescript,HTML,CSS,Tailwind css"],
  },
  {
    name: "Get-Life",
    about:
      "I designed and developed dynamic UI components and pages for GetLife Insurance UK using Gatsby.js, TypeScript, and Tailwind CSS to create a seamless and responsive user experience. The project involved building optimized, reusable components to ensure a consistent look and feel across the site, with a focus on speed, accessibility, and user-friendliness. Leveraging Gatsby’s static site generation capabilities, I improved load times and SEO performance for a fast, secure experience on both desktop and mobile devices. TypeScript was used to enhance code reliability and maintainability, while Tailwind CSS allowed for highly customizable styling, resulting in a visually cohesive design that aligns with the GetLife Insurance brand. The components ranged from interactive forms to user dashboards, and pages were crafted to guide users smoothly through the insurance selection and application process.",
    image: web,
    stacks:["Angular.js,Javascript,HTML,CSS,bootstrap"],
  },

  {
    name: "Confidential",
    about:
      "I designed and developed dynamic UI components and pages for a leading U.S.-based insurance company using React.js, Node.js, Redux, and Bootstrap to create a seamless and responsive user experience. The project involved building optimized, reusable components to ensure a consistent look and feel across the site, focusing on speed, accessibility, and user-friendliness. Leveraging React’s component-based architecture and Node.js for efficient server-side processing, I improved load times and ensured a smooth experience on both desktop and mobile devices. Redux was implemented to manage complex state across the application, ensuring efficient data handling and a cohesive user journey, while Bootstrap allowed for responsive, visually appealing, and customizable styling that aligns with the insurance brand's design language. The components ranged from interactive forms to user dashboards, and the pages were crafted to guide users intuitively through the insurance selection and application process.",
    image: confidential,
    stacks: ["React.js,Redux-saga,HTML,CSS,bootstrap"],
  },
];
