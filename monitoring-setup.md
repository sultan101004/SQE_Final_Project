# Monitoring and Error Tracking Setup
## RealWorld Quality Engineering Project

This document provides instructions for setting up monitoring and error tracking for the RealWorld application.

---

## Table of Contents

1. [Overview](#overview)
2. [Sentry Setup](#sentry-setup)
3. [New Relic Setup](#new-relic-setup)
4. [Application Logging](#application-logging)
5. [Health Checks](#health-checks)
6. [Performance Monitoring](#performance-monitoring)

---

## Overview

Monitoring and error tracking are essential for maintaining application health in production. This setup includes:

- **Error Tracking**: Sentry for capturing and tracking errors
- **Application Performance Monitoring**: New Relic for performance insights
- **Structured Logging**: Winston for application logs
- **Health Checks**: Endpoint monitoring

---

## Sentry Setup

### Backend Configuration

1. **Install Sentry SDK**
   ```bash
   cd backend
   npm install @sentry/node @sentry/profiling-node
   ```

2. **Create Sentry configuration file** (`backend/src/sentry.ts`)
   ```typescript
   import * as Sentry from '@sentry/node';
   import { ProfilingIntegration } from '@sentry/profiling-node';

   export function initSentry() {
     if (process.env.SENTRY_DSN) {
       Sentry.init({
         dsn: process.env.SENTRY_DSN,
         environment: process.env.NODE_ENV || 'development',
         integrations: [
           new ProfilingIntegration(),
         ],
         tracesSampleRate: 1.0,
         profilesSampleRate: 1.0,
       });
     }
   }
   ```

3. **Initialize Sentry in main.ts**
   ```typescript
   import { initSentry } from './sentry';
   initSentry();
   ```

4. **Add error handler middleware**
   ```typescript
   import * as Sentry from '@sentry/node';
   
   app.use(Sentry.Handlers.requestHandler());
   app.use(Sentry.Handlers.tracingHandler());
   
   // Your routes here
   
   app.use(Sentry.Handlers.errorHandler());
   ```

### Frontend Configuration

1. **Install Sentry SDK**
   ```bash
   cd frontend
   npm install @sentry/react
   ```

2. **Initialize Sentry in `frontend/src/index.js`**
   ```javascript
   import * as Sentry from '@sentry/react';
   
   if (process.env.REACT_APP_SENTRY_DSN) {
     Sentry.init({
       dsn: process.env.REACT_APP_SENTRY_DSN,
       environment: process.env.NODE_ENV,
       integrations: [
         new Sentry.BrowserTracing(),
         new Sentry.Replay(),
       ],
       tracesSampleRate: 1.0,
       replaysSessionSampleRate: 0.1,
       replaysOnErrorSampleRate: 1.0,
     });
   }
   ```

3. **Wrap App component**
   ```javascript
   import { Sentry } from '@sentry/react';
   
   // Wrap your App component
   <Sentry.ErrorBoundary fallback={ErrorFallback}>
     <App />
   </Sentry.ErrorBoundary>
   ```

### Environment Variables

Add to your `.env` files:

**Backend:**
```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**Frontend:**
```env
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## New Relic Setup

### Backend Configuration

1. **Install New Relic agent**
   ```bash
   cd backend
   npm install newrelic --save
   ```

2. **Create New Relic configuration** (`backend/newrelic.js`)
   ```javascript
   'use strict';

   exports.config = {
     app_name: ['RealWorld Backend'],
     license_key: process.env.NEW_RELIC_LICENSE_KEY,
     logging: {
       level: 'info',
       filepath: 'stdout'
     },
     allow_all_headers: true,
     attributes: {
       exclude: [
         'request.headers.cookie',
         'request.headers.authorization',
         'request.headers.proxyAuthorization',
         'request.headers.setCookie*',
         'request.headers.x*',
         'response.headers.cookie',
         'response.headers.authorization',
         'response.headers.proxyAuthorization',
         'response.headers.setCookie*',
         'response.headers.x*'
       ]
     }
   };
   ```

3. **Initialize New Relic in main.ts** (first line)
   ```typescript
   require('newrelic');
   // ... rest of your code
   ```

### Environment Variables

```env
NEW_RELIC_LICENSE_KEY=your-license-key
NEW_RELIC_APP_NAME=RealWorld Backend
```

---

## Application Logging

### Backend Logging with Winston

1. **Install Winston**
   ```bash
   cd backend
   npm install winston
   ```

2. **Create logger configuration** (`backend/src/utils/logger.ts`)
   ```typescript
   import winston from 'winston';

   const logger = winston.createLogger({
     level: process.env.LOG_LEVEL || 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.errors({ stack: true }),
       winston.format.json()
     ),
     defaultMeta: { service: 'realworld-backend' },
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' }),
     ],
   });

   if (process.env.NODE_ENV !== 'production') {
     logger.add(new winston.transports.Console({
       format: winston.format.simple()
     }));
   }

   export default logger;
   ```

3. **Use logger in your application**
   ```typescript
   import logger from './utils/logger';
   
   logger.info('Server started on port 3000');
   logger.error('Database connection failed', { error });
   ```

---

## Health Checks

### Backend Health Check Endpoint

Add to your routes:

```typescript
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;
```

### Frontend Health Check

Add to your API agent:

```javascript
export const healthCheck = () => {
  return agent.get('/health');
};
```

---

## Performance Monitoring

### Backend Performance Metrics

1. **Add response time middleware**
   ```typescript
   app.use((req, res, next) => {
     const start = Date.now();
     res.on('finish', () => {
       const duration = Date.now() - start;
       logger.info('Request completed', {
         method: req.method,
         path: req.path,
         status: res.statusCode,
         duration: `${duration}ms`
       });
     });
     next();
   });
   ```

2. **Monitor database query performance**
   ```typescript
   // In Prisma client setup
   prisma.$use(async (params, next) => {
     const before = Date.now();
     const result = await next(params);
     const after = Date.now();
     
     logger.debug('Database query', {
       model: params.model,
       action: params.action,
       duration: `${after - before}ms`
     });
     
     return result;
   });
   ```

### Frontend Performance Monitoring

1. **Track page load times**
   ```javascript
   // In your App component
   useEffect(() => {
     if (window.performance) {
       const perfData = window.performance.timing;
       const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
       
       // Send to analytics
       console.log('Page load time:', pageLoadTime);
     }
   }, []);
   ```

---

## CI/CD Integration

### GitHub Actions Monitoring

Add monitoring checks to your CI/CD pipeline:

```yaml
- name: Health Check
  run: |
    sleep 10
    curl -f http://localhost:3000/api/health || exit 1
```

---

## Dashboard Setup

### Sentry Dashboard

1. Go to Sentry.io
2. Create a new project
3. Copy the DSN
4. Configure alert rules
5. Set up release tracking

### New Relic Dashboard

1. Go to New Relic
2. Create a new application
3. Copy the license key
4. Configure dashboards
5. Set up alerts

---

## Alert Configuration

### Sentry Alerts

Configure alerts for:
- Error rate thresholds
- New error types
- Performance degradation
- Release issues

### New Relic Alerts

Configure alerts for:
- Response time thresholds
- Error rates
- Throughput changes
- Apdex score

---

## Best Practices

1. **Don't log sensitive information**
   - Passwords, tokens, credit cards
   - Personal identifiable information (PII)

2. **Use appropriate log levels**
   - ERROR: System errors, exceptions
   - WARN: Warning conditions
   - INFO: Informational messages
   - DEBUG: Debug information

3. **Structure your logs**
   - Use JSON format
   - Include context (user ID, request ID)
   - Add timestamps

4. **Monitor key metrics**
   - Response times
   - Error rates
   - Database query performance
   - Memory usage
   - CPU usage

5. **Set up alerts**
   - Error rate > threshold
   - Response time > threshold
   - Service unavailable
   - Database connection failures

---

## Troubleshooting

### Sentry Not Capturing Errors

- Verify DSN is correct
- Check network connectivity
- Verify Sentry initialization
- Check Sentry dashboard for issues

### New Relic Not Showing Data

- Verify license key
- Check agent is initialized
- Verify network connectivity
- Check New Relic status page

### Logs Not Appearing

- Check log file permissions
- Verify logger configuration
- Check log level settings
- Verify file paths

---

## Cost Considerations

### Sentry
- Free tier: 5,000 events/month
- Paid plans start at $26/month

### New Relic
- Free tier: 100 GB/month
- Paid plans start at $99/month

### Recommendations
- Start with free tiers
- Monitor usage
- Set up alerts for quota limits
- Optimize event sampling

---

## Support

For monitoring setup issues:
- Sentry Documentation: https://docs.sentry.io
- New Relic Documentation: https://docs.newrelic.com
- GitHub Issues: [Repository URL]/issues

---

**Last Updated:** December 2024  
**Version:** 1.0

