import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type ResponseData = {
  message: string;
};

const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
const GITHUB_MODEL = process.env.GITHUB_MODEL?.trim() || "openai/gpt-4.1-mini";
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
const GEMINI_FALLBACK_MODELS = Array.from(
  new Set([GEMINI_MODEL, "gemini-2.0-flash-lite", "gemini-2.0-flash"].filter(Boolean))
);
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 10_000;

const PROFILE_CONTEXT = `
Name: Umar
Role: Full-Stack Software Architect
Experience: 6+ years
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

type AiCallResult =
  | { ok: true; text: string }
  | { ok: false; status: number; details: string };

type ProviderConfig = {
  providerName: string;
  apiKey: string;
  baseURL?: string;
  models: string[];
};

function getOrderedProviders(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  // 1. Groq — most generous free tier, OpenAI-compatible
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey) {
    providers.push({
      providerName: "Groq",
      apiKey: groqKey,
      baseURL: "https://api.groq.com/openai/v1",
      models: ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
    });
  }

  // 2. GitHub Models
  const githubToken = process.env.GITHUB_TOKEN?.trim();
  if (githubToken) {
    providers.push({
      providerName: "GitHub Models",
      apiKey: githubToken,
      baseURL: "https://models.github.ai/inference",
      models: Array.from(new Set([GITHUB_MODEL, "openai/gpt-4.1-mini", "openai/gpt-4o-mini"].filter(Boolean))),
    });
  }

  // 3. OpenAI
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiKey) {
    providers.push({
      providerName: "OpenAI",
      apiKey: openAiKey,
      models: Array.from(new Set([OPENAI_MODEL, "gpt-4.1-mini", "gpt-4o-mini"].filter(Boolean))),
    });
  }

  return providers;
}

async function callProviderModel(
  provider: ProviderConfig,
  model: string,
  message: string
): Promise<AiCallResult> {
  try {
    const client = new OpenAI({
      apiKey: provider.apiKey,
      baseURL: provider.baseURL,
      timeout: REQUEST_TIMEOUT_MS,
    });

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.2,
      max_tokens: 220,
    });

    const content = completion.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content.trim() : "";

    if (!text) {
      return { ok: false, status: 502, details: "Empty provider response." };
    }

    return { ok: true, text };
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error.";
    const status =
      typeof error === "object" && error !== null && "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    return { ok: false, status, details };
  }
}

async function callGemini(apiKey: string, message: string, model = GEMINI_MODEL): Promise<AiCallResult> {
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 220 },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      return { ok: false, status: response.status, details: errBody || response.statusText };
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    if (!text) {
      return { ok: false, status: 502, details: "Empty Gemini response." };
    }

    return { ok: true, text };
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown Gemini error.";
    return { ok: false, status: 500, details };
  }
}

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

  // Try OpenAI-compatible providers in priority order: Groq → GitHub → OpenAI
  for (const provider of getOrderedProviders()) {
    let providerFailed = false;

    for (const model of provider.models) {
      const result = await callProviderModel(provider, model, message);

      if (result.ok) {
        res.status(200).json({ message: result.text });
        return;
      }

      console.error(`${provider.providerName} error (${model}):`, result.status, result.details);

      // Auth failure — skip remaining models for this provider
      if (result.status === 401 || result.status === 403) {
        providerFailed = true;
        break;
      }

      // Rate limited — skip remaining models for this provider, try next provider
      if (result.status === 429) {
        providerFailed = true;
        break;
      }
    }

    if (!providerFailed) {
      // All models in this provider failed with non-retryable errors; try next provider
    }
  }

  // Fallback: Gemini
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    for (const gModel of GEMINI_FALLBACK_MODELS) {
      const result = await callGemini(geminiKey, message, gModel);
      if (result.ok) {
        res.status(200).json({ message: result.text });
        return;
      }
      console.error(`Gemini error (${gModel}):`, result.status, result.details);
      if (result.status === 401 || result.status === 403) break;
    }
  }

  res.status(200).json({
    message: "I'm temporarily unavailable. Please try again in a moment.",
  });
}
