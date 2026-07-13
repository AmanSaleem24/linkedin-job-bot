const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const BASE_RESUME_TXT_PATH = path.join(__dirname, "resume_base.txt");
const DEFAULT_RESUME_PDF_PATH = path.join(__dirname, "resume.pdf");

/**
 * Clean up the response from Gemini in case it wrapped it in markdown code blocks.
 */
function cleanGeminiHtml(responseHtml) {
    let clean = responseHtml.trim();
    // Strip ```html ... ``` markdown wrappers if present
    if (clean.startsWith("```")) {
        clean = clean.replace(/^```html\s*/i, "");
        clean = clean.replace(/```$/, "");
    }
    return clean.trim();
}

/**
 * Renders HTML content to a PDF using Playwright.
 */
async function renderHtmlToPdf(htmlContent, outputPath) {
    const browser = await chromium.launch({ headless: true });
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.setContent(htmlContent, { waitUntil: "networkidle" });
        
        // Print to PDF with standard A4 margins
        await page.pdf({
            path: outputPath,
            format: "A4",
            printBackground: true,
            margin: {
                top: "0.4in",
                bottom: "0.4in",
                left: "0.5in",
                right: "0.5in"
            }
        });
    } finally {
        await browser.close();
    }
}

/**
 * Customizes the resume based on the job post and returns the path to the customized PDF.
 * If customization fails or API key is missing, falls back to the default resume path.
 */
