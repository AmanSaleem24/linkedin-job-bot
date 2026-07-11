const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.linkedin.com/login");

  console.log("Waiting for login...");

  const timeout = 5 * 60 * 1000;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const url = page.url();

    console.log(url);

    // Login successful if we leave login/checkpoint pages
    if (
      !url.includes("/login") &&
      !url.includes("/checkpoint")
    ) {
      console.log("Logged in!");

      await context.storageState({
        path: "../storage/linkedinStorageSession.json",
      });

      console.log("Session saved.");

      await browser.close();
      return;
    }

    await page.waitForTimeout(2000);
  }

  console.log("Login timed out.");
  await browser.close();
})();