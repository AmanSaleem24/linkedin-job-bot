const config = require("../config")

function backendTemplate(job) {
    return {
        subject: `Application for ${job.title}`,

        body: `Dear ${job.recruiter || "Hiring Team"},

I hope you're doing well.

I am writing to express my interest in the ${job.title} position.

My experience primarily focuses on backend development.

Relevant skills:

• Node.js
• Express.js
• REST API Development
• MongoDB, PostgreSQL & SQL
• Git, Docker (Basics), AWS EC2 & NGINX

I have built backend services with authentication, database integration, and REST APIs.

I've attached my resume for your review.

Thank you for your consideration.

Best regards,

${config.NAME}
📧 ${config.EMAIL}
📱 ${config.PHONE}
🔗 LinkedIn: ${config.LINKEDIN}
💻 GitHub: ${config.GITHUB}`
    };
}

module.exports = backendTemplate;