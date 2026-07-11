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

Copy the environment template and fill in your personal details:

```bash
cp .env.example .env
```

Edit `.env` to configure your profile, search query, filters, browser behavior, email delays, and resume path. Retry settings remain in `config.js`.

### Search and filter jobs

Set `SEARCH_QUERY` in `.env` to choose what LinkedIn searches for. For example:

```env
SEARCH_QUERY="frontend developer intern"
```

You can use any LinkedIn search phrase, such as `react developer`, `backend engineer intern`, or `java developer fresher`.

Changing only `SEARCH_QUERY` is enough to search for a different role. By default, the bot keeps posts with a recruiter email address from that LinkedIn search.

To switch job types later, edit only this value in `.env` and run the bot again:

```env
SEARCH_QUERY="backend developer intern"
```

```bash
npm run initiate
```

You can optionally add stricter comma-separated filters in `.env`:

```env
FILTER_ALL="full stack"
FILTER_ANY="react,node,mern,frontend,backend"
REQUIRE_EMAIL=true
```

- `FILTER_ALL`: every listed term must appear in the job title or description.
- `FILTER_ANY`: at least one listed term must appear.
- `REQUIRE_EMAIL`: when `true`, skips posts where no recruiter email was found.

Leave `FILTER_ALL` and `FILTER_ANY` empty to disable extra filtering. With the example above, a post must mention `full stack`, at least one `FILTER_ANY` term, and include an email address. Update these values before running `npm run initiate` to target different roles.

By default, place your resume at:

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

`credentials.json`, `token.json`, the LinkedIn session file, `.env`, and PDFs in `resume/` are ignored by Git.

## Notes

- Gmail website cookies are not used. Mail is sent through the Gmail API using `credentials.json` and `token.json`.
- Review your `.env` values and the generated job list before sending emails.
- LinkedIn or Google may require you to log in again if their session or authorization expires.
