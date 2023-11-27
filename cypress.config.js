const { defineConfig } = require("cypress");

module.exports = defineConfig({
  requestTimeout: 30000,
  env: {
    interceptUrl:
      "https://readingservicesdev.lexplore.com/activities/lastPerBook",
    apiOrigin: "https://readingservicesdev.lexplore.com",
    loginStudent1: "https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg",
    loginStudent7: "https://logindev.lexplore.com/go/nbSTogG-nk6Hfm9WAj8t6Q",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://logindev.lexplore.com/",
    responseTimeout: 30000,
    requestTimeout: 30000,
  },
});
