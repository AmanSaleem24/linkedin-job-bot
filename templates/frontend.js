const config = require("../config")

function frontendTemplate(job) {
    return {
        subject: `Application for ${job.title}`,

        body: `Dear ${job.recruiter || "Hiring Team"},

I hope you're doing well.

I would like to apply for the ${job.title} position.

I am a Computer Science undergraduate with experience building modern, responsive web applications.

Relevant skills:

• React.js
• Next.js
• JavaScript
• REST API Integration
• Git & GitHub

I enjoy creating responsive, user-friendly interfaces and collaborating on real-world projects.

I've attached my resume for your consideration.

Thank you for your time.

Best regards,

${config.NAME}
📧 ${config.EMAIL}
📱 ${config.PHONE}
🔗 LinkedIn: ${config.LINKEDIN}
💻 GitHub: ${config.GITHUB}`
    };
}

module.exports = frontendTemplate;