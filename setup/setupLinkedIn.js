const path = require("path");
const { chromium } = require("playwright");

const LINKEDIN_SESSION_PATH = path.join(
  __dirname,
  "../storage/linkedinStorageSession.json"
);

async function setupLinkedIn() {
  const browser = await chromium.launch({ headless: false });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://www.linkedin.com/login");

    console.log("Log in to LinkedIn in the browser window.");

    await page.waitForURL(
      (url) =>
        !url.pathname.includes("/login") &&
        !url.pathname.includes("/checkpoint"),
      { timeout: 5 * 60 * 1000 }
    );

    await context.storageState({
      path: LINKEDIN_SESSION_PATH,
    });

    console.log("LinkedIn session saved.");
  } finally {
    await browser.close();
  }
}

module.exports = setupLinkedIn;