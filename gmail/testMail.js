const sendMail = require("./sendMailWithAttachment");
const { TEST_RECIPIENT_EMAIL } = require("../config");

(async () => {
    if (!TEST_RECIPIENT_EMAIL) {
        throw new Error("Set TEST_RECIPIENT_EMAIL in .env before sending a test email.");
    }

    await sendMail({
    to: TEST_RECIPIENT_EMAIL,
    subject: "Resume Attachment Test",
    body: "Hello,\n\nPlease find my resume attached.\n\nRegards",
});
})();
