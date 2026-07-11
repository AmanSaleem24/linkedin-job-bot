const { chromium } = require("playwright");
const config = require("../config");

async function setupLinkedIn() {
  const browser = await chromium.launch({
    headless: config.BROWSER_HEADLESS
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(config.LINKEDIN_LOGIN_URL);

    console.log("Log in to LinkedIn in the browser window.");

    await page.waitForURL(
      (url) =>
        !url.pathname.includes("/login") &&
        !url.pathname.includes("/checkpoint"),
      { timeout: config.LOGIN_TIMEOUT_MS }
    );

    await context.storageState({
      path: config.LINKEDIN_SESSION_PATH,
    });

    console.log("LinkedIn session saved.");
  } finally {
    await browser.close();
  }
}

module.exports = setupLinkedIn;
