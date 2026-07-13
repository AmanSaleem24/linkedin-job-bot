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


    let postUrl = null;
    try {
        const menuBtn = post.locator('button[aria-label*="control menu"]');
        if (await menuBtn.count() > 0) {
            await menuBtn.click();
            await post.page().waitForTimeout(500);
            
            const menuDropdown = post.page().locator('[role="menuitem"], .artdeco-dropdown__item');
            const mCount = await menuDropdown.count();
            for (let i = 0; i < mCount; i++) {
                const href = await menuDropdown.nth(i).getAttribute("href");
                if (href) {
                    const match = href.match(/urn%3Ali%3A[a-zA-Z0-9%_-]+/i) || href.match(/urn:li:[a-zA-Z0-9_-]+/i);
                    if (match) {
                        const decodedUrn = decodeURIComponent(match[0]);
                        postUrl = `https://www.linkedin.com/feed/update/${decodedUrn}/`;
                        break;
                    }
                }
            }
            // Close the control menu by clicking it again
            await menuBtn.click();
        }
    } catch (e) {
        // ignore
    }

    return {
        id,

        recruiter,

        profileUrl,

        time,

        email,

        phone,

        title,

        description,

        postUrl
    };
}

module.exports = extractPost;