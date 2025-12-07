const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:4100', // Frontend runs on 4100 by default in package.json
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
