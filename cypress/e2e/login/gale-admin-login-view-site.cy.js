// =============================================================================
// gale-admin-login-view-site.cy.js
// Flow:
//   1) Open Gale admin login page
//   2) Enter username and password
//   3) Click Log in
//   4) Click "View site" from the top-right area
// =============================================================================

describe('Gale Admin - Login and View Site', { tags: ['@login', '@smoke'] }, () => {
  const adminLoginUrl =
    'https://everest-support.galeinternal-testing.g43labs.net/admin/login/?next=/admin/'

  // Excel source for credentials (must contain columns: type, username, password)
  const EXCEL_FILE = 'cypress/fixtures/users.xlsx'
  const EXCEL_SHEET = 'LoginUsers'
  const EXCEL_ROW_TYPE = 'galeAdminUser'

  it('logs in and clicks View site', () => {
    cy.readExcelRow(EXCEL_FILE, EXCEL_SHEET, 'type', EXCEL_ROW_TYPE).then((user) => {
      expect(user, `Excel row with type="${EXCEL_ROW_TYPE}"`).to.not.be.null

      const username = user.username
      const password = user.password

      expect(username, 'Excel username').to.be.a('string').and.not.be.empty
      expect(password, 'Excel password').to.be.a('string').and.not.be.empty

      cy.visit(adminLoginUrl)

      // Django admin default login field selectors
      cy.get('input[name="username"], #id_username').first().should('be.visible').clear()
      cy.get('input[name="username"], #id_username').first().type(username)

      cy.get('input[name="password"], #id_password').first().should('be.visible').clear()
      cy.get('input[name="password"], #id_password').first().type(password, { log: false })

      // Support both button and input submit variants
      cy.get('input[type="submit"], button[type="submit"]').first().should('be.visible').click()

      // Assert we are inside admin after successful login
      cy.url({ timeout: 20000 }).should('include', '/admin/')

      // "View site" link is usually in the top-right user tools section
      cy.contains('a', /^View site$/i, { timeout: 20000 })
        .should('be.visible')
        .click()

      // Validate navigation away from admin area
      cy.url({ timeout: 20000 }).should('not.include', '/admin/login')
    })
  })
})
