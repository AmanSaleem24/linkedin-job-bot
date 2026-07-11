function extractTitle(lines) {

    const followIndex = lines.indexOf("Follow");

    if (followIndex === -1)
        return null;

    const content = lines.slice(followIndex + 1);

    const greetings = [
        "hi",
        "hello",
        "hi all",
        "dear all",
        "good morning",
        "good evening"
    ];

    for (const line of content) {

        const lower = line.toLowerCase();

        if (greetings.some(g => lower.startsWith(g)))
            continue;

        if (line.length < 5)
            continue;

        return line;
    }

    return null;
}

module.exports = extractTitle;