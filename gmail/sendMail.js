const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const retry = require("../utils/retry");
const shouldRetry = require("./shouldRetry");
const { RETRY } = require("../config");

const credentials = require("../credentials.json");
const token = require("../token.json");

async function sendMail({ to, subject, body }) {
    const { client_id, client_secret } = credentials.installed;

    const auth = new google.auth.OAuth2(
        client_id,
        client_secret,
        "http://localhost"
    );

    auth.setCredentials(token);

    const gmail = google.gmail({
        version: "v1",
        auth,
    });

    const message = [
        `To: ${to}`,
        "Content-Type: text/plain; charset=utf-8",
        "MIME-Version: 1.0",
        `Subject: ${subject}`,
        "",
        body,
    ].join("\n");

    const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage,
        },
    });

    console.log("✅ Email sent");
}

module.exports = sendMail;