async function customizeResume(job, outputPath, cleanedJobTitle = null) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("⚠️  GEMINI_API_KEY not found in environment. Falling back to default resume.");
        return DEFAULT_RESUME_PDF_PATH;
    }

    if (!fs.existsSync(BASE_RESUME_TXT_PATH)) {
        console.warn(`⚠️  Base resume text file not found at ${BASE_RESUME_TXT_PATH}. Falling back to default resume.`);
        return DEFAULT_RESUME_PDF_PATH;
    }

    const baseResumeText = fs.readFileSync(BASE_RESUME_TXT_PATH, "utf8");
    const targetTitle = cleanedJobTitle || job.title;

    try {
        console.log(`🤖 Requesting Gemini to customize resume for: "${targetTitle}"...`);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

        const prompt = `
You are an expert resume writer and ATS optimizer. Your task is to customize the candidate's resume to align with the target job posting.

Here is the candidate's original resume details:
---
${baseResumeText}
---

Here is the target job posting details:
---
Title: ${targetTitle}
Description: ${job.description}
---

INSTRUCTIONS:
1. **Be Truthful & Adaptive**: Do NOT invent fake job titles, companies, employment dates, or degrees. However, to pass ATS filters, you are allowed to include key technologies, libraries, and frameworks required by the job posting in the Skills and Summary sections *if* they correspond to languages or domains the candidate already knows (e.g., since the candidate knows Java, you should list 'Spring Boot' or 'Spring Boot (Basics)' under skills; if they know CSS, you can list 'Tailwind CSS').
2. **Follow Template Structure**: You must populate the HTML template provided below. Keep all the structure, classes, styles, and headers exactly the same. Do not add extra styles or change the layout.
3. **Customize Content**:
   - **Summary**: Write a professional summary (intro) of 3-4 sentences that highlights the candidate's skills and projects relevant to the target job (e.g. emphasize backend/Node if backend, frontend/React if frontend).
   - **Skills Table**: Re-order the categories and the skills in the list so that the skills matching the target job description are listed first and highlighted. Align naming conventions with the job post (e.g. React.js).
   - **Projects**: Rephrase the bullet points for ClipFlow and Polaris to emphasize the skills, languages, and architecture used (e.g. express, websockets, AWS for backend, Next.js, Clerk, Clerk APIs for fullstack/frontend).
4. **Format & Page Limit**: Ensure all HTML tags are closed properly, and the layout fits cleanly on a single A4 page.

TEMPLATE TO POPULATE:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Aman Saleem - Resume</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            color: #1f2937;
            margin: 0;
            padding: 0;
            font-size: 9.5pt;
            line-height: 1.4;
        }
        .container {
            width: 100%;
        }
        header {
            text-align: center;
            margin-bottom: 12px;
        }
        h1 {
            font-size: 19pt;
            margin: 0 0 2px 0;
            color: #111827;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .subtitle {
            font-size: 10pt;
            color: #4b5563;
            margin: 0 0 6px 0;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .contact-info {
            font-size: 8.5pt;
            color: #4b5563;
            margin-bottom: 8px;
        }
        .contact-info a {
            color: #2563eb;
            text-decoration: none;
        }
        .contact-info span {
            margin: 0 5px;
            color: #d1d5db;
        }
        .section {
            margin-top: 12px;
        }
        .section-title {
            font-size: 9.5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #111827;
            border-bottom: 1.5px solid #e5e7eb;
            padding-bottom: 2px;
            margin-bottom: 6px;
        }
        .summary-text {
            font-size: 9pt;
            color: #374151;
            text-align: justify;
            margin: 0;
        }
        .project-item, .edu-item {
            margin-bottom: 10px;
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-weight: 700;
            font-size: 9.5pt;
            color: #111827;
            margin-bottom: 2px;
        }
        .item-title-link {
            color: #2563eb;
            text-decoration: none;
            font-size: 8.5pt;
            font-weight: 500;
            margin-left: 6px;
        }
        .item-tech {
            font-weight: 500;
            font-size: 8.5pt;
            color: #4b5563;
        }
        .item-date {
            font-weight: 500;
            color: #6b7280;
            font-size: 8.5pt;
        }
        ul {
            margin: 4px 0 0 0;
            padding-left: 18px;
        }
        li {
            margin-bottom: 3px;
            font-size: 9pt;
            color: #374151;
            line-height: 1.35;
        }
        .skills-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }
        .skills-row {
            margin-bottom: 4px;
        }
        .skills-category {
            font-weight: 700;
            color: #111827;
            font-size: 9pt;
            vertical-align: top;
            width: 22%;
            padding: 2px 0;
        }
        .skills-values {
            color: #374151;
            font-size: 9pt;
            vertical-align: top;
            padding: 2px 0;
        }
        .coding-profiles {
            font-size: 9pt;
            color: #374151;
            margin: 4px 0 0 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Aman Saleem</h1>
            <div class="subtitle">Software Engineer | DSA & Full Stack Developer (MERN)</div>
            <div class="contact-info">
                <span>📞 +91-9555303228</span><span>|</span>
                <span>📧 <a href="mailto:amansaleem9024@gmail.com">amansaleem9024@gmail.com</a></span><span>|</span>
                <span>🔗 <a href="https://linkedin.com/in/amansaleem" target="_blank">linkedin.com/in/amansaleem</a></span>
            </div>
        </header>

        <div class="section">
            <div class="section-title">Summary</div>
            <p class="summary-text">
                [INSERT_TAILORED_SUMMARY_HERE]
            </p>
        </div>

        <div class="section">
            <div class="section-title">Skills</div>
            <table class="skills-table">
                <!-- Populate skills rows here - re-ordered by job relevance -->
                <tr class="skills-row">
                    <td class="skills-category">Programming</td>
                    <td class="skills-values">...</td>
                </tr>
                <tr class="skills-row">
                    <td class="skills-category">Web Development</td>
                    <td class="skills-values">...</td>
                </tr>
                <tr class="skills-row">
                    <td class="skills-category">Databases</td>
                    <td class="skills-values">...</td>
                </tr>
                <tr class="skills-row">
                    <td class="skills-category">Core Concepts</td>
                    <td class="skills-values">...</td>
                </tr>
                <tr class="skills-row">
                    <td class="skills-category">Tools & Technologies</td>
                    <td class="skills-values">...</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Projects</div>
            
            <div class="project-item">
                <div class="item-header">
                    <div>
                        <span>ClipFlow</span>
                        <span class="item-tech">| Electron, Next.js, Express (WebSockets), AWS S3, CloudFront</span>
                    </div>
                </div>
                <ul>
                    <!-- Bullet points here, rephrased to emphasize job keywords -->
                    <li>...</li>
                </ul>
            </div>

            <div class="project-item">
                <div class="item-header">
                    <div>
                        <span>Polaris</span>
                        <span class="item-tech">| Full Stack (Next.js, MERN, Clerk, GitHub API)</span>
                    </div>
                </div>
                <ul>
                    <!-- Bullet points here, rephrased to emphasize job keywords -->
                    <li>...</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Coding Profiles & Highlights</div>
            <ul class="coding-profiles">
                <li>Solved 400+ DSA problems on LeetCode, GeeksforGeeks, and CodeChef.</li>
                <li>Proficient in Data Structures, Algorithms (Arrays, Trees, Graphs, Dynamic Programming).</li>
            </ul>
        </div>

        <div class="section">
            <div class="section-title">Education</div>
            
            <div class="edu-item">
                <div class="item-header">
                    <div>B.Tech in Computer Science and Engineering <span style="font-weight: 500; font-size: 8.5pt; color: #4b5563;">| JSS Academy of Technical Education</span></div>
                    <div class="item-date">2023 – 2027</div>
                </div>
            </div>

            <div class="edu-item">
                <div class="item-header">
                    <div>Class XII (ISC Board) <span style="font-weight: 500; font-size: 8.5pt; color: #4b5563;">| City Children’s Academy (Percentage: 89.5%)</span></div>
                    <div class="item-date">2023</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
\`\`\`

Return ONLY the raw HTML source code starting with <!DOCTYPE html>. Do not wrap it in markdown code blocks like \`\`\`html ... \`\`\`.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const htmlContent = cleanGeminiHtml(responseText);

        console.log("🎨 Rendering customized HTML to PDF...");
        await renderHtmlToPdf(htmlContent, outputPath);
        console.log(`✅ Customized resume successfully generated at: ${outputPath}`);

        return outputPath;

    } catch (error) {
        console.error("❌ Error during resume customization:", error.message);
        console.warn("⚠️  Falling back to default resume.");
        return DEFAULT_RESUME_PDF_PATH;
    }
}

module.exports = {
    customizeResume
};
