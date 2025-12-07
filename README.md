# RealWorld Quality Engineering Project

This project combines the RealWorld Node/Express Backend and React/Redux Frontend into a single mono-repo structure for Quality Engineering purposes.

## Structure

- `backend/`: Node/Express codebase
- `frontend/`: React/Redux codebase
- `.github/workflows/`: CI/CD Pipeline definitions
- `Test Plan.md`: Software Test Plan

## Setup

1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm start
    ```

2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm start
    ```

## Testing

- **Backend**: `cd backend && npm test`
- **Frontend**: `cd frontend && npx cypress open`
