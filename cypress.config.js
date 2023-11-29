const { defineConfig } = require("cypress");

module.exports = defineConfig({
  requestTimeout: 30000,
  env: {
    interceptUrl:
      "https://readingservicesdev.lexplore.com/activities/lastPerBook",
    apiOrigin: "https://readingservicesdev.lexplore.com",
    homePageUrl: "https://appdev.lexplore.com/student/home",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg",
    responseTimeout: 30000,
    requestTimeout: 30000,
  },
});
