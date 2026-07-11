const { chromium } = require("playwright");
const config = require("./config");

(async () => {
  const browser = await chromium.launch({
    headless: config.BROWSER_HEADLESS,
  });

  const context = await browser.newContext({
   storageState: config.LINKEDIN_SESSION_PATH,
  });

  const page = await context.newPage();

  await page.goto(config.LINKEDIN_FEED_URL);

  console.log(page.url());

  await page.waitForTimeout(10000);

  await browser.close();
})();
