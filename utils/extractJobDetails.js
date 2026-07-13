const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function extractJobDetails(job) {
    if (!process.env.GEMINI_API_KEY) {
        return {
            cleanedJobTitle: job.title || "Software Developer",
            recruiterName: job.recruiter || "Hiring Team",
            isUS: true
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
Analyze the following LinkedIn post title and description.
Extract:
1. A clean, concise Job Title (e.g. "Software Developer Intern", "Business Analyst", "Data Analyst", "React Developer", "Automation Test Intern"). Do NOT include emojis, "We are hiring", locations, durations, or company names unless necessary to understand the role.
2. The name of the recruiter if mentioned (e.g. "Virendra", "Saloni"). If not mentioned or unclear, output "Hiring Team".
3. Is this job/internship located in the USA, remote within the USA, or explicitly targeting USA candidates/sponsorship/C2C/OPT/CPT? Answer true or false.

Post Title: \`${job.title}\`
Post Description: \`${job.description}\`

Format your output as a raw JSON object with exactly these keys:
{
  "cleanedJobTitle": "...",
  "recruiterName": "...",
  "isUS": true
}
`;

        const result = await model.generateContent(prompt);
        let textResponse = result.response.text().trim();
        if (textResponse.startsWith("```")) {
            textResponse = textResponse.replace(/^```json\s*/i, "");
            textResponse = textResponse.replace(/^```\s*/i, "");
            textResponse = textResponse.replace(/```$/, "");
        }
        const data = JSON.parse(textResponse.trim());
        
        return {
            cleanedJobTitle: data.cleanedJobTitle || job.title,
            recruiterName: data.recruiterName || job.recruiter || "Hiring Team",
            isUS: typeof data.isUS === "boolean" ? data.isUS : true
        };
    } catch (err) {
        console.error("⚠️ Failed to extract job details via Gemini:", err.message);
        return {
            cleanedJobTitle: job.title || "Software Developer",
            recruiterName: job.recruiter || "Hiring Team",
            isUS: true
        };
    }
}

module.exports = extractJobDetails;
