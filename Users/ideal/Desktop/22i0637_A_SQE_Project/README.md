# 22i0637 A SQE Project

Monorepo for the RealWorld **Conduit** app, prepared for Software Quality Engineering coursework.

## Selected Application
- Frontend Repo: https://github.com/romansndlr/react-vite-realworld-example-app
- Backend Repo: https://github.com/gothinkster/node-express-realworld-example-app

## Structure
- `backend/` – Node/Express RealWorld backend.
- `frontend/` – React/Vite RealWorld frontend.
- `package.json` – root scripts to run both via `concurrently`.
- `docker-compose.yml` – build/run backend (3000) and frontend (5173).
- `Jenkinsfile` – pipeline for backend tests, frontend build, and Docker build.
- `.github/workflows/*.yml` – GitHub Actions for backend, frontend, and Docker builds.

## Getting Started
1) Install root tools and app deps:  
   `npm install`
2) Run both apps:  
   `npm start`
   - Backend: port 3000 (`/` returns status, `/api/health` returns `{status:"ok"}`).
   - Frontend: Vite dev server on port 5173.
3) Run tests:  
   `npm test`
4) CI (GitHub Actions):
   - Backend workflow: `.github/workflows/backend.yml` (npm ci + tests).
   - Frontend workflow: `.github/workflows/frontend.yml` (npm ci + build).
   - Docker workflow: `.github/workflows/docker.yml` (builds & pushes backend/frontend images to `docker.io/sultan101004`).  
     Set secrets `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN`.
5) Jenkins:
   - Pipeline defined in `Jenkinsfile` (checkout, backend Jest tests, frontend build, Docker build).
   - Requires Node 18 and Docker on the agent; set credential `REGISTRY_CREDS` (Docker Hub user/password for `docker.io/sultan101004`).
6) Docker:
   - Build images: `docker-compose build`
   - Run services: `docker-compose up` (backend on 3000, frontend on 5173).
7) Cypress:
   - Base URL set to `http://localhost:5173`.
   - Smoke test: `cd frontend && npm run cy:run`

## Notes
- Root `.gitignore` covers common Node/editor artifacts.
- Customize per-app configs (env, linting, formatting, Docker) as needed for your pipeline.
- For LAN access, allow inbound on frontend port 5173 via Windows Firewall (or adjust port). Backend stays on 3000 by default.
