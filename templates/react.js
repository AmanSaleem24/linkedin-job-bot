const config = require("../config")

function reactTemplate(job) {
    return {
        subject: `Application for ${job.title}`,

        body: `Dear ${job.recruiter || "Hiring Team"},

I hope you're doing well.

I would like to apply for the ${job.title} role.

I have practical experience developing applications using React.js and Next.js, along with integrating REST APIs and building responsive interfaces.

Skills:

• React.js
• Next.js
• JavaScript
• REST APIs
• Git & GitHub

I've attached my resume for your review.

Thank you for your time.

Best regards,

${config.NAME}
📧 ${config.EMAIL}
📱 ${config.PHONE}
🔗 LinkedIn: ${config.LINKEDIN}
💻 GitHub: ${config.GITHUB}`
    };
}

module.exports = reactTemplate;