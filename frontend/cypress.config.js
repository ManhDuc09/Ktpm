import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.spec.js", // or .cy.js
    env: {
      apiUrl: "http://localhost:8080"
    },
    setupNodeEvents(on, config) {
      // configure reporters
      // Mocha JUnit reporter for CI
      const junitReporter = require("mocha-junit-reporter");
      on("after:run", (results) => {
        console.log("Cypress run finished");
      });
      return config;
    },
    reporter: "mocha-junit-reporter",
    reporterOptions: {
      mochaFile: "cypress/results/test-results.xml",
      toConsole: true
    },
    screenshotsFolder: "cypress/results/screenshots",
    videosFolder: "cypress/results/videos",
    video: true,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    screenshotsFolder: "cypress/results/screenshots/component",
    videosFolder: "cypress/results/videos/component",
    video: true,
  },
});
