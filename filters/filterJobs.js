function filterJobs(jobs, options = {}) {

    const {
        all = [],
        any = [],
        requireEmail = true,
        requirePhone = false
    } = options;

    return jobs.filter(job => {

        if (requireEmail && !job.email)
            return false;

        if (requirePhone && !job.phone)
            return false;

        const text = `${job.title || ""} ${job.description || ""}`
            .toLowerCase();

        // Must contain ALL words
        if (!all.every(word =>
            text.includes(word.toLowerCase())
        ))
            return false;

        // If any[] is empty, ignore it
        if (any.length === 0)
            return true;

        // At least ONE should match
        return any.some(word =>
            text.includes(word.toLowerCase())
        );

    });

}

module.exports = filterJobs;