const { google } = require("googleapis");
const config = require("../config");

const credentials = require(config.GOOGLE_CREDENTIALS_PATH);
const token = require(config.GOOGLE_TOKEN_PATH);

async function sendMail({ to, subject, body }) {
    const { client_id, client_secret } = credentials.installed;

    const auth = new google.auth.OAuth2(
        client_id,
        client_secret,
        config.GOOGLE_REDIRECT_URI
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
