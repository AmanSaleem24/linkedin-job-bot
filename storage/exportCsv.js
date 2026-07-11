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
    const applied = JSON.parse(
        fs.readFileSync(APPLIED_LOG_PATH, "utf8")
    );
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
