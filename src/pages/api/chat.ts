import type { NextApiRequest, NextApiResponse } from "next";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

type ResponseData = {
  message: string;
};

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";

const PROFILE_CONTEXT = `
Name: Umar
Role: Full-Stack Software Architect
Experience: 8+ years
Core Stack: React, Next.js, TypeScript, JavaScript, Node.js, Redux, Tailwind CSS
Strengths: scalable system design, high-performance frontend architecture, UI/UX focused product delivery
Current Position: Currently working at EFR (Emirates Face Recognition) as an Application Developer
Previous Roles: Development Team Lead at Epixel Solutions, Software Engineer at Aspire Systems, UI Developer at Uvionics Tech
Education: B.Tech in Computer Engineering (2014-2018), KMP College of Engineering
Highlighted Projects: AI Chatbots, Loyalty Platform, Get-Life, Confidential insurance project
`;

const SYSTEM_PROMPT = `You are Umar's portfolio AI assistant.

Rules:
1) Only answer questions about Umar's profile, skills, career, projects, education, or professional goals.
2) If a question is unrelated to Umar, politely refuse and redirect: "I can only help with questions about Umar's profile and work."
3) Keep answers concise, accurate, and professional (2-5 sentences unless user asks for detail).
4) Do not invent facts. If details are missing, clearly say that the information is not available.

Use this profile context as your source of truth:
${PROFILE_CONTEXT}`;

export default async function chat(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    res.status(400).json({ message: "Please enter a message." });
    return;
  }

  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured.");
    res.status(200).json({
      message: "I'm temporarily unavailable. Please try again in a moment.",
    });
    return;
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey });

    const { text } = await generateText({
      model: google(GEMINI_MODEL),
      system: SYSTEM_PROMPT,
      prompt: message,
      temperature: 0.2,
      maxOutputTokens: 220,
    });

    const reply = text.trim();
    res.status(200).json({
      message: reply || "I'm temporarily unavailable. Please try again in a moment.",
    });
  } catch (error) {
    console.error("Gemini error:", error instanceof Error ? error.message : error);
    res.status(200).json({
      message: "I'm temporarily unavailable. Please try again in a moment.",
    });
  }
}
