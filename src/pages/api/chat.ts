import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type ResponseData = {
  message: string;
};

const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
const OPENAI_FALLBACK_MODELS = [OPENAI_MODEL, "gpt-4.1-mini", "gpt-4o-mini"];
const GITHUB_MODEL = process.env.GITHUB_MODEL?.trim() || "openai/gpt-4.1-mini";
const GITHUB_FALLBACK_MODELS = [GITHUB_MODEL, "openai/gpt-4.1-mini", "openai/gpt-4o-mini"];
const GITHUB_MODELS_BASE_URL = "https://models.github.ai/inference";
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

function getTextContentFromResponse(content: unknown): string {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (
          typeof part === "object" &&
          part !== null &&
          "type" in part &&
          "text" in part &&
          (part as { type?: unknown }).type === "text"
        ) {
          return String((part as { text?: unknown }).text ?? "");
        }

        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}

type ProviderConfig = {
  providerName: "OpenAI" | "GitHub Models";
  apiKey: string;
  baseURL?: string;
  models: string[];
};

function getProviderConfig(): ProviderConfig | null {
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiApiKey) {
    return {
      providerName: "OpenAI",
      apiKey: openAiApiKey,
      models: Array.from(new Set(OPENAI_FALLBACK_MODELS.filter(Boolean))),
    };
  }

  const githubToken = process.env.GITHUB_TOKEN?.trim();
  if (githubToken) {
    return {
      providerName: "GitHub Models",
      apiKey: githubToken,
      baseURL: GITHUB_MODELS_BASE_URL,
      models: Array.from(new Set(GITHUB_FALLBACK_MODELS.filter(Boolean))),
    };
  }

  return null;
}

async function callProviderModel(
  providerConfig: ProviderConfig,
  model: string,
  message: string
): Promise<AiCallResult> {
  try {
    const client = new OpenAI({
      apiKey: providerConfig.apiKey,
      baseURL: providerConfig.baseURL,
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

    const text = getTextContentFromResponse(completion.choices?.[0]?.message?.content);

    if (!text) {
      return { ok: false, status: 502, details: "Empty provider response." };
    }

    return { ok: true, text };
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown provider request error.";
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
        ? ((error as { status: number }).status ?? 500)
        : 500;
    return { ok: false, status, details };
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

  const providerConfig = getProviderConfig();
  if (!providerConfig) {
    res.status(500).json({
      message:
        "AI provider is not configured yet. Add OPENAI_API_KEY or GITHUB_TOKEN in your environment variables.",
    });
    return;
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    res.status(400).json({ message: "Please enter a message." });
    return;
  }

  try {
    let lastError: AiCallResult | null = null;

    for (const model of providerConfig.models) {
      const result = await callProviderModel(providerConfig, model, message);
      if (result.ok) {
        res.status(200).json({ message: result.text });
        return;
      }

      lastError = result;
      console.error(`${providerConfig.providerName} API error (${model}):`, result.status, result.details);

      if (result.status === 429) {
        break;
      }
    }

    if (lastError?.status === 429) {
      res.status(200).json({
        message:
          "Rate limit reached for the current AI provider account. Please retry shortly or switch provider credentials.",
      });
      return;
    }

    if (lastError?.status === 401 || lastError?.status === 403) {
      res.status(500).json({
        message:
          "AI provider authentication failed. Please verify OPENAI_API_KEY or GITHUB_TOKEN permissions and restrictions.",
      });
      return;
    }

    res.status(200).json({
      message: "I can only help with questions about Umar's profile and work.",
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    res.status(200).json({
      message: "I can only help with questions about Umar's profile and work.",
    });
  }
}
