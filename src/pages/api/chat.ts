import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
const GEMINI_FALLBACK_MODELS = [GEMINI_MODEL, "gemini-1.5-flash", "gemini-1.5-flash-8b"];
const REQUEST_TIMEOUT_MS = 10_000;

const PROFILE_CONTEXT = `
Name: Umar
Role: Full-Stack Software Architect
Experience: 6+ years
Core Stack: React, Next.js, TypeScript, JavaScript, Node.js, Redux, Tailwind CSS
Strengths: scalable system design, high-performance frontend architecture, UI/UX focused product delivery
Current Position: Application Developer at Emirates Face Recognition
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

function getGeminiTextResponse(payload: unknown): string {
  const data = payload as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("\n")
      .trim() ?? ""
  );
}

type GeminiCallResult =
  | { ok: true; text: string }
  | { ok: false; status: number; details: string };

async function callGeminiModel(apiKey: string, model: string, message: string): Promise<GeminiCallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 220,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, status: response.status, details: errorText };
    }

    const data = await response.json();
    const text = getGeminiTextResponse(data);

    if (!text) {
      return { ok: false, status: 502, details: "Empty Gemini response." };
    }

    return { ok: true, text };
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown Gemini request error.";
    return { ok: false, status: 500, details };
  } finally {
    clearTimeout(timeout);
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

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    res.status(500).json({
      message: "Gemini is not configured yet. Add GEMINI_API_KEY in your .env file.",
    });
    return;
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    res.status(400).json({ message: "Please enter a message." });
    return;
  }

  try {
    const models = Array.from(new Set(GEMINI_FALLBACK_MODELS.filter(Boolean)));
    let lastError: GeminiCallResult | null = null;

    for (const model of models) {
      const result = await callGeminiModel(apiKey, model, message);
      if (result.ok) {
        res.status(200).json({ message: result.text });
        return;
      }

      lastError = result;
      console.error(`Gemini API error (${model}):`, result.status, result.details);

      if (result.status === 429) {
        break;
      }
    }

    if (lastError?.status === 429) {
      res.status(200).json({
        message: "Gemini quota/rate limit reached for this API key or project. Please enable billing/increase quota, then retry. I can continue helping with Umar's profile and work as soon as quota is available.",
      });
      return;
    }

    if (lastError?.status === 401 || lastError?.status === 403) {
      res.status(500).json({
        message: "Gemini authentication failed. Please verify the API key permissions and restrictions.",
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
