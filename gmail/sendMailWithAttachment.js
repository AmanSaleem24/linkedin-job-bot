const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");

const resumePath = path.resolve(__dirname, "../resume/resume.pdf");

console.log(resumePath);
console.log(fs.existsSync(resumePath));

const credentials = require("../credentials.json");
const token = require("../token.json");

async function sendMailWithAttachment({
    to,
    subject,
    body,
}) {
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


    const mail = new MailComposer({
        to,
        subject,
        text: body,
        attachments: [
            {
                filename: "resume.pdf",
                path: resumePath,
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