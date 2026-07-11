const path = require("path");

require("dotenv").config();

function numberFromEnv(name, fallback) {
    const value = Number(process.env[name]);

    return Number.isFinite(value) ? value : fallback;
}

function listFromEnv(name) {
    return (process.env[name] || "")
        .split(",")
        .map(value => value.trim())
        .filter(Boolean);
}

function booleanFromEnv(name, fallback) {
    if (process.env[name] === undefined) {
        return fallback;
    }

    return process.env[name] === "true";
}

const resumePath = process.env.RESUME_PATH
    ? path.resolve(process.env.RESUME_PATH)
    : path.join(__dirname, "resume/resume.pdf");

module.exports = {
    SEARCH_QUERY: process.env.SEARCH_QUERY || "full stack developer intern",

    FILTERS: {
        all: listFromEnv("FILTER_ALL"),
        any: listFromEnv("FILTER_ANY"),
        requireEmail: booleanFromEnv("REQUIRE_EMAIL", true)
    },

    MAX_SCROLLS: numberFromEnv("MAX_SCROLLS", 15),
    TARGET_EMAILS: numberFromEnv("TARGET_EMAILS", 20),

    EMAIL_DELAY: {
        min: numberFromEnv("EMAIL_DELAY_MIN_MS", 15000),
        max: numberFromEnv("EMAIL_DELAY_MAX_MS", 30000)
    },

    NAME: process.env.NAME || "",
    EMAIL: process.env.EMAIL || "",
    PHONE: process.env.PHONE || "",
    LINKEDIN: process.env.LINKEDIN_URL || "",
    GITHUB: process.env.GITHUB_URL || "",

    BROWSER_HEADLESS: process.env.BROWSER_HEADLESS === "true",
    LOGIN_TIMEOUT_MS: numberFromEnv("LOGIN_TIMEOUT_MS", 5 * 60 * 1000),
    SCROLL_TIMEOUT_MS: numberFromEnv("SCROLL_TIMEOUT_MS", 5000),
    LINKEDIN_LOGIN_URL: "https://www.linkedin.com/login",
    LINKEDIN_FEED_URL: "https://www.linkedin.com/feed/",
    LINKEDIN_SESSION_PATH: path.join(
        __dirname,
        "storage/linkedinStorageSession.json"
    ),

    GOOGLE_CREDENTIALS_PATH: path.join(__dirname, "credentials.json"),
    GOOGLE_TOKEN_PATH: path.join(__dirname, "token.json"),
    GOOGLE_REDIRECT_URI: "http://localhost",

    RESUME_PATH: resumePath,
    RESUME_FILENAME: process.env.RESUME_FILENAME || path.basename(resumePath),
    TEST_RECIPIENT_EMAIL: process.env.TEST_RECIPIENT_EMAIL || "",
    APPLIED_LOG_PATH: path.join(__dirname, "logs/applied.json"),
    APPLICATIONS_CSV_PATH: path.join(__dirname, "logs/applications.csv"),

    RETRY: {
        attempts: 3,
        initialDelay: 2000,
        backoffMultiplier: 2
    }
};
