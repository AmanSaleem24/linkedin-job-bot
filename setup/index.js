const setupLinkedIn = require("./setupLinkedIn");
const authorizeGmail = require("../gmail/auth");

(async () => {
  console.log("Step 1/2: Log in to LinkedIn");
  await setupLinkedIn();

  console.log("Step 2/2: Authorize Gmail");
  await authorizeGmail();

  console.log("Setup complete.");
})();