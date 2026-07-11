function extractContact(text) {

    const email =
        text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0] ?? null;

    const phone =
        text.match(/\b\d{10}\b/)?.[0] ?? null;

    return {
        email,
        phone
    };
}

module.exports = extractContact;