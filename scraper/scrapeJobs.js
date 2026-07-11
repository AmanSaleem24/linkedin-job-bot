const collectPosts = require("./collectPosts");

async function scrapeJobs(page) {

    const jobs = await collectPosts(page);

    return jobs.filter(job => {

        return (
            job.title ||
            job.email ||
            job.phone
        );

    });

}

module.exports = scrapeJobs;