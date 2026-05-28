// =============================================================================
// index.js — Single-File Reusable UI Action Library
// =============================================================================

export const navigationActions = {
  visitPage(path) {
    cy.visit(path)
  },

  reloadPage() {
    cy.reload()
  },

  goBack() {
    cy.go('back')
  },

  goForward() {
    cy.go('forward')
  },

  validateUrlContains(path) {
    cy.url().should('include', path)
  },

  validatePageTitleContains(titleText) {
    cy.title().should('include', titleText)
  },
}

export const clickActions = {
  clickElement(selector) {
    cy.get(selector).click()
  },

  forceClick(selector) {
    cy.get(selector).click({ force: true })
  },

  doubleClick(selector) {
    cy.get(selector).dblclick()
  },

  rightClick(selector) {
    cy.get(selector).rightclick()
  },

  clickFirst(selector) {
    cy.get(selector).first().click()
  },

  clickLast(selector) {
    cy.get(selector).last().click()
  },

  clickByIndex(selector, index) {
    cy.get(selector).eq(index).click()
  },
}

export const inputActions = {
  typeText(selector, text) {
    cy.get(selector).type(text)
  },

  clearText(selector) {
    cy.get(selector).clear()
  },

  typeSlowly(selector, text, delay = 100) {
    cy.get(selector).type(text, { delay })
  },

  typeSpecialKeys(selector, keys) {
    cy.get(selector).type(keys)
  },

  focusField(selector) {
    cy.get(selector).focus()
  },

  blurField(selector) {
    cy.get(selector).blur()
  },

  pressEnter(selector = 'input') {
    cy.get(selector).type('{enter}')
  },

  pressTab(selector = 'input') {
    cy.get(selector).type('{tab}')
  },

  pressEscape(selector = 'body') {
    cy.get(selector).type('{esc}')
  },

  pressBackspace(selector = 'input') {
    cy.get(selector).type('{backspace}')
  },

  pressDelete(selector = 'input') {
    cy.get(selector).type('{del}')
  },

  selectAll(selector = 'input') {
    cy.get(selector).type('{selectAll}')
  },
}

export const dropdownActions = {
  selectDropdownValue(selector, text) {
    cy.get(selector).select(text)
  },

  selectDropdownByValue(selector, value) {
    cy.get(selector).select(value)
  },

  selectMultipleValues(selector, values) {
    cy.get(selector).select(values)
  },

  openCustomDropdown(selector) {
    cy.get(selector).click()
  },

  selectCustomOption(optionSelector, optionText) {
    cy.contains(optionSelector, optionText).click()
  },
}

export const checkboxActions = {
  checkCheckbox(selector) {
    cy.get(selector).check()
  },

  uncheckCheckbox(selector) {
    cy.get(selector).uncheck()
  },

  checkMultiple(selector) {
    cy.get(selector).check()
  },

  validateChecked(selector) {
    cy.get(selector).should('be.checked')
  },

  selectRadio(selector) {
    cy.get(selector).check()
  },

  selectRadioByValue(selector, value) {
    cy.get(selector).check(value)
  },

  validateRadioSelected(selector) {
    cy.get(selector).should('be.checked')
  },
}

export const mouseActions = {
  hover(selector) {
    cy.get(selector).trigger('mouseover')
  },

  mouseOut(selector) {
    cy.get(selector).trigger('mouseout')
  },

  mouseDown(selector) {
    cy.get(selector).trigger('mousedown')
  },

  mouseUp(selector) {
    cy.get(selector).trigger('mouseup')
  },

  mouseMove(selector) {
    cy.get(selector).trigger('mousemove')
  },
}

export const scrollActions = {
  scrollToElement(selector) {
    cy.get(selector).scrollIntoView()
  },

  scrollToTop() {
    cy.scrollTo('top')
  },

  scrollToBottom() {
    cy.scrollTo('bottom')
  },

  scrollToCoordinates(x, y) {
    cy.scrollTo(x, y)
  },
}

export const formActions = {
  fillInput(selector, value) {
    cy.get(selector).type(value)
  },

  fillForm(formData) {
    Object.entries(formData).forEach(([selector, value]) => {
      cy.get(selector).clear()
      cy.get(selector).type(String(value))
    })
  },

  submitForm(selector = 'form') {
    cy.get(selector).submit()
  },

  validateErrorMessage(text) {
    cy.contains(text).should('be.visible')
  },

  validateSuccessMessage(text) {
    cy.contains(text).should('be.visible')
  },
}

export const uploadActions = {
  uploadFile(selector, filePath) {
    cy.get(selector).selectFile(filePath)
  },

  uploadMultipleFiles(selector, filePaths) {
    cy.get(selector).selectFile(filePaths)
  },

  dragDropUpload(selector, filePath) {
    cy.get(selector).selectFile(filePath, { action: 'drag-drop' })
  },
}

export const dragDropActions = {
  dragAndDrop(sourceSelector, targetSelector) {
    cy.get(sourceSelector).trigger('dragstart')
    cy.get(targetSelector).trigger('drop')
  },

  nativeDragStart(selector) {
    cy.get(selector).trigger('dragstart')
  },

  dropElement(selector) {
    cy.get(selector).trigger('drop')
  },
}

