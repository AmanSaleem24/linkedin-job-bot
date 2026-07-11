# LinkedIn Job Bot

This bot searches recent LinkedIn posts for jobs, filters them by your preferences, and sends application emails with your resume attached.

## Prerequisites

- Node.js 18 or later
- A LinkedIn account
- A Gmail account
- A PDF resume at `resume/resume.pdf`
- A Google OAuth desktop-client file named `credentials.json` in the project root

## Install

```bash
npm install
npx playwright install chromium
```

## Configure Gmail

1. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project.
2. Enable the **Gmail API**.
3. Configure the OAuth consent screen and add your Gmail address as a test user when the app is in testing.
4. Create OAuth client credentials for a **Desktop app**.
5. Download the JSON file and save it as `credentials.json` in the project root.

The bot requests only the `gmail.send` permission.

## Configure the bot

Update your personal details, search query, filters, and email delay in `config.js`.

Place your resume at:

```text
resume/resume.pdf
```

## First-time setup

Run the unified setup wizard:

```bash
npm run setup
```

It opens two login flows in sequence:

1. Log in to LinkedIn. The browser session is saved to `storage/linkedinStorageSession.json`.
2. Authorize Gmail sending. The OAuth token is saved to `token.json`.

After both steps finish, setup prints `Setup complete.`

## Run the bot

```bash
npm run initiate
```

The bot uses the saved LinkedIn session to find job posts and uses Gmail OAuth to send application emails.

## Reset logins

To log in with different accounts or refresh expired access, delete the saved credentials and run setup again:

```bash
rm -f storage/linkedinStorageSession.json token.json
npm run setup
```

## Security

Do not commit or share these files:

- `credentials.json`
- `token.json`
- `storage/linkedinStorageSession.json`
- `resume/resume.pdf`

`credentials.json`, `token.json`, the LinkedIn session file, and PDFs in `resume/` are ignored by Git.

## Notes

- Gmail website cookies are not used. Mail is sent through the Gmail API using `credentials.json` and `token.json`.
- Review `config.js` and the generated job list before sending emails.
- LinkedIn or Google may require you to log in again if their session or authorization expires.
