const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext({
   storageState: "storage/linkedinStorageSession.json",
  });

  const page = await context.newPage();

  await page.goto("https://www.linkedin.com/feed/");

  console.log(page.url());

  await page.waitForTimeout(10000);

  await browser.close();
})();