const { chromium } = require("playwright");

const scrapeJobs = require("./scraper/scrapeJobs");
const filterJobs = require("./filters/filterJobs");
const applyToJob = require("./gmail/applyToJob");
const sleep = require("./utils/sleep");
const config = require("./config");
const exportCsv = require("./storage/exportCsv");

(async () => {

    const browser = await chromium.launch({
        headless: config.BROWSER_HEADLESS
    });

    try {
        const context = await browser.newContext({
            storageState: config.LINKEDIN_SESSION_PATH
        });

        const page = await context.newPage();

        await page.goto(config.LINKEDIN_FEED_URL);

        await page.getByTestId("typeahead-input").fill(
            config.SEARCH_QUERY
        );

        await page.getByTestId("typeahead-input").press("Enter");

        await page.getByRole("radio", {
            name: "Filter by Posts"
        }).click();

        await page.getByRole("button", {
            name: "Filter by Date posted"
        }).click();

        await page.getByRole("radio", {
            name: "Past 24 hours"
        }).click();

        await Promise.all([
            page.waitForURL(/past-24h/),
            page.getByRole("link", {
                name: "Show results"
            }).click()
        ]);

        const jobs = await scrapeJobs(page);

        const filteredJobs = filterJobs(
            jobs,
            config.FILTERS
        );

        console.log("========== SUMMARY ==========");
        console.log(`Jobs Found     : ${jobs.length}`);
        console.log(`Filtered Jobs  : ${filteredJobs.length}`);
        console.log("=============================");

        let sent = 0;
        let skipped = 0;
        let failed = 0;

        for (const job of filteredJobs) {
            try {
                const applied = await applyToJob(job);

                if (applied) {
                    sent++;
                } else {
                    skipped++;
                }

                const delay =
                    Math.floor(
                        Math.random() *
                        (config.EMAIL_DELAY.max - config.EMAIL_DELAY.min + 1)
                    ) + config.EMAIL_DELAY.min;

                console.log(
                    `Waiting ${Math.round(delay / 1000)} seconds...`
                );

                await sleep(delay);

            } catch (err) {
                failed++;
                console.error(err.message);
            }
        }
        console.log("\n========== RUN COMPLETE ==========");
        console.log(`Jobs Found      : ${jobs.length}`);
        console.log(`Filtered Jobs   : ${filteredJobs.length}`);
        console.log(`Emails Sent     : ${sent}`);
        console.log(`Skipped         : ${skipped}`);
        console.log(`Failed          : ${failed}`);
        console.log("==================================");
        exportCsv();
    } catch (error) {
        console.error("\nFatal Error:");
        console.error(err);

    } finally {

        await browser.close();

    }

})();
