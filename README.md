# RealWorld Quality Engineering Project

This project implements a comprehensive Quality Engineering solution for the RealWorld application (a Medium.com clone) with a complete CI/CD pipeline, automated testing, and deployment configurations.

## 📋 Project Overview

This project fulfills the requirements for the SQE Project (Comprehensive Quality Engineering for Open-Source Applications) by implementing:

- ✅ Comprehensive Test Plan (IEEE Standard format)
- ✅ Complete CI/CD Pipeline (5 stages: Source, Build, Test, Staging, Deploy)
- ✅ Automated Testing (Jest for backend, Cypress for frontend)
- ✅ Docker Containerization
- ✅ Deployment Documentation
- ✅ Monitoring and Error Tracking Setup

## 📁 Project Structure

- `backend/`: Node/Express/Prisma backend codebase
- `frontend/`: React/Redux frontend codebase
- `.github/workflows/`: GitHub Actions CI/CD pipeline
- `Test Plan.md`: Comprehensive IEEE Standard test plan
- `DEPLOYMENT.md`: Complete deployment instructions
- `monitoring-setup.md`: Monitoring and error tracking setup guide
- `PROJECT_SUMMARY.md`: Project implementation summary

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Access the application
# Frontend: http://localhost:4100
# Backend API: http://localhost:3000/api
# Health Check: http://localhost:3000/health
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 🧪 Testing

### Backend Tests (Jest)
```bash
cd backend
npm test
# Coverage report: npm test -- --coverage
```

### Frontend Tests (Cypress)
```bash
cd frontend
# Interactive mode
npx cypress open

# Headless mode
npx cypress run
```

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline automatically:
1. **Source Stage**: Checks out code and validates
2. **Build Stage**: Compiles code and builds Docker images
3. **Test Stage**: Runs unit tests (Jest) and E2E tests (Cypress)
4. **Staging Stage**: Deploys to staging environment
5. **Deploy Stage**: Deploys to production (main branch only)

**Trigger**: Push to `main`/`develop` or Pull Requests

## 📚 Documentation

- **[Test Plan](Test Plan.md)**: Comprehensive IEEE Standard test plan
- **[Deployment Guide](DEPLOYMENT.md)**: Complete deployment instructions
- **[Monitoring Setup](monitoring-setup.md)**: Monitoring and error tracking
- **[Project Summary](PROJECT_SUMMARY.md)**: Implementation summary

## 🛠️ Tools & Technologies

- **Testing**: Jest, Cypress, Prisma Mock
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Docker Compose
- **Monitoring**: Sentry, New Relic, Winston (setup instructions provided)

## 📊 Test Coverage

- **Backend**: 80% code coverage target (Jest unit tests)
- **Frontend**: Complete E2E test coverage (Cypress)
- **Test Files**: 
  - Backend: `backend/src/tests/`
  - Frontend: `frontend/cypress/e2e/`

## 🔍 Health Checks

- **Backend Health**: `GET /health`
- Returns: Status, uptime, database connection, memory usage

## 📝 Project Requirements

This project meets all requirements from SQE Project_F25.pdf:
- ✅ Test Plan Document (IEEE Standard)
- ✅ CI/CD Pipeline Configuration
- ✅ Test Results & Reports
- ✅ Deployment Instructions
- ✅ Monitoring Setup

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

MIT License
