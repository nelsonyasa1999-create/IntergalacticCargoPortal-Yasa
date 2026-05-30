# IntergalacticCargoPortal-Yasa

Full-stack cargo manifest portal with authentication, role-based access, manifest upload processing, and a React dashboard.

**Repository:** https://github.com/nelsonyasa1999-create/IntergalacticCargoPortal-Yasa

## Stack

- **Backend:** Node.js, Express, SQLite, JWT, bcryptjs, multer
- **Frontend:** React (Vite), React Router

## Prerequisites

- Node.js 18+ and npm
- macOS users: port **5000** is often used by AirPlay — this project uses **5001** for the API

## Local setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API runs at **http://localhost:5001**

### 2. Frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at **http://localhost:5173** (proxies API calls to the backend).

## Test accounts

Create via Signup in the UI, or curl:

**Admin** (email ends with `@nebula-corp.com`):

```json
{ "email": "captain@nebula-corp.com", "password": "secret123" }
```

**Standard** (any other email):

```json
{ "email": "pilot@galactic-mail.com", "password": "secret123" }
```

## Sample manifest upload

Use `backend/sample-data/manifest.txt` when testing Admin upload.

## API endpoints

| Method | Path | Access |
|--------|------|--------|
| GET | `/health` | Public |
| POST | `/signup` | Public |
| POST | `/login` | Public |
| POST | `/api/upload` | Admin + JWT |
| GET | `/api/cargo` | Authenticated + JWT |

## Frontend rules (Task 3)

- **Admin:** upload button + cargo table, weights in **KG**
- **Standard:** table only (no upload in DOM), weights in **LBS** (KG × 2.20462)
- **Sort:** heaviest → lightest; **Earth** always at bottom

## Project structure

```
backend/          API + SQLite
frontend/         React dashboard
```
