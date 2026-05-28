/// <reference types="cypress" />
// @ts-check
// =============================================================================
// validate-schema.js — AJV-powered JSON Schema Validation Command
// =============================================================================
// Provides cy.validateSchema(body, schema) for declarative API contract testing.
// Uses AJV (Another JSON Validator) with JSON Schema Draft-07.
//
// USAGE:
//   import employeeListSchema from '../schemas/employee-list.schema.json'
//
//   cy.wait('@liveEmployees').then(({ response }) => {
//     cy.validateSchema(response.body, employeeListSchema)
//   })
// =============================================================================

import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true, strict: false })

/**
 * cy.validateSchema(body, schema)
 *
 * Validate a response body against a JSON Schema definition.
 * Fails the test with a descriptive error listing all schema violations.
 *
 * @param {object} body   - the response body to validate
 * @param {object} schema - a valid JSON Schema Draft-07 object
 */
Cypress.Commands.add('validateSchema', (body, schema) => {
  const validate = ajv.compile(schema)
  const valid = validate(body)
  if (!valid) {
    const errors = ajv.errorsText(validate.errors, { separator: '\n  ', dataVar: 'response' })
    throw new Error(`Schema validation failed:\n  ${errors}`)
  }
  cy.log('[validateSchema] ✓ Response matches schema contract')
})
