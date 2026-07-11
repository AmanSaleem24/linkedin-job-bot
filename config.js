module.exports = {

    SEARCH_QUERY: "full stack developer intern",

    FILTERS: {
        all: ["full stack"],
        any: ["react", "node", "mern", "frontend", "backend"],
        requireEmail: true
    },

    MAX_SCROLLS: 15,
    TARGET_EMAILS: 20,

    EMAIL_DELAY: {
        min: 15000,
        max: 30000
    },

    NAME: "Aman Saleem",
    EMAIL: "nameillahi@gmail.com",
    PHONE: "+91-9555303228",
    LINKEDIN: "https://www.linkedin.com/in/aman-saleem-0425032a4/",
    GITHUB: "https://github.com/AmanSaleem24e",

    RETRY: {
        attempts: 3,
        initialDelay: 2000,
        backoffMultiplier: 2
    }
};
