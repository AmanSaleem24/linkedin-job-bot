const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { customizeResume } = require("./customize");

const mockJob = {
    title: "Django Developer Intern",
    description: "We are looking for a Django Developer Intern to help build and maintain robust backend systems. You will work with Python, Django, Django REST Framework, and SQL databases. Basic understanding of Git, MVC architecture, and backend principles is required."
};

const outputPdf = path.join(__dirname, "test_custom_resume.pdf");

(async () => {
    console.log("🚀 Running Resume Customizer Test...");
    
    // Clean up old test PDF if exists
    if (fs.existsSync(outputPdf)) {
        fs.unlinkSync(outputPdf);
    }
    
    const resolvedPath = await customizeResume(mockJob, outputPdf);
    
    console.log(`\n🔍 Test Result:`);
    console.log(`Returned Path: ${resolvedPath}`);
    console.log(`File Exists: ${fs.existsSync(resolvedPath)}`);
    
    if (resolvedPath === outputPdf) {
        console.log("🎉 SUCCESS: Custom PDF generated!");
    } else {
        console.log("⚠️ FALLBACK: Returned default resume. (Check if GEMINI_API_KEY is configured in .env)");
    }
})();
