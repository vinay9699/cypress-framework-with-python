// =============================================================================
// login-excel.cy.js — Login Tests driven by Excel (.xlsx) test data
// =============================================================================
// This file demonstrates three different ways to read test data from Excel:
//
//   APPROACH 1 — cy.readExcel()
//     Loads the full sheet as an array of objects, then finds the row you need.
//     Best when: you want to load all rows and iterate or filter yourself.
//
//   APPROACH 2 — cy.readExcelRow()
//     Looks up exactly one row by matching a column value.
//     Best when: you need a single named test user (e.g. 'validUser').
//
//   APPROACH 3 — cy.readExcelRows()
//     Returns all rows that match a column value.
//     Best when: you have multiple negative-test rows and want to run the
//     same assertion for each one (data-driven looping).
//
// The Excel file structure (cypress/fixtures/users.xlsx, sheet: LoginUsers):
//
//   | type        | username    | password      | name  | expectedError      |
//   |-------------|-------------|---------------|-------|--------------------|
//   | validUser   | Admin       | admin123      | Admin |                    |
//   | invalidUser | invaliduser | wrongpassword |       | Invalid credentials|
//   | emptyUser   |             |               |       | Required           |
//   | missingPwd  | Admin       |               |       | Required           |
// =============================================================================

import LoginPage    from '../../pages/LoginPage'
import DashboardPage from '../../pages/DashboardPage'

// Shared path and sheet name — defined once so it's easy to update
const EXCEL_FILE  = 'cypress/fixtures/users.xlsx'
const EXCEL_SHEET = 'LoginUsers'

// =============================================================================
// APPROACH 1 — Load ALL rows upfront, pick what each test needs
// =============================================================================
describe('OrangeHRM Login — Excel Data (Approach 1: readExcel)', () => {

  // Load the full sheet once before all tests in this block
  let allUsers

  before(() => {
    cy.readExcel(EXCEL_FILE, EXCEL_SHEET).then((rows) => {
      // rows = full array of row objects from the sheet
      // We convert it to a keyed object so tests can do allUsers.validUser
      allUsers = {}
      rows.forEach((row) => {
        allUsers[row.type] = row
      })
      // allUsers is now:
      // {
      //   validUser:   { type, username, password, name, expectedError },
      //   invalidUser: { ... },
      //   emptyUser:   { ... },
      //   missingPwd:  { ... },
      // }
    })
  })

  beforeEach(() => {
    cy.clearSession()
    LoginPage.visit()
  })

  it('[Excel-A1] should log in successfully with valid credentials', () => {
    const { username, password } = allUsers.validUser

    LoginPage.login(username, password)

    DashboardPage.verifyLoaded()
    DashboardPage.verifySidebarVisible()
  })

  it('[Excel-A2] should show an error alert with invalid credentials', () => {
    const { username, password, expectedError } = allUsers.invalidUser

    LoginPage.login(username, password)

    // expectedError is read directly from the Excel cell
    LoginPage.verifyErrorMessage(expectedError)
    LoginPage.verifyStillOnLoginPage()
  })

})


// =============================================================================
// APPROACH 2 — Look up a single row by column value (readExcelRow)
// =============================================================================
describe('OrangeHRM Login — Excel Data (Approach 2: readExcelRow)', () => {

  beforeEach(() => {
    cy.clearSession()
    LoginPage.visit()
  })

  it('[Excel-B1] should log in successfully — data fetched per test via readExcelRow', () => {
    // readExcelRow fetches ONE row where the 'type' column equals 'validUser'
    cy.readExcelRow(EXCEL_FILE, EXCEL_SHEET, 'type', 'validUser').then((user) => {
      // user = { type: 'validUser', username: 'Admin', password: 'admin123', ... }
      LoginPage.login(user.username, user.password)
      DashboardPage.verifyLoaded()
      DashboardPage.verifySidebarVisible()
    })
  })

  it('[Excel-B2] should show error for invalid credentials — data fetched per test', () => {
    cy.readExcelRow(EXCEL_FILE, EXCEL_SHEET, 'type', 'invalidUser').then((user) => {
      LoginPage.login(user.username, user.password)
      LoginPage.verifyErrorMessage(user.expectedError)
      LoginPage.verifyStillOnLoginPage()
    })
  })

  it('[Excel-B3] should show Required when password is missing — data from Excel', () => {
    cy.readExcelRow(EXCEL_FILE, EXCEL_SHEET, 'type', 'missingPwd').then((user) => {
      // Only username is filled — password is empty in the Excel row
      LoginPage.enterUsername(user.username)
      LoginPage.clickLogin()
      LoginPage.verifyValidationMessages(1)
    })
  })

})


// =============================================================================
// APPROACH 3 — Data-driven loop over multiple matching rows (readExcelRows)
// =============================================================================
// This approach shines when you have many negative test cases in the sheet
// and you want the same test logic to run for every one of them without
// writing a separate it() block for each.
// =============================================================================
describe('OrangeHRM Login — Excel Data (Approach 3: readExcelRows loop)', () => {

  // Load all rows that represent negative (non-valid) login scenarios
  // In the Excel sheet these are: invalidUser, emptyUser, missingPwd
  let negativeUsers

  before(() => {
    // We can filter client-side after loading all rows
    cy.readExcel(EXCEL_FILE, EXCEL_SHEET).then((rows) => {
      // Keep every row that is NOT the validUser — these are all negative cases
      negativeUsers = rows.filter((row) => row.type !== 'validUser')
    })
  })

  // Dynamically create one it() per negative row found in the sheet.
  // If you add a new negative row in Excel, a new test appears automatically
  // — no code changes needed.
  it('[Excel-C1] should reject all negative login scenarios from Excel', () => {
    negativeUsers.forEach((user) => {
      cy.clearSession()
      cy.visit('/web/index.php/auth/login')

      if (user.username) {
        LoginPage.enterUsername(user.username)
      }
      if (user.password) {
        LoginPage.enterPassword(user.password)
      }

      LoginPage.clickLogin()

      // For each negative row: the user should remain on the login page
      LoginPage.verifyStillOnLoginPage()

      cy.log(`[Excel-C1] Verified negative scenario: type="${user.type}", username="${user.username}"`)
    })
  })

})
