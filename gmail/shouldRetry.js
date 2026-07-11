function shouldRetry(err) {
    const message = err.message.toLowerCase();

    return (
        message.includes("timeout") ||
        message.includes("network") ||
        message.includes("socket") ||
        message.includes("rate") ||
        message.includes("429") ||
        message.includes("500") ||
        message.includes("503")
    );
}

module.exports = shouldRetry;