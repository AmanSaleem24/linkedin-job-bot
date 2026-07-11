const extractPost = require("../extractors/extractPost");
const scroll = require("./scroll");
const config = require("../config")

async function collectPosts(page) {

    const jobs = [];
    const seen = new Set();

    const MAX_SCROLLS = config.MAX_SCROLLS;
    const TARGET_EMAILS = config.TARGET_EMAILS;

    let emailCount = 0;

    for (let scrollCount = 1; scrollCount <= MAX_SCROLLS; scrollCount++) {

        console.log(`\n========== Scroll ${scrollCount}/${MAX_SCROLLS} ==========`);

        const posts = page.locator('[role="listitem"]');
        const count = await posts.count();

        console.log(`Visible Posts: ${count}`);

        for (let i = 0; i < count; i++) {

            const post = posts.nth(i);

            const text = await post.innerText();

            if (seen.has(text))
                continue;

            seen.add(text);

            const job = await extractPost(post);

            jobs.push(job);

            if (job.email) {
                emailCount++;
            }
        }

        console.log(`Jobs Collected   : ${jobs.length}`);
        console.log(`Emails Collected : ${emailCount}`);

        // Stop if enough recruiter emails are found
        if (emailCount >= TARGET_EMAILS) {
            console.log(`\nReached target of ${TARGET_EMAILS} recruiter emails.`);
            break;
        }

        // Scroll for more posts
        const loadedMore = await scroll(page);

        if (!loadedMore) {
            console.log("\nNo more posts loaded.");
            break;
        }
    }

    return jobs;
}

module.exports = collectPosts;