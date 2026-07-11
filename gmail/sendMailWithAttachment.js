const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");
const config = require("../config");

const credentials = require(config.GOOGLE_CREDENTIALS_PATH);
const token = require(config.GOOGLE_TOKEN_PATH);

async function sendMailWithAttachment({
    to,
    subject,
    body,
}) {
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


    const mail = new MailComposer({
        to,
        subject,
        text: body,
        attachments: [
            {
                filename: config.RESUME_FILENAME,
                path: config.RESUME_PATH,
            },
        ],
    });

    const message = await mail.compile().build();

    const encodedMessage = message
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

module.exports = sendMailWithAttachment;
