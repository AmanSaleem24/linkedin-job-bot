const config = require("../config");

function buildEmailTemplate(job, extractedDetails) {
    const cleanedTitle = extractedDetails.cleanedJobTitle || job.title;
    const recruiter = extractedDetails.recruiterName || "Hiring Team";
    const postUrlText = job.postUrl || "N/A";

    const subject = `Submission for ${cleanedTitle} - ${config.NAME} | ${config.WORK_AUTHORIZATION} | ${config.AVAILABILITY}`;

    const body = `Dear ${recruiter},

I hope this email finds you well.

I saw your recent hiring post on LinkedIn regarding a ${cleanedTitle} opportunity and would like to submit my application for this role. I have attached my resume to this email for your review.

Here is a summary of my profile for your quick review:
- Candidate Full Name: ${config.NAME}
- Email Address: ${config.EMAIL}
- Phone Number: ${config.PHONE}
- LinkedIn Profile: ${config.LINKEDIN}
- Current Location: ${config.CURRENT_LOCATION}
- Relocation Status: ${config.RELOCATION_STATUS}
- Work Authorization: ${config.WORK_AUTHORIZATION}
- Availability: ${config.AVAILABILITY}
- Total Experience: ${config.TOTAL_EXPERIENCE}
- Expected Salary: ${config.EXPECTED_SALARY}

Below are the details of the post I am applying to:
- LinkedIn Post URL: ${postUrlText}
-----------------------------------------
Job Post Description:
${job.description}
-----------------------------------------

I would appreciate the chance to discuss how my experience aligns with your requirements. Thank you for your time and consideration.

Best regards,
${config.NAME}`;

    return { subject, body, cleanedTitle, recruiter };
}

module.exports = buildEmailTemplate;
