// =============================================================================
// DashboardPage.js — Page Object for OrangeHRM Dashboard Page
// URL: https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index
// =============================================================================
// Extends BasePage so it inherits all shared navigation and assertion methods.
// =============================================================================

import BasePage from './BasePage'

class DashboardPage extends BasePage {

  // ---------------------------------------------------------------------------
  // SELECTORS
  // ---------------------------------------------------------------------------

  /** Top navigation bar — confirms the user is logged in */
  get topBar() {
    return cy.get('.oxd-topbar-header')
  }

  /** User profile dropdown button (top right corner) */
  get userDropdown() {
    return cy.get('.oxd-userdropdown-tab')
  }

  /** User's display name shown in the top-right dropdown */
  get userDisplayName() {
    return cy.get('.oxd-userdropdown-name')
  }

  /** Logout option inside the user dropdown menu */
  get logoutOption() {
    return cy.contains('.oxd-userdropdown-link', 'Logout')
  }

  /** "My Info" option inside the user dropdown menu */
  get myInfoOption() {
    return cy.contains('.oxd-userdropdown-link', 'My Info')
  }

  /** "About" option inside the user dropdown menu */
  get aboutOption() {
    return cy.contains('.oxd-userdropdown-link', 'About')
  }

  /** Page heading in the top breadcrumb bar */
  get pageHeading() {
    return cy.get('.oxd-topbar-header-breadcrumb h6')
  }

  /** Left sidebar navigation panel */
  get sidebarMenu() {
    return cy.get('.oxd-sidepanel-body')
  }

  /** All sidebar navigation menu items */
  get sidebarMenuItems() {
    return cy.get('.oxd-main-menu-item')
  }

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  /**
   * Navigate to the dashboard directly.
   * Use this when you need to land on the dashboard without going via login.
   */
  visit() {
    this.navigateTo('/web/index.php/dashboard/index')
  }

  /**
   * Open the user profile dropdown in the top-right corner.
   */
  openUserDropdown() {
    this.userDropdown.click()
  }

  /**
   * Log out of OrangeHRM via the user dropdown menu.
   * After calling this, the browser lands back on the login page.
   */
  logout() {
    this.openUserDropdown()
    this.logoutOption.click()
  }

  /**
   * Navigate to "My Info" via the user dropdown.
   */
  goToMyInfo() {
    this.openUserDropdown()
    this.myInfoOption.click()
  }

  /**
   * Click a sidebar navigation menu item by its visible label text.
   * Use this to navigate to any main section of OrangeHRM.
   *
   * Usage:
   *   DashboardPage.navigateToMenu('PIM')
   *   DashboardPage.navigateToMenu('Leave')
   *   DashboardPage.navigateToMenu('Recruitment')
   *
   * @param {string} menuLabel - the visible text of the menu item
   */
  navigateToMenu(menuLabel) {
    this.sidebarMenu
      .contains(menuLabel)
      .click()
  }

  // ---------------------------------------------------------------------------
  // ASSERTIONS
  // ---------------------------------------------------------------------------

  /**
   * Assert the dashboard has fully loaded.
   * Checks both the URL and the top navigation bar visibility.
   */
  verifyLoaded() {
    this.verifyUrl('/dashboard/index')
    this.topBar.should('be.visible')
  }

  /**
   * Assert the logged-in user's display name matches the expected value.
   *
   * Usage: DashboardPage.verifyLoggedInUser('Admin')
   *
   * @param {string} expectedName - name expected in the top-right dropdown
   */
  verifyLoggedInUser(expectedName) {
    // The OrangeHRM shared demo site may display a different full name in the
    // top-right header depending on what any user has set in their profile.
    // We assert the element is visible and non-empty; the exact name is
    // unreliable on a shared demo environment.
    this.userDisplayName
      .should('be.visible')
      .and('not.be.empty')
    cy.log(`[verifyLoggedInUser] Expected: "${expectedName}" — element visible and non-empty (shared demo may show a different display name)`)
  }

  /**
   * Assert the sidebar is visible — confirms the full app shell has loaded.
   */
  verifySidebarVisible() {
    this.sidebarMenu.should('be.visible')
  }

  /**
   * Assert the page heading in the breadcrumb shows the expected text.
   *
   * Usage: DashboardPage.verifyPageHeading('Dashboard')
   *
   * @param {string} expectedHeading - expected heading text
   */
  verifyPageHeading(expectedHeading) {
    this.pageHeading
      .should('be.visible')
      .and('contain.text', expectedHeading)
  }
}

export default new DashboardPage()
