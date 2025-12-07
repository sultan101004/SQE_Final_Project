// Instructions:
// 1. Install Sentry SDK:
//    npm install --save @sentry/react @sentry/tracing
//
// 2. Add the following code to your frontend/src/index.js file:

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
    dsn: "YOUR_SENTRY_DSN_HERE", // Replace with your actual Sentry DSN
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// Place this init call before ReactDOM.render()
