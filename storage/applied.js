const fs = require("fs");
const { APPLIED_LOG_PATH } = require("../config");


function loadApplied() {
    if (!fs.existsSync(APPLIED_LOG_PATH)) {
        fs.writeFileSync(APPLIED_LOG_PATH, "[]");
    }

    try {
        const content = fs.readFileSync(APPLIED_LOG_PATH, "utf8").trim();
        if (!content) {
            return [];
        }
        return JSON.parse(content);
    } catch (e) {
        console.warn("⚠️  Applied log file was empty or corrupt. Resetting to [].");
        fs.writeFileSync(APPLIED_LOG_PATH, "[]");
        return [];
    }
}

function saveApplied(data) {
    fs.writeFileSync(APPLIED_LOG_PATH, JSON.stringify(data, null, 4));
}

function alreadyApplied(job) {
    const applied = loadApplied();

    const normalizedEmail = job.email ? job.email.trim().toLowerCase() : null;
    const profileUrl = job.profileUrl ? job.profileUrl.trim().toLowerCase() : null;
    const phone = job.phone ? job.phone.trim().toString() : null;

    return applied.some(app => {
        // 1. Check exact job ID match
        if (app.id === job.id) return true;

        // 2. Check email match
        if (normalizedEmail && app.email) {
            if (app.email.trim().toLowerCase() === normalizedEmail) return true;
        }

        // 3. Check profile URL match (if both profiles are available)
        if (profileUrl && app.profileUrl) {
            if (app.profileUrl.trim().toLowerCase() === profileUrl) return true;
        }

        // 4. Check phone match (if both phones are available)
        if (phone && app.phone) {
            if (app.phone.trim().toString() === phone) return true;
        }

        return false;
    });
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