export const modalPopupActions = {
  openModal(selector) {
    cy.get(selector).click()
  },

  closeModal(selector) {
    cy.get(selector).click()
  },

  validateModalVisible(selector = '.modal') {
    cy.get(selector).should('be.visible')
  },

  validateOverlayVisible(selector = '.overlay') {
    cy.get(selector).should('be.visible')
  },
}

export const alertConfirmActions = {
  validateAlert(handler = () => {}) {
    cy.on('window:alert', handler)
  },

  confirmPopupAccept() {
    cy.on('window:confirm', () => true)
  },

  confirmPopupCancel() {
    cy.on('window:confirm', () => false)
  },
}

export const tabsAccordionActions = {
  clickTab(tabSelector, tabText) {
    cy.get(tabSelector).contains(tabText).click()
  },

  openAccordion(selector) {
    cy.get(selector).click()
  },

  validateAccordionContentVisible(selector) {
    cy.get(selector).should('be.visible')
  },
}

export const tableActions = {
  validateTableRows(rowSelector, expectedCount) {
    cy.get(rowSelector).should('have.length', expectedCount)
  },

  clickRow(rowSelector, index) {
    cy.get(rowSelector).eq(index).click()
  },

  validateCellText(rowSelector, rowIndex, cellIndex, expectedText) {
    cy.get(rowSelector).eq(rowIndex).find('td').eq(cellIndex).should('contain', expectedText)
  },

  sortColumn(headerSelector, columnName) {
    cy.get(headerSelector).contains(columnName).click()
  },

  searchTable(searchSelector, searchText) {
    cy.get(searchSelector).clear()
    cy.get(searchSelector).type(searchText)
  },
}

export const datePickerActions = {
  openDatePicker(selector) {
    cy.get(selector).click()
  },

  selectDate(daySelector, dayText) {
    cy.contains(daySelector, dayText).click()
  },

  typeDate(selector, dateText) {
    cy.get(selector).clear()
    cy.get(selector).type(dateText)
  },
}

export const sliderActions = {
  setRangeValue(selector, value) {
    cy.get(selector).invoke('val', value)
    cy.get(selector).trigger('input')
  },

  dragSlider(selector) {
    cy.get(selector).trigger('mousedown')
    cy.get(selector).trigger('mousemove')
    cy.get(selector).trigger('mouseup')
  },
}

export const frameShadowActions = {
  getIframeBody(iframeSelector) {
    return cy.get(iframeSelector).its('0.contentDocument.body').should('not.be.empty').then(cy.wrap)
  },

  clickInsideIframe(iframeSelector, elementSelector) {
    this.getIframeBody(iframeSelector).find(elementSelector).click()
  },

  clickInsideShadowHost(hostSelector, elementSelector) {
    cy.get(hostSelector).shadow().find(elementSelector).click()
  },
}

export const viewportActions = {
  setDesktopViewport() {
    cy.viewport(1440, 900)
  },

  setTabletViewport() {
    cy.viewport('ipad-2')
  },

  setMobileViewport() {
    cy.viewport('iphone-x')
  },
}

export const visualActions = {
  validateCssProperty(selector, propertyName, expectedValue) {
    if (typeof expectedValue === 'undefined') {
      cy.get(selector).should('have.css', propertyName)
      return
    }

    cy.get(selector).should('have.css', propertyName, expectedValue)
  },

  validateFontSize(selector, expectedSize) {
    cy.get(selector).should('have.css', 'font-size', expectedSize)
  },

  validateAlignment(selector, expectedAlignment) {
    cy.get(selector).should('have.css', 'text-align', expectedAlignment)
  },

  takeScreenshot(fileName) {
    cy.screenshot(fileName)
  },
}

export const networkActions = {
  interceptApi(method, url, aliasName) {
    cy.intercept(method, url).as(aliasName)
  },

  waitForApi(aliasName, expectedStatusCode = 200) {
    cy.wait(`@${aliasName}`).its('response.statusCode').should('eq', expectedStatusCode)
  },

  mockApiResponse(method, url, responseBody, aliasName) {
    cy.intercept(method, url, responseBody).as(aliasName)
  },
}

export const assertionActions = {
  verifyText(selector, expectedText) {
    cy.get(selector).should('contain.text', expectedText)
  },

  verifyElementVisible(selector) {
    cy.get(selector).should('be.visible')
  },

  verifyElementNotVisible(selector) {
    cy.get(selector).should('not.be.visible')
  },
}

export const waitActions = {
  wait(milliseconds) {
    cy.wait(milliseconds)
  },

  waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('be.visible')
  },

  waitForElementToDisappear(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('not.exist')
  },
}

export const utilityActions = {
  clickElement(selector) {
    cy.get(selector).should('be.visible').click()
  },

  typeText(selector, text) {
    cy.get(selector).should('be.visible').clear()
    cy.get(selector).type(text)
  },

  selectDropdown(selector, value) {
    cy.get(selector).should('be.visible').select(value)
  },

  verifyText(selector, expectedText) {
    cy.get(selector).should('contain.text', expectedText)
  },

  verifyElementVisible(selector) {
    cy.get(selector).should('be.visible')
  },

  hoverElement(selector) {
    cy.get(selector).trigger('mouseover')
  },

  scrollToElement(selector) {
    cy.get(selector).scrollIntoView()
  },
}
