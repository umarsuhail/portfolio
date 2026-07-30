const puppeteer = require('puppeteer');

const URLS = ['http://localhost:3000/', 'http://localhost:3000/about', 'http://localhost:3000/resume-builder'];

async function runAudit() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const report = [];

  for (const url of URLS) {
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      // inject axe-core from CDN
      await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.6/axe.min.js' });
      const results = await page.evaluate(async () => {
        // eslint-disable-next-line no-undef
        return await axe.run(document, { runOnly: { type: 'tag', values: ['wcag21aa', 'wcag2a', 'wcag2aa'] } });
      });

      report.push({ url, violations: results.violations, passes: results.passes.length, incomplete: results.incomplete.length, resultsSummary: { violations: results.violations.length } });
      console.log(`\n== Axe results for ${url} — violations: ${results.violations.length}`);
      for (const v of results.violations) {
        console.log(`- ${v.id}: ${v.help} (impact: ${v.impact}) — nodes: ${v.nodes.length}`);
      }
    } catch (err) {
      console.error(`Error auditing ${url}:`, err.message || err);
      report.push({ url, error: err.message || String(err) });
    }
  }

  await browser.close();
  // output machine-readable summary
  console.log('\n=== AXE AUDIT SUMMARY JSON ===');
  console.log(JSON.stringify(report, null, 2));
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(2);
});
