const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.connectOverCDP(
        "http://localhost:9222"
    );

    const context = browser.contexts()[0];

    await context.storageState({
        path: "storage/gmailStorageState.json"
    });

    console.log("Saved!");

    await browser.close();
})();