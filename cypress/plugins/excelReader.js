// =============================================================================
// excelReader.js — Node.js utility to read Excel (.xlsx) files
// =============================================================================
// WHY THIS FILE EXISTS:
//   Cypress tests run inside the browser sandbox — they cannot access the
//   filesystem directly. Node.js CAN access the filesystem.
//
//   This file runs in the Node.js process (via cy.task()) and does the work
//   of opening the Excel file, parsing its rows, and returning plain JSON
//   back to the browser-side test.
//
// HOW IT IS USED:
//   Registered as a Cypress task in cypress.config.js:
//     on('task', { readExcel: readExcel })
//
//   Called from tests or commands.js via:
//     cy.task('readExcel', { filePath: 'cypress/fixtures/users.xlsx', sheet: 'LoginUsers' })
//
// RETURNS:
//   An array of objects — one object per data row in the sheet.
//   The first row of the sheet is treated as the header (column names).
//
//   Example output for the LoginUsers sheet:
//   [
//     { type: 'validUser',   username: 'Admin',       password: 'admin123',      name: 'Admin', expectedError: '' },
//     { type: 'invalidUser', username: 'invaliduser', password: 'wrongpassword', name: '',      expectedError: 'Invalid credentials' },
//     ...
//   ]
// =============================================================================

const XLSX = require('xlsx')
const path = require('path')

/**
 * Read all rows from a named sheet in an Excel file.
 *
 * Called via: cy.task('readExcel', { filePath, sheet })
 *
 * @param {object} options
 * @param {string} options.filePath - path to the .xlsx file, relative to the
 *                                    project root (e.g. 'cypress/fixtures/users.xlsx')
 * @param {string} options.sheet   - name of the sheet tab to read
 *                                    (e.g. 'LoginUsers')
 * @returns {object[]} array of row objects keyed by the header row
 */
function readExcel({ filePath, sheet }) {
  // Resolve the path relative to the project root (where cypress.config.js lives)
  // process.cwd() returns the directory from which Cypress was launched
  const absolutePath = path.resolve(process.cwd(), filePath)

  // Read the entire workbook from disk
  const workbook = XLSX.readFile(absolutePath)

  // Find the sheet by name — throw a clear error if it doesn't exist
  const sheetName = sheet || workbook.SheetNames[0]
  if (!workbook.Sheets[sheetName]) {
    throw new Error(
      `[excelReader] Sheet "${sheetName}" not found in "${filePath}". ` +
      `Available sheets: ${workbook.SheetNames.join(', ')}`
    )
  }

  // Convert the sheet to an array of objects.
  // sheet_to_json() uses the first row as keys (header: 1 = raw array mode).
  // Default mode (no options) treats row 1 as headers automatically.
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    // defval: '' means empty cells return '' instead of undefined
    defval: '',
  })

  return rows
}

/**
 * Read a single row from a sheet by matching a value in a specific column.
 *
 * Useful when you want to look up one user by their 'type' key, e.g.:
 *   cy.task('readExcelRow', { filePath, sheet, matchColumn: 'type', matchValue: 'validUser' })
 *
 * @param {object} options
 * @param {string} options.filePath    - path to the .xlsx file
 * @param {string} options.sheet       - sheet name
 * @param {string} options.matchColumn - column name to search in (e.g. 'type')
 * @param {string} options.matchValue  - value to match (e.g. 'validUser')
 * @returns {object|null} the matched row, or null if not found
 */
function readExcelRow({ filePath, sheet, matchColumn, matchValue }) {
  const rows = readExcel({ filePath, sheet })
  const found = rows.find((row) => String(row[matchColumn]) === String(matchValue))
  return found || null
}

/**
 * Get only the rows from a sheet where a column matches a value.
 * Returns multiple rows — useful when multiple test cases share a type.
 *
 * @param {object} options
 * @param {string} options.filePath    - path to the .xlsx file
 * @param {string} options.sheet       - sheet name
 * @param {string} options.matchColumn - column name to filter by
 * @param {string} options.matchValue  - value to match
 * @returns {object[]} array of matched rows
 */
function readExcelRows({ filePath, sheet, matchColumn, matchValue }) {
  const rows = readExcel({ filePath, sheet })
  return rows.filter((row) => String(row[matchColumn]) === String(matchValue))
}

module.exports = { readExcel, readExcelRow, readExcelRows }
