const config = require("../config")

function fullstackTemplate(job) {
    return {
        subject: `Application for ${job.title}`,

        body: `Dear ${job.recruiter || "Hiring Team"},

I hope you're doing well.

I came across your LinkedIn post regarding the ${job.title} position and would like to express my interest.

I am currently pursuing a Bachelor's degree in Computer Science and have hands-on experience building full-stack web applications.

My primary skills include:

• React.js & Next.js
• Node.js & Express.js
• REST API Development
• MongoDB, PostgreSQL & SQL
• Git, Docker (Basics), AWS EC2, NGINX & PM2

I have developed full-stack projects involving authentication, REST APIs, database integration, deployment, and responsive user interfaces.

I've attached my resume for your review. I would appreciate the opportunity to discuss how I can contribute to your team.

Thank you for your time and consideration.

Best regards,

${config.NAME}
📧 ${config.EMAIL}
📱 ${config.PHONE}
🔗 LinkedIn: ${config.LINKEDIN}
💻 GitHub: ${config.GITHUB}`
    };
}

module.exports = fullstackTemplate;