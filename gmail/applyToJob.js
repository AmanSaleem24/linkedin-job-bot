const path = require("path");
const retry = require("../utils/retry");
const shouldRetry = require("./shouldRetry");
const { RETRY } = require("../config");

const sendMailWithAttachment = require("./sendMailWithAttachment");
const chooseTemplate = require("../templates/chooseTemplate");



const {
    alreadyApplied,
    markApplied
} = require("../storage/applied");

async function applyToJob(job) {

    if (!job.email) {
        console.log("No email found.");
        return false;
    }

    if (alreadyApplied(job.id)) {
        console.log(
            `Applied -> ${job.title} | ${job.recruiter} | ${job.email}`
        );
        return false;
    }



    const email = chooseTemplate(job);

    try {

        await retry(
            () =>
                sendMailWithAttachment({
                    to: job.email,
                    subject: email.subject,
                    body: email.body,
                }),
            {
                ...RETRY,
                shouldRetry,
            }
        );
        
        markApplied(job);

        console.log(`Applied -> ${job.email}`);

        return true;

    } catch (err) {

        console.error(
            `Failed -> ${job.title} | ${job.email}`
        );

        console.error(err.message);
        return false;

    }
}
module.exports = applyToJob;


