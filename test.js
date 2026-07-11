const applyToJob = require("./gmail/applyToJob");

(async () => {

    await applyToJob({
        recruiter: "Aman Saleem",
        email: "piouskareem@gmail.com",
        company: "Lakadi Enaterprises",
        title: "Full Stack Developer Intern"
    });

})();