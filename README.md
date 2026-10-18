# Stadium Reservation System

Academic full-stack project for booking sports facilities, with a React frontend,
an Express API, MongoDB persistence and optional Gemini review summaries.

## Features

- User registration and JWT authentication.
- Available slots, reservations and owner-only cancellation.
- Administrator-only stadium and availability management.
- Reviews and optional AI-generated summaries.

## Architecture

`React / Vite -> Express REST API -> MongoDB` (Gemini is called by the backend.)

Source: `frontend/` for the interface and `backend/` for routes, controllers and models.

## Local setup

For a recruiter walkthrough with isolated fictional data, see [DEMO.md](DEMO.md).
It includes local startup, generated demo accounts and a three-minute visit.

Use Node.js 22+ and a local MongoDB instance. In `backend/`, copy `.env.example`
to `.env`, generate a unique JWT secret using the command in the example, and
set the database URI. A Gemini key is optional and must never be committed.

```sh
cd backend
npm ci
npm run dev
```

In another terminal:

```sh
cd frontend
npm ci
npm run dev
```

The interface runs on http://localhost:5173 and the API defaults to port 5000.

## Administration

Public registration always creates an ordinary account. To bootstrap an admin,
set `ADMIN_EMAIL`, `ADMIN_USERNAME` and `ADMIN_PASSWORD` (12+ characters) in your
local shell, then run `npm run create-admin` from `backend/`. This refuses to
promote an existing account. Clear the bootstrap variables afterwards.

## Verification

```sh
cd backend
npm test
```

The regression suite exercises public registration, role checks, reservation
ownership and concurrent slot claims through HTTP, with isolated model doubles.
It does not replace integration testing against MongoDB. Frontend build:
`cd frontend && npm run build`. Both checks also run in GitHub Actions.

## Limitations and deployment

This is an academic project, not a claim of production certification. Slot claims
are atomic, but the claim and reservation insert are separate writes; an abrupt
process termination between them can leave a slot locked. A production deployment
should use a MongoDB transaction on a replica set or add reconciliation.

Previously published credentials must be revoked/replaced; removing a file does
not invalidate its old values or erase Git history. Only `.env.example` belongs
in the repository. Configure HTTPS, restricted CORS, rate limiting and monitoring
before any public deployment. Use synthetic accounts and data for demonstrations.

Author: [Yassine Ben Hawala](https://portfoliohawala.vercel.app/).
