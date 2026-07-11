const fs = require("fs");
const path = require("path");

const JSON_PATH = path.join(
    __dirname,
    "../logs/applied.json"
);

const CSV_PATH = path.join(
    __dirname,
    "../logs/applications.csv"
);

function escapeCsv(value) {

    if (value == null)
        return "";

    value = String(value);

    value = value.replace(/"/g, '""');

    return `"${value}"`;
}

function exportCsv() {
    const applied = JSON.parse(
        fs.readFileSync(JSON_PATH, "utf8")
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

    fs.writeFileSync(CSV_PATH, csv);

    console.log("CSV exported successfully.");
}

module.exports = exportCsv;