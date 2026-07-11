function cleanLines(text) {
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line =>
            line &&
            line !== "Feed post" &&
            line !== "Visit my website" &&
            line !== "… more" &&
            line !== "​" &&
            !/^\d+$/.test(line)
        );
}

module.exports = { cleanLines };