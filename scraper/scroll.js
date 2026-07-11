async function scroll(page) {

    const posts = page.locator('[role="listitem"]');
    const previousCount = await posts.count();

    // Scroll down
    await page.mouse.wheel(0, 5000);

    try {
        // Wait until more posts are loaded
        await page.waitForFunction(
            (count) => {
                return document.querySelectorAll('[role="listitem"]').length > count;
            },
            previousCount,
            {
                timeout: 5000
            }
        );
    } catch {
        // No new posts loaded within 5 seconds
    }

    const currentCount = await posts.count();

    return currentCount > previousCount;
}

module.exports = scroll;