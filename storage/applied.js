const fs = require("fs");
const { APPLIED_LOG_PATH } = require("../config");


function loadApplied() {
    if (!fs.existsSync(APPLIED_LOG_PATH)) {
        fs.writeFileSync(APPLIED_LOG_PATH, "[]");
    }

    return JSON.parse(fs.readFileSync(APPLIED_LOG_PATH, "utf8"));
}

function saveApplied(data) {
    fs.writeFileSync(APPLIED_LOG_PATH, JSON.stringify(data, null, 4));
}

function alreadyApplied(id) {
    const applied = loadApplied();

    return applied.some(app => app.id === id);
}

function markApplied(job) {
    const applied = loadApplied();

    applied.push({
        id: job.id,
        recruiter: job.recruiter,
        profileUrl: job.profileUrl,
        email: job.email,
        phone: job.phone,
        title: job.title,
        status: "sent",
        sentAt: new Date().toISOString()
    });

    saveApplied(applied);
}

module.exports = {
    loadApplied,
    saveApplied,
    alreadyApplied,
    markApplied
};
