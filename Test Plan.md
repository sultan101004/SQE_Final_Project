# Test Plan

## 1. Introduction
This document outlines the test strategy for the RealWorld Mono-repo application, focusing on the quality engineering environment setup.

## 2. Scope
The scope of this test plan includes:
- **Functional Testing**: Verifying the User Login flow via the frontend UI.
- **Unit/Integration Testing**: Verifying the Backend Authentication API endpoint.
- **CI/CD Integration**: ensuring all tests run automatically on push.

## 3. Test Tools
- **Orchestration**: GitHub Actions (CI/CD Pipeline)
- **Backend Testing**: Jest (White-box/API testing)
- **Frontend Testing**: Cypress (Black-box/E2E testing)

## 4. Test Environment
- **Development (Local)**:
  - Developer workstation (Windows/Mac/Linux)
  - Local instances of Frontend (Port 4100) and Backend (Port 3000)
- **Staging (CI/CD)**:
  - GitHub Actions Runner (Ubuntu Latest)
  - Ephemeral test environment created during workflow execution

## 5. Test Strategy
### 5.1 Backend (White-box)
- **Target**: `/api/users/login`
- **Method**: Send POST request with valid credentials.
- **Success Criteria**: Response Status 200, JWT token present in response.

### 5.2 Frontend (Black-box)
- **Target**: Login User Interface
- **Method**: Automate browser interaction (Visit -> Type -> Click).
- **Success Criteria**: Successful redirection to Home page after login.
