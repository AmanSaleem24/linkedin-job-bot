const sleep = require("./sleep");

async function retry(fn, options = {}) {
    const {
        attempts = 3,
        initialDelay = 2000,
        backoffMultiplier = 2,
        shouldRetry = () => true
    } = options;

    let delay = initialDelay;
    let lastError;

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;

            if (attempt === attempts || !shouldRetry(err)) {
                throw err;
            }

            console.log(
                `Retry ${attempt}/${attempts} failed. Waiting ${delay} ms...`
            );

            await sleep(delay);

            delay *= backoffMultiplier;
        }
    }

    throw lastError;
}

module.exports = retry;