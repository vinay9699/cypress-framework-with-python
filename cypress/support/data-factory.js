/// <reference types="cypress" />
// @ts-check
// =============================================================================
// data-factory.js — Test Data Builder Pattern
// =============================================================================
// Provides builder functions and Cypress commands for creating, reading, and
// deleting test data via the OrangeHRM API so tests are self-contained:
//   - cy.createEmployee(overrides?) → creates employee, yields created record
//   - cy.deleteEmployee(empNumber)  → removes employee by empNumber
//   - cy.getEmployeeById(empNumber) → fetches single employee record
//
// USAGE PATTERN (beforeEach / afterEach):
//   let createdEmp
//   beforeEach(() => {
//     cy.loginBySession(USERNAME, PASSWORD)
//     cy.createEmployee({ firstName: 'Data', lastName: 'FactoryTest' })
//       .then(emp => { createdEmp = emp })
//   })
//   afterEach(() => {
//     if (createdEmp) cy.deleteEmployee(createdEmp.empNumber)
//   })
// =============================================================================

const EMPLOYEE_API = '/web/index.php/api/v2/pim/employees'

// ---------------------------------------------------------------------------
// Builder helpers — pure functions, no Cypress dependency
// ---------------------------------------------------------------------------

/**
 * Build a minimal employee payload for test creation.
 * Each call generates a unique lastName using the current timestamp so
 * parallel test runs never collide on the same name.
 *
 * @param {Partial<{firstName: string, lastName: string, employeeId: string}>} overrides
 * @returns {{ firstName: string, lastName: string, employeeId: string }}
 */
export function buildEmployee(overrides = {}) {
  const suffix = Date.now().toString().slice(-6)
  return {
    firstName: 'Test',
    lastName: `Factory${suffix}`,
    employeeId: `EMP${suffix}`,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Cypress commands
// ---------------------------------------------------------------------------

/**
 * cy.createEmployee(overrides?)
 *
 * Create a test employee via the OrangeHRM API and yield the created record.
 * Call this in beforeEach() so each test gets a clean, unique employee.
 *
 * Requires an active authenticated session (use after cy.loginBySession()).
 *
 * @param {Partial<{firstName: string, lastName: string, employeeId: string}>} [overrides]
 */
Cypress.Commands.add('createEmployee', (overrides = {}) => {
  const payload = buildEmployee(overrides)
  cy.log(`[createEmployee] Creating: ${payload.firstName} ${payload.lastName}`)
  return cy.apiPost(EMPLOYEE_API, payload).then((/** @type {Cypress.Response<any>} */ response) => {
    expect(response.status, `createEmployee: expected 200, got ${response.status}`).to.be.oneOf([
      200, 201,
    ])
    const created = response.body?.data ?? response.body
    cy.log(`[createEmployee] Created empNumber: ${created?.empNumber}`)
    return created
  })
})

/**
 * cy.deleteEmployee(empNumber)
 *
 * Delete a test employee by their empNumber.
 * Call this in afterEach() to clean up data created during a test.
 *
 * OrangeHRM DELETE accepts an array of IDs in the request body.
 *
 * @param {number} empNumber
 */
Cypress.Commands.add('deleteEmployee', (empNumber) => {
  cy.log(`[deleteEmployee] Deleting empNumber: ${empNumber}`)
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken') || ''
    cy.request({
      method: 'DELETE',
      url: EMPLOYEE_API,
      headers: { Authorization: `Bearer ${token}` },
      body: { ids: [empNumber] },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`[deleteEmployee] Status: ${response.status}`)
    })
  })
})

/**
 * cy.getEmployeeById(empNumber)
 *
 * Fetch a single employee record by empNumber.
 * Yields the employee data object or null if not found.
 *
 * @param {number} empNumber
 */
Cypress.Commands.add('getEmployeeById', (empNumber) => {
  return cy
    .apiGet(`${EMPLOYEE_API}/${empNumber}`)
    .then((/** @type {Cypress.Response<any>} */ response) => {
      if (response.status === 200) return response.body?.data ?? response.body
      return null
    })
})
