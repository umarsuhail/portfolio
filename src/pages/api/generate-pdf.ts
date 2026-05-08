import type { NextApiRequest, NextApiResponse } from "next";
import { generateResumeHtml } from "@/lib/resume-html";

// Allow large bodies (base64 photo can be several MB)
export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" },
    responseLimit: "20mb",
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const html = generateResumeHtml(req.body);

    // Dynamic import keeps Puppeteer out of client bundles
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    try {
      const page = await browser.newPage();

      // A4 viewport at 96 dpi
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

      // setContent + networkidle0 waits for Tailwind CDN + Google Fonts to load
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 30_000,
      });

      // Wait for web fonts to finish rendering
      await page.evaluate(() => document.fonts.ready);

      // Give Tailwind CDN's JIT a moment to process all arbitrary-value classes
      await new Promise<void>((r) => setTimeout(r, 400));

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true, // required for sidebar/header backgrounds
        margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
        preferCSSPageSize: true,
      });

      res.setHeader("Content-Type", "application/pdf");
      // "inline" so the browser opens it in the PDF viewer modal; download is triggered client-side
      res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');
      return res.status(200).send(Buffer.from(pdfBuffer));
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error("[generate-pdf]", err);
    return res.status(500).json({ error: "PDF generation failed. Please try again." });
  }
}
