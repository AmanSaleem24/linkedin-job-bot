const fs = require("fs");
const {
    APPLIED_LOG_PATH,
    APPLICATIONS_CSV_PATH
} = require("../config");

function escapeCsv(value) {

    if (value == null)
        return "";

    value = String(value);

    value = value.replace(/"/g, '""');

    return `"${value}"`;
}

function exportCsv() {
    let applied = [];
    try {
        if (fs.existsSync(APPLIED_LOG_PATH)) {
            const content = fs.readFileSync(APPLIED_LOG_PATH, "utf8").trim();
            if (content) {
                applied = JSON.parse(content);
            }
        }
    } catch (err) {
        console.warn("⚠️  Failed to parse applied.json during CSV export:", err.message);
    }
    const rows = [[
        "Recruiter",
        "Email",
        "Phone",
        "Title",
        "Status",
        "Sent At",
        "Profile URL"
    ]];

    for (const app of applied) {

        rows.push([
            app.recruiter,
            app.email,
            app.phone,
            app.title,
            app.status,
            app.sentAt,
            app.profileUrl
        ]);

    }
    const csv = rows
    .map(row =>
        row.map(escapeCsv).join(",")
    )
    .join("\n");

    fs.writeFileSync(APPLICATIONS_CSV_PATH, csv);

    console.log("CSV exported successfully.");
}

module.exports = exportCsv;
