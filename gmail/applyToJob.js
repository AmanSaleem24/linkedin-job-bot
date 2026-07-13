const path = require("path");
const fs = require("fs");
const retry = require("../utils/retry");
const shouldRetry = require("./shouldRetry");
const { RETRY, TEST_RECIPIENT_EMAIL, FILTERS } = require("../config");

const sendMailWithAttachment = require("./sendMailWithAttachment");
const buildEmailTemplate = require("../templates/buildEmailTemplate");
const extractJobDetails = require("../utils/extractJobDetails");
const { customizeResume } = require("../resume/customize");

const {
    alreadyApplied,
    markApplied
} = require("../storage/applied");
async function applyToJob(job) {
    if (!job.email) {
        return false;
    }

    console.log("-".repeat(50));
    console.log(`Raw Title:     ${job.title.substring(0, 50) + (job.title.length > 50 ? "..." : "")}`);
    console.log(`Email:         ${job.email}`);
    console.log(`Post URL:      ${job.postUrl || "N/A"}`);

    if (alreadyApplied(job)) {
        console.log(`Status:        SKIPPED (Already Applied)`);
        console.log("-".repeat(50));
        return false;
    }

    // Extract clean job title and recruiter name via Gemini
    const extractedDetails = await extractJobDetails(job);

    console.log(`Cleaned Title: "${extractedDetails.cleanedJobTitle}"`);
    console.log(`Recruiter:     "${extractedDetails.recruiterName}"`);
    console.log(`US Job:        ${extractedDetails.isUS ? "YES" : "NO"}`);

    if (FILTERS.filterUsOnly && !extractedDetails.isUS) {
        console.log(`Status:        SKIPPED (Not located in USA)`);
        console.log("-".repeat(50));
        return false;
    }

    const email = buildEmailTemplate(job, extractedDetails);
    
    const tempResumePath = path.join(__dirname, `../resume/temp_customized_resume_${job.id}.pdf`);
    let resumePathToAttach = null;

    let recipientEmail = job.email;
    if (TEST_RECIPIENT_EMAIL && TEST_RECIPIENT_EMAIL !== "you@example.com") {
        recipientEmail = TEST_RECIPIENT_EMAIL;
        console.log(`Redirecting to: ${recipientEmail}`);
    }

    try {
        resumePathToAttach = await customizeResume(job, tempResumePath, extractedDetails.cleanedJobTitle);

        await retry(
            () =>
                sendMailWithAttachment({
                    to: recipientEmail,
                    subject: email.subject,
                    body: email.body,
                    resumePath: resumePathToAttach,
                }),
            {
                ...RETRY,
                shouldRetry,
            }
        );
        
        markApplied(job);

        console.log(`Status:        SENT SUCCESSFULLY`);
        console.log("-".repeat(50));

        return true;

    } catch (err) {
        console.log(`Status:        FAILED (${err.message})`);
        console.log("-".repeat(50));
        return false;

    } finally {
        // Clean up the customized PDF if it was generated and exists
        if (resumePathToAttach === tempResumePath && fs.existsSync(tempResumePath)) {
            try {
                fs.unlinkSync(tempResumePath);
                console.log(`🧹 Cleaned up temporary resume at: ${tempResumePath}`);
            } catch (cleanupErr) {
                console.error(`⚠️ Failed to delete temporary resume:`, cleanupErr.message);
            }
        }
    }
}
module.exports = applyToJob;


