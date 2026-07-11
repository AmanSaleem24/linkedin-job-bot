function extractDescription(lines, title) {

    if (!title)
        return "";

    const index = lines.indexOf(title);

    if (index === -1)
        return "";

    return lines
        .slice(index + 1)
        .filter(line =>
            line !== "Follow" &&
            line !== "Subscribe" &&
            line !== "See translation" &&
            line !== "Edited" &&
            line !== "Visit my website" &&
            line !== "… more" &&
            !/^\d+$/.test(line)
        )
        .join("\n")
        .trim();
}

module.exports = extractDescription;