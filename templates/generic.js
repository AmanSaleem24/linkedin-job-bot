const config = require("../config")

function internshipTemplate(job) {
    return {
        subject: `Application for ${job.title}`,

        body: `Dear ${job.recruiter || "Hiring Team"},

I hope you're doing well.

I came across your LinkedIn post regarding the ${job.title} position and would like to express my interest.

I am currently pursuing a Bachelor's degree in Computer Science and have hands-on experience in full-stack web development.

My technical skills include:

• Programming: Java, JavaScript, C, Rust (Basics)
• Frontend: React.js, Next.js
• Backend: Node.js, Express.js, REST API Development
• Databases: MongoDB, PostgreSQL, SQL
• Core Concepts: Data Structures & Algorithms, OOP, DBMS, Operating Systems
• Tools: Git, GitHub, Postman, Docker (Basics), GitHub Actions (CI/CD), AWS EC2, NGINX, PM2, SSH

I have built several full-stack applications involving authentication, REST APIs, database integration, deployment, and responsive user interfaces. I am eager to contribute my skills while continuing to learn and grow in a professional environment.

I've attached my resume for your review. I would appreciate the opportunity to discuss how I can contribute to your team.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,

${config.NAME}
📧 ${config.EMAIL}
📱 ${config.PHONE}
🔗 LinkedIn: ${config.LINKEDIN}
💻 GitHub: ${config.GITHUB}`
    };
}

module.exports = internshipTemplate;