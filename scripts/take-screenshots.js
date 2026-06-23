const puppeteer = require('./node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const PAGES = [
  { name: 'homepage',     url: 'http://localhost:5173/',            wait: 3500 },
  { name: 'rooms',        url: 'http://localhost:5173/rooms',       wait: 3500 },
  { name: 'login',        url: 'http://localhost:5173/login',       wait: 2000 },
  { name: 'signup',       url: 'http://localhost:5173/signup',      wait: 2000 },
  { name: 'admin-login',  url: 'http://localhost:5173/admin/login', wait: 2000 },
  { name: 'dashboard',    url: 'http://localhost:5173/admin',       wait: 3000 },
];

async function takeScreenshots() {
  console.log('🚀 Launching Chromium...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    defaultViewport: { width: 1440, height: 900 },
  });

  for (const page of PAGES) {
    const tab = await browser.newPage();
    try {
      console.log(`📸 Capturing: ${page.name} → ${page.url}`);
      await tab.goto(page.url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, page.wait));
      const outPath = path.join(SCREENSHOTS_DIR, `${page.name}.png`);
      await tab.screenshot({ path: outPath, fullPage: false });
      console.log(`  ✅ Saved: docs/screenshots/${page.name}.png`);
    } catch (err) {
      console.error(`  ❌ Failed ${page.name}: ${err.message}`);
    } finally {
      await tab.close();
    }
  }

  await browser.close();
  console.log('\n✅ All screenshots captured in docs/screenshots/');
}

takeScreenshots().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
