async function extractRecruiter(post) {

    const profileLinks = post.locator('a[href*="/in/"]');

    let recruiter = null;
    let profileUrl = null;

    if (await profileLinks.count() >= 2) {

        recruiter = (await profileLinks.nth(1).innerText())
            .replace(/•.*$/, "")
            .trim();

        profileUrl =
            await profileLinks.nth(1).getAttribute("href");
    }
    else {

        const company = post.locator('[aria-label^="View company:"]');

        if (await company.count()) {

            recruiter = (
                await company.first().getAttribute("aria-label")
            )
                .replace("View company:", "")
                .trim();
        }
    }

    return {
        recruiter,
        profileUrl
    };
}

module.exports = extractRecruiter;