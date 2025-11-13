import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.spec.js', // or .cy.js
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
