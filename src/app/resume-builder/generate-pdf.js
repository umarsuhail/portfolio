const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function generatePDF() {
  const htmlFragment = fs.readFileSync(
    path.join(__dirname, "resume.html"),
    "utf-8"
  );

  // The fragment has 3 nested wrapper divs before the actual resume content:
  //   1. outer clip div (width: 766px, height: 1084px) - screen display only
  //   2. scale div (transform: scale(0.964736)) - screen display only
  //   3. intermediate div
  //   4. resume div (font-family: Lato) - actual A4 content
  // We strip the 2 screen-only wrappers and render the resume at true A4 size.
  const innerContent = htmlFragment
    .replace(/^<div[^>]*>\s*<div[^>]*>\s*/, "")  // remove outer 2 opening divs
    .replace(/\s*<\/div>\s*<\/div>\s*$/, "");     // remove their closing divs

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background: white; }
    @page { size: A4 portrait; margin: 0; }
  </style>
</head>
<body>
${innerContent}
</body>
</html>`;

  const tempHtmlPath = path.join(__dirname, "_resume_temp.html");
  fs.writeFileSync(tempHtmlPath, fullHtml, "utf-8");

  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    const fileUrl = `file:///${tempHtmlPath.replace(/\\/g, "/")}`;
    await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 30000 });
    await page.evaluateHandle("document.fonts.ready");

    // Let Tailwind CDN JIT finish processing
    await new Promise((r) => setTimeout(r, 1500));

    const outputPath = path.join(__dirname, "resume.pdf");
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
    console.log(`PDF saved: ${outputPath} (${sizeKB} KB)`);
  } finally {
    await browser.close();
    fs.unlinkSync(tempHtmlPath);
  }
}

generatePDF().catch(console.error);
