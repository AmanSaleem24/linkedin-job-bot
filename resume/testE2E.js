const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// 1. Mock sendMailWithAttachment before requiring applyToJob
const sendMailPath = require.resolve("../gmail/sendMailWithAttachment");
require.cache[sendMailPath] = {
    id: sendMailPath,
    filename: sendMailPath,
    loaded: true,
    exports: async function(args) {
        console.log("\n📨 [MOCKED EMAIL] sendMailWithAttachment called:");
        console.log(`- To: ${args.to}`);
        console.log(`- Subject: ${args.subject}`);
        console.log(`- Body:\n${args.body}\n`);
        console.log(`- Attached Resume: ${args.resumePath}`);
        console.log(`- Resume File Exists During Send: ${fs.existsSync(args.resumePath)}`);
    }
};

// 2. Mock alreadyApplied to always return false so we don't skip the test
const appliedPath = require.resolve("../storage/applied");
const originalApplied = require("../storage/applied");
require.cache[appliedPath].exports = {
    ...originalApplied,
    alreadyApplied: () => false,
    markApplied: (job) => console.log(`💾 [MOCKED DB] marked ${job.title} as applied in DB`)
};

const applyToJob = require("../gmail/applyToJob");

const mockJob = {
    id: "e2e_test_job_12345",
    title: "🔥 We are Hiring! Node Developer Intern | Remote | Immediate",
    recruiter: "Test Recruiter",
    email: "test-recruiter@example.com",
    profileUrl: "https://linkedin.com/in/test-recruiter",
    phone: "+123456789",
    description: "Looking for an experienced Node.js Backend Engineer with experience in Express, REST APIs, databases. Send CV. Recruiting Manager: Saloni Sharma. Job Location: USA Remote.",
    postUrl: "https://www.linkedin.com/feed/update/urn:li:share:1234567890/"
};

(async () => {
    console.log("🚀 Starting E2E Integration Test...");
    
    const result = await applyToJob(mockJob);
    
    console.log(`\n🔍 E2E Test result status: ${result ? "SUCCESS" : "FAILED"}`);
    
    // Check if the temp file has been cleaned up
    const expectedTempPath = path.join(__dirname, "../resume/temp_customized_resume_e2e_test_job_12345.pdf");
    const cleanupSuccessful = !fs.existsSync(expectedTempPath);
    console.log(`🧹 Temp File Cleaned Up Afterwards: ${cleanupSuccessful}`);
    
    if (result && cleanupSuccessful) {
        console.log("\n🎉 E2E INTEGRATION TEST PASSED SUCCESSFULLY!");
    } else {
        console.log("\n❌ E2E INTEGRATION TEST FAILED!");
    }
})();
