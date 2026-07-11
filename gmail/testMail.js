const sendMail = require("./sendMailWithAttachment");

(async () => {
    await sendMail({
    to: "piouskareem@gmail.com",
    subject: "Resume Attachment Test",
    body: "Hello,\n\nPlease find my resume attached.\n\nRegards",
    attachmentPath: "../resume/resume.pdf",
});
})();