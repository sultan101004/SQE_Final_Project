# Deployment Instructions
## RealWorld Quality Engineering Project

This document provides comprehensive deployment instructions for the RealWorld application across different environments.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Staging Environment Deployment](#staging-environment-deployment)
5. [Production Environment Deployment](#production-environment-deployment)
6. [CI/CD Pipeline Deployment](#cicd-pipeline-deployment)
7. [Monitoring Setup](#monitoring-setup)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **Docker**: v20.x or higher
- **Docker Compose**: v2.x or higher
- **Git**: Latest version
- **PostgreSQL**: v15 or higher (for local development without Docker)

### Required Accounts
- GitHub account (for CI/CD)
- Cloud provider account (AWS/Azure/GCP) for staging/production
- Container registry access (GitHub Container Registry, Docker Hub, etc.)

---

## Local Development Setup

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SQE_Project
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

4. **Seed the database (optional)**
   ```bash
   docker-compose exec backend npx prisma db seed
   ```

5. **Access the application**
   - Frontend: http://localhost:4100
   - Backend API: http://localhost:3000/api
   - Database: localhost:5432

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/realworld
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   PORT=3000
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

6. **Start the server**
   ```bash
   npm start
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**
   Edit `src/agent.js` and set `API_ROOT` to `http://localhost:3000/api`

4. **Start the development server**
   ```bash
   npm start
   ```

---

## Docker Deployment

### Building Docker Images

#### Backend Image
```bash
cd backend
docker build -t realworld-backend:latest .
```

#### Frontend Image
```bash
cd frontend
docker build -t realworld-frontend:latest .
```

### Running Containers

```bash
# Start database
docker run -d \
  --name postgres \
  -e POSTGRES_USER=realworld \
  -e POSTGRES_PASSWORD=realworld123 \
  -e POSTGRES_DB=realworld \
  -p 5432:5432 \
  postgres:15-alpine

# Start backend
docker run -d \
  --name backend \
  --link postgres:postgres \
  -e DATABASE_URL=postgresql://realworld:realworld123@postgres:5432/realworld \
  -e JWT_SECRET=your-secret-key \
  -e NODE_ENV=production \
  -p 3000:3000 \
  realworld-backend:latest

# Start frontend
docker run -d \
  --name frontend \
  --link backend:backend \
  -e REACT_APP_API_URL=http://localhost:3000/api \
  -p 4100:80 \
  realworld-frontend:latest
```

---

## Staging Environment Deployment

### Using GitHub Actions (Automated)

The CI/CD pipeline automatically deploys to staging when code is pushed to `main` or `develop` branches.

**Manual Trigger:**
1. Go to GitHub Actions tab
2. Select "CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Manual Staging Deployment

#### AWS Deployment

1. **Set up AWS ECS/Fargate**
   ```bash
   # Create ECS cluster
   aws ecs create-cluster --cluster-name realworld-staging
   
   # Create task definition
   aws ecs register-task-definition --cli-input-json file://task-definition.json
   
   # Create service
   aws ecs create-service --cluster realworld-staging --service-name backend --task-definition realworld-backend
   ```

2. **Set environment variables in AWS**
   - Use AWS Systems Manager Parameter Store or Secrets Manager
   - Configure DATABASE_URL, JWT_SECRET, etc.

#### Azure Deployment

1. **Set up Azure Container Instances**
   ```bash
   az container create \
     --resource-group realworld-staging \
     --name realworld-backend \
     --image <registry>/realworld-backend:latest \
     --environment-variables DATABASE_URL=<url> JWT_SECRET=<secret>
   ```

#### Heroku Deployment

1. **Install Heroku CLI**
2. **Login and create app**
   ```bash
   heroku login
   heroku create realworld-staging
   ```

3. **Set environment variables**
   ```bash
   heroku config:set DATABASE_URL=<url> JWT_SECRET=<secret> -a realworld-staging
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

---

## Production Environment Deployment

### Pre-Deployment Checklist

- [ ] All tests passing in CI/CD pipeline
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Database migrations tested in staging
- [ ] Environment variables configured
- [ ] Monitoring tools configured
- [ ] Backup strategy in place
- [ ] Rollback plan prepared

### Production Deployment Steps

#### 1. Database Setup

```bash
# Create production database
# Use managed PostgreSQL service (AWS RDS, Azure Database, etc.)
# Ensure backups are enabled
# Configure connection pooling
```

#### 2. Backend Deployment

```bash
# Build production image
docker build -t realworld-backend:production ./backend

# Tag for registry
docker tag realworld-backend:production <registry>/realworld-backend:production

# Push to registry
docker push <registry>/realworld-backend:production

# Deploy to production
# (Use your cloud provider's deployment method)
```

#### 3. Frontend Deployment

```bash
# Build production image
docker build -t realworld-frontend:production ./frontend

# Tag for registry
docker tag realworld-frontend:production <registry>/realworld-frontend:production

# Push to registry
docker push <registry>/realworld-frontend:production

# Deploy to production
# (Use your cloud provider's deployment method)
```

#### 4. Environment Variables

Set the following in your production environment:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
PORT=3000
API_URL=https://api.yourdomain.com
```

#### 5. Run Migrations

```bash
# Connect to production backend
docker exec -it <backend-container> npx prisma migrate deploy
```

#### 6. Verify Deployment

```bash
# Health check
curl https://api.yourdomain.com/api/tags

# Check logs
docker logs <backend-container>
docker logs <frontend-container>
```

---

## CI/CD Pipeline Deployment

The GitHub Actions workflow (`.github/workflows/ci-cd-pipeline.yml`) handles automated deployment:

### Pipeline Stages

1. **Source Stage**: Code checkout and validation
2. **Build Stage**: Compile code and build Docker images
3. **Test Stage**: Run unit and E2E tests
4. **Staging Stage**: Deploy to staging environment
5. **Deploy Stage**: Deploy to production (main branch only)

### Configuration

1. **Set up GitHub Secrets**
   - Go to Repository Settings → Secrets and variables → Actions
   - Add required secrets:
     - `DATABASE_URL` (staging/production)
     - `JWT_SECRET`
     - Cloud provider credentials
     - Container registry credentials

2. **Configure Environments**
   - Go to Repository Settings → Environments
   - Create `staging` and `production` environments
   - Add environment-specific secrets

3. **Enable GitHub Actions**
   - Ensure Actions are enabled in repository settings
   - Workflow will trigger on push/PR to main/develop branches

---

## Monitoring Setup

### Application Monitoring

#### New Relic Setup

1. **Install New Relic agent**
   ```bash
   npm install newrelic --save
   ```

2. **Configure New Relic**
   Create `newrelic.js`:
   ```javascript
   exports.config = {
     app_name: ['RealWorld App'],
     license_key: process.env.NEW_RELIC_LICENSE_KEY,
     logging: {
       level: 'info'
     }
   };
   ```

3. **Add to application**
   ```javascript
   require('newrelic');
   // ... rest of your app
   ```

#### Sentry Setup

1. **Install Sentry SDK**
   ```bash
   npm install @sentry/node @sentry/react
   ```

2. **Configure Sentry (Backend)**
   ```javascript
   const Sentry = require('@sentry/node');
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV
   });
   ```

3. **Configure Sentry (Frontend)**
   ```javascript
   import * as Sentry from '@sentry/react';
   Sentry.init({
     dsn: process.env.REACT_APP_SENTRY_DSN
   });
   ```

### Logging

#### Backend Logging
- Use Winston or Pino for structured logging
- Configure log levels based on environment
- Set up log aggregation (CloudWatch, Azure Monitor, etc.)

#### Frontend Logging
- Use console logging for development
- Integrate with error tracking (Sentry)
- Monitor user interactions

### Health Checks

Configure health check endpoints:

```javascript
// Backend health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

---

## Troubleshooting

### Common Issues

#### Database Connection Errors
- Verify DATABASE_URL is correct
- Check database is accessible
- Verify network connectivity
- Check firewall rules

#### Build Failures
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

#### Deployment Failures
- Check CI/CD logs
- Verify environment variables
- Check container registry access
- Verify cloud provider credentials

#### Performance Issues
- Check database query performance
- Monitor API response times
- Check container resource limits
- Review application logs

### Getting Help

- Check GitHub Issues
- Review application logs
- Contact DevOps team
- Check monitoring dashboards

---

## Rollback Procedures

### Quick Rollback

1. **Identify previous working version**
   ```bash
   git log --oneline
   ```

2. **Revert to previous version**
   ```bash
   git revert <commit-hash>
   git push
   ```

3. **Or redeploy previous Docker image**
   ```bash
   docker pull <registry>/realworld-backend:<previous-tag>
   # Redeploy using previous image
   ```

### Database Rollback

```bash
# List migrations
npx prisma migrate status

# Rollback to specific migration
npx prisma migrate resolve --rolled-back <migration-name>
```

---

## Security Considerations

1. **Secrets Management**
   - Never commit secrets to repository
   - Use environment variables or secrets manager
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL/TLS connections
   - Restrict network access
   - Regular backups

3. **Application Security**
   - Keep dependencies updated
   - Use HTTPS in production
   - Implement rate limiting
   - Regular security audits

---

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Perform security audits
- [ ] Monitor and optimize performance
- [ ] Review and update documentation
- [ ] Backup verification

---

## Support

For deployment issues or questions:
- GitHub Issues: [Repository URL]/issues
- Email: [Support Email]
- Documentation: [Documentation URL]

---

**Last Updated:** December 2024  
**Version:** 1.0

