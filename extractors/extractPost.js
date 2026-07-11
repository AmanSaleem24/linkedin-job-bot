const { cleanLines } = require("./utils");
const extractRecruiter = require("./recruiter");
const extractContact = require("./contact");
const extractTitle = require("./title");
const extractDescription = require("./description");
const crypto = require("crypto");

async function extractPost(post) {

    const text = await post.innerText();

    const lines = cleanLines(text);

    const {
        recruiter,
        profileUrl
    } = await extractRecruiter(post);

    const {
        email,
        phone
    } = extractContact(text);

    const title = extractTitle(lines);

    const description =
        extractDescription(lines, title);

    const time =
        text.match(/\b\d+\s*(m|min|h|d|w)\b/i)?.[0] ?? null;


    const id = crypto
        .createHash("sha256")
        .update(
            [
                email?.trim().toLowerCase(),
                title?.trim().toLowerCase(),
                description?.trim().toLowerCase()
            ].join("|")
        )
        .digest("hex");


    return {
        id,

        recruiter,

        profileUrl,

        time,

        email,

        phone,

        title,

        description
    };
}

module.exports = extractPost;