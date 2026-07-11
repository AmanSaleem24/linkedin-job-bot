const backend = require("./backend");
const frontend = require("./frontend");
const fullstack = require("./fullstack");
const react = require("./react");
const generic = require("./generic");

const templates = {
    fullstack: {
        fn: fullstack,
        keywords: [
            "full stack",
            "fullstack",
            "mern",
            "mean"
        ]
    },

    frontend: {
        fn: frontend,
        keywords: [
            "frontend",
            "front end",
            "html",
            "css",
            "ui",
            "ux"
        ]
    },

    react: {
        fn: react,
        keywords: [
            "react",
            "next",
            "next.js",
            "nextjs"
        ]
    },

    backend: {
        fn: backend,
        keywords: [
            "backend",
            "back end",
            "node",
            "express",
            "api",
            "rest api"
        ]
    },
};

function chooseTemplate(job) {

    const text =
        `${job.title} ${job.description}`.toLowerCase();

    let bestTemplate = null;
    let bestScore = 0;

    for (const template of Object.values(templates)) {

        let score = 0;

        for (const keyword of template.keywords) {

            if (text.includes(keyword)) {
                score++;
            }

        }

        if (score > bestScore) {
            bestScore = score;
            bestTemplate = template.fn;
        }

    }

    if (bestTemplate) {
        return bestTemplate(job);
    }

    return generic(job);
}

module.exports = chooseTemplate;