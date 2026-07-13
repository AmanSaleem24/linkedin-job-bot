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

        const queries = config.SEARCH_QUERIES.length > 0
            ? config.SEARCH_QUERIES
            : [config.SEARCH_QUERY];

        const allJobs = [];
        const processedJobIds = new Set();

        for (const query of queries) {
            const queryWithFlags = config.SEARCH_FLAGS
                ? `${query} ${config.SEARCH_FLAGS}`
                : query;
            console.log(`\n🔍 Searching for: "${queryWithFlags}"...`);
            try {
                await page.goto(config.LINKEDIN_FEED_URL);

                await page.getByTestId("typeahead-input").fill(queryWithFlags);
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
                console.log(`\nFound ${jobs.length} jobs for query "${query}".\n`);

                for (const job of jobs) {
                    if (!processedJobIds.has(job.id)) {
                        processedJobIds.add(job.id);
                        allJobs.push(job);
                    }
                }
            } catch (queryErr) {
                console.error(`⚠️ Error searching for query "${query}":`, queryErr.message);
            }
        }

        const filteredJobs = filterJobs(
            allJobs,
            config.FILTERS
        );

        console.log("\n========== SUMMARY ==========");
        console.log(`Queries Run    : ${queries.length}`);
        console.log(`Total Scraped  : ${processedJobIds.size} (unique)`);
        console.log(`Filtered Jobs  : ${filteredJobs.length}`);
        console.log("=============================\n");

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
                    `Waiting ${Math.round(delay / 1000)} seconds before next job...`
                );

                await sleep(delay);

            } catch (err) {
                failed++;
                console.error(err.message);
            }
        }
        console.log("\n========== RUN COMPLETE ==========");
        console.log(`Total Scraped   : ${processedJobIds.size}`);
        console.log(`Filtered Jobs   : ${filteredJobs.length}`);
        console.log(`Emails Sent     : ${sent}`);
        console.log(`Skipped         : ${skipped}`);
        console.log(`Failed          : ${failed}`);
        console.log("==================================");
        exportCsv();
    } catch (error) {
        console.error("\nFatal Error:");
        console.error(error);

    } finally {

        await browser.close();

    }

})();
