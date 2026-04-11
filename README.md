# iBOS Online Assessment Platform

Frontend for an online assessment system built with Next.js, TypeScript, Tailwind CSS, Redux Toolkit, and TanStack Query.

This app supports:

- User registration and login
- Employer dashboard for viewing online tests
- Creating an online test
- Adding and removing test questions
- Candidate exam participation with timer, skip, save, completion, and timeout states

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit
- TanStack Query
- React Hook Form + Yup

## Prerequisites

Make sure these are installed on your machine:

- Node.js 18.18+ or 20+
- npm
- A running backend API for authentication, test management, and exam flows

## Environment Setup

This frontend requires a public API base URL.

1. Copy the example env file:

```bash
cp .env.local.example .env.local
```

If you are on Windows PowerShell, use:

```powershell
Copy-Item .env.local.example .env.local
```

2. Set the API URL inside `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

The example file also includes a hosted API URL:

```env
NEXT_PUBLIC_API_URL=https://assessment.mdeves.site
```

If `NEXT_PUBLIC_API_URL` is missing, the app falls back to `https://assessment.mdeves.site`.

## Installation

Install dependencies:

```bash
npm install
```

## Running Locally

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The root route redirects to `/login`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Main Routes

- `/login` - sign in page
- `/register` - account registration page
- `/dashboard` - online test dashboard
- `/dashboard/create` - create test basic information
- `/dashboard/create/questions?testId=<id>` - manage question set for a test
- `/dashboard/exam/[testId]/take` - candidate exam page

## Backend Dependency

This project is frontend-only and depends on a backend API for:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/online-tests`
- `POST /api/online-tests`
- `GET /api/online-tests/:testId/questions`
- `POST /api/online-tests/:testId/questions`
- `DELETE /api/online-tests/:testId/questions/:questionId`
- Candidate exam start, question fetch, answer save, complete, and timeout endpoints

Without a working backend and valid `NEXT_PUBLIC_API_URL`, authentication and exam features will not function.

## Notes

- Auth state is persisted in browser storage and rehydrated on app load.
- The app uses Redux Toolkit for auth state and TanStack Query for server data fetching and caching.
- Employer-only actions such as creating tests and saving questions require signing in with an employer account.
- Candidate exam flow requires signing in with a candidate account.

# iBOS Online Assessment Platform

## Have you worked with any MCP (Model Context Protocol )?

No, Figma MCP maybe, I not confirm

## Which AI tools or processes have you used or recommend to speed up frontend development?

Claude Code

## How would you handle offline mode if a candidate loses internet during an exam?

I’d handle offline mode with an offline-first exam flow:

Cache the current exam, timer reference, and answered questions locally.
Auto-save each answer to local storage or IndexedDB immediately.
Detect connection loss and show an “Offline mode” warning without blocking the candidate.
Let the candidate continue answering while offline.
Queue unsynced answers and submit them automatically when the internet returns.

##

[Demo Video](https://drive.google.com/file/d/1bWZhogOZbDEiV125GOxFpHOVc7BX4B5u/view)
