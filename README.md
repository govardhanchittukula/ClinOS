# ClinOS – Clinical Operations System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-clin--os.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://clin-os.vercel.app)
[![Deploy on Render](https://img.shields.io/badge/Deploy%20Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-ClinOS-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/govardhanchittukula/ClinOS)

> 🚀 **Live Application:** [**https://clin-os.vercel.app**](https://clin-os.vercel.app)
>
> **ClinOS** is a **modern, enterprise‑grade, multi‑agent clinical orchestration platform** built with a **React + Vite** frontend, a **Node.js/Express** backend, and **Supabase** for authentication and data storage. The UI features a premium, Apple/Linear-inspired responsive experience (glass‑morphism, smooth Anime.js micro‑animations, and standard clinical workflows).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Running the Application Locally](#running-the-application-locally)
6. [Build & Deploy](#build--deploy)
7. [Demo Credentials](#demo-credentials)
8. [Environment Variables](#environment-variables)
9. [Folder Structure](#folder-structure)
10. [Contributing](#contributing)
11. [License](#license)
12. [Acknowledgements](#acknowledgements)

---

## Project Overview

ClinOS (Clinical Operations System) streamlines the workflow of healthcare professionals by orchestrating **AI‑driven agents** that generate patient‑specific care plans, prescriptions, and diagnostic recommendations.  The platform demonstrates how autonomous agents can be wired together in a secure, multi‑tenant SaaS environment.

> **Note** – This repository contains **only the UI polish and layout standardisation** performed on the existing code base. No business logic, APIs, routing, or state‑management have been altered.

---

## Features

- **Shared Layout** – Sidebar → Top Header → Compact Medical Disclaimer → Page content
- **Premium UI** – modern color palette, glass‑morphism, smooth micro‑animations, responsive design, dark/light mode
- **Role‑Based Dashboards** – Physician, Nurse/Practitioner, Patient portal
- **Realtime Workflow Execution** – Server‑Sent Events (SSE) streaming of agent logs
- **Supabase Authentication** – Secure login with RBAC
- **Tailored Components** – Reusable UI library (cards, tables, forms) with consistent spacing (`24px / 20px` hierarchy) and rounded corners (`rounded-2xl`)
- **Local Development** – Hot‑module reload, fast Vite dev server

---

## Tech Stack

| Layer | Technology |
|------|-------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Auth / DB** | Supabase (PostgreSQL + auth) |
| **AI Agents** | Gemini / custom LLM orchestration (server side) |
| **CI / Deployment** | (Future) GitHub Actions, Docker |

---

## Getting Started

### Prerequisites

- **Node.js** (v20 or later) – [download](https://nodejs.org/)
- **npm** (or **pnpm**) – the repo uses npm scripts
- **Git**
- **Supabase** project (or use the provided `.env.example` and mock data for local testing)

### Clone the Repository

```bash
git clone https://github.com/your-username/ClinOS.git
cd ClinOS
```

### Install Dependencies

```bash
# Install client dependencies
cd client
npm ci

# Install server dependencies
cd ../server
npm ci
```

### Set Up Environment Variables

Copy the sample environment file and fill in your values:

```bash
cp .env.example .env   # from the repository root
```

Key variables:
- `SUPABASE_URL` & `SUPABASE_ANON_KEY`
- `JWT_SECRET`
- `PORT` (default `5000`)

---

## Running the Application Locally

Open two terminals (or use a process manager like `concurrently`).

1. **Backend**
   ```bash
   cd server
   npm run dev   # runs the Express server on http://localhost:5000
   ```
   The server will report a health check at `http://localhost:5000/api/health`.

2. **Frontend**
   ```bash
   cd client
   npm run dev   # Vite dev server on http://localhost:3000
   ```

The UI will automatically open in your default browser.  You can log in using the demo credentials listed below.

---

## Build & Deploy

```bash
# Build the client for production
cd client
npm run build   # outputs to client/dist

# Build the server (TypeScript compilation)
cd ../server
npm run build   # outputs to server/dist
```

Deploy the `client/dist` folder to any static‑hosting provider (e.g., Netlify, Vercel, Firebase Hosting) and run the compiled Express server (`node server/dist/index.js`) behind your chosen reverse‑proxy.

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Physician** | `dr.sharma@clinos.demo` | `Hackathon2026!` |
| **Nurse / Practitioner** | `nurse.sarah@clinos.demo` | `Hackathon2026!` |
| **Patient** | `patient.john@clinos.demo` | `Hackathon2026!` |

These accounts are pre‑seeded in the local Supabase instance for quick testing.

---

## Environment Variables

The repository includes an `.env.example` file.  Below is a brief description of the most important variables:

- `PORT` – Port for the backend server (default `5000`).
- `SUPABASE_URL` – URL of your Supabase project.
- `SUPABASE_ANON_KEY` – Public anon key for Supabase client.
- `JWT_SECRET` – Secret used to sign JWT tokens.
- `AI_PROVIDER_API_KEY` – (Optional) API key for the LLM service used by the agents.

Make sure to **never commit** your real `.env` file to the public repository.

---

## Folder Structure

```
ClinOS/
├─ client/                 # React + Vite frontend
│  ├─ src/                # Application source
│  │  ├─ components/      # Shared UI components (Sidebar, Navbar, Banner, etc.)
│  │  ├─ pages/           # Page routes (Dashboard, Workflow pages, etc.)
│  │  └─ ...
│  └─ vite.config.ts
├─ server/                 # Express backend
│  ├─ src/                # Server source
│  │  ├─ config/          # Configuration (env.ts, etc.)
│  │  ├─ services/        # Business‑logic services (prescription.service.ts, …)
│  │  └─ ...
│  └─ package.json
├─ .env.example            # Example environment file
├─ README.md               # **You are reading it!**
└─ ...
```

---

## Contributing

Contributions are welcome!  Follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-feature`).
3. Ensure the UI polish guidelines remain intact – avoid changing layout wrappers, routing, or state management.
4. Run `npm test` (if tests are added) and `npm run lint` before committing.
5. Submit a Pull Request with a clear description of the change.

Please read `CODE_OF_CONDUCT.md` and `CONTRIBUTING.md` (to be added) for community standards.

---

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## Acknowledgements

- **Google Antigravity SDK** – for the autonomous agent orchestration.
- **Supabase** – authentication & data layer.
- **Vite** – blazing‑fast development experience.
- **Tailwind CSS** – utility‑first styling (used only where absolutely necessary).
- **Open‑source community** – for the myriad libraries that make modern web development possible.

---

*Happy hacking! 🚀*
