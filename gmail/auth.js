const fs = require("fs");
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
];

async function authorize() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: path.join(__dirname, "../credentials.json"),
  });

  fs.writeFileSync(
    path.join(__dirname, "../token.json"),
    JSON.stringify(auth.credentials, null, 2)
  );

  console.log("✅ Authorization successful");
  console.log("Token saved to token.json");

  return auth;
}

authorize().catch(console.error);