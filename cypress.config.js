import { defineConfig } from 'cypress'
import { allureCypress } from 'allure-cypress/reporter'
import { readExcel, readExcelRow, readExcelRows } from './cypress/plugins/excelReader.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// =============================================================================
// ENVIRONMENT-AWARE CONFIGURATION
// =============================================================================
// Select which environment config to merge by passing --env ENV=staging
// Example: npx cypress run --env ENV=staging
// Defaults to 'dev' if ENV is not set.
//
// Per-environment files live in config/:
//   config/cypress.dev.json
//   config/cypress.staging.json
//   config/cypress.prod.json
// =============================================================================
const ENV = process.env.CYPRESS_ENV || 'dev'

let envConfig = {}
try {
  envConfig = require(`./config/cypress.${ENV}.json`)
} catch {
  console.warn(`[cypress.config] No config found for ENV="${ENV}", using defaults.`)
}

export default defineConfig({
  projectId: 'e77qhw',

  // ============================================================
  // REPORTER CONFIGURATION
  // cypress-multi-reporters lets us run ALL three reporters in
  // a single test run — Mochawesome (HTML), JUnit (XML), Allure.
  // ============================================================
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },

  e2e: {
    // Base URL — overridden per environment via config/cypress.<env>.json
    baseUrl: envConfig.e2e?.baseUrl || 'https://opensource-demo.orangehrmlive.com',

    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',

    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,

    retries: envConfig.e2e?.retries || {
      runMode: 2,
      openMode: 0,
    },

    viewportWidth: 1280,
    viewportHeight: 720,

    video: envConfig.e2e?.video !== undefined ? envConfig.e2e.video : true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    downloadsFolder: 'cypress/downloads',

    // =========================================================================
    // ENV VARIABLES
    // =========================================================================
    // These are available inside tests via Cypress.env('KEY').
    // Secrets come from cypress.env.json (git-ignored).
    // ENV-specific values (apiBaseUrl, ENV name) come from config/<env>.json.
    // =========================================================================
    env: {
      ENV,
      ...envConfig.e2e?.env,
      // grep support (used by @cypress/grep for tag-based filtering)
      grepFilterSpecs: true,
      grepOmitFiltered: true,
    },

    setupNodeEvents(on, config) {
      // -----------------------------------------------------------------------
      // EXCEL READER TASKS
      // -----------------------------------------------------------------------
      on('task', {
        readExcel,
        readExcelRow,
        readExcelRows,
      })

      // -----------------------------------------------------------------------
      // @cypress/grep — enables --env grep=@smoke tag filtering
      // -----------------------------------------------------------------------
      const { plugin: grepPlugin } = require('@cypress/grep/plugin')
      grepPlugin(on, config)

      // -----------------------------------------------------------------------
      // ALLURE REPORTER
      // -----------------------------------------------------------------------
      allureCypress(on, config, {
        resultsDir: 'allure-results',
      })

      return config
    },
  },
})
