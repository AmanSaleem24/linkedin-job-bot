const fs = require("fs");
const { authenticate } = require("@google-cloud/local-auth");
const config = require("../config");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
];

async function authorizeGmail() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: config.GOOGLE_CREDENTIALS_PATH,
  });

  fs.writeFileSync(
    config.GOOGLE_TOKEN_PATH,
    JSON.stringify(auth.credentials, null, 2)
  );
  console.log("✅ Authorization successful");
  console.log(`Token saved to ${config.GOOGLE_TOKEN_PATH}`);
}

module.exports = authorizeGmail;
