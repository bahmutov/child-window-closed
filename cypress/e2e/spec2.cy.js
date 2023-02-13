/// <reference types="cypress" />

it('opens the child window (2nd solution)', () => {
  const mockWindow = {}
  const mockWindowController = {
    close() {
      // prevent calling multiple times
      if (mockWindow.changed) {
        throw new Error('Cannot close a closed window')
      }
      mockWindow.closed = true
    },
  }
  cy.visit('index.html').then((win) => {
    cy.stub(win, 'open').returns(mockWindow).as('open')
  })
  cy.contains('a', 'link').click()
  cy.get('@open').should('have.been.calledWith', 'child.html')
  cy.get('.overlay').should('be.visible').wait(1000)
  // set parent window is watching the "window.closed" property
  cy.wrap(mockWindowController).invoke('close')
  cy.get('.overlay').should('not.be.visible')
})

it('opens the child window (2nd solution using Reflect.set)', () => {
  const mockWindow = {}
  cy.visit('index.html').then((win) => {
    cy.stub(win, 'open').returns(mockWindow).as('open')
  })
  cy.contains('a', 'link').click()
  cy.get('@open').should('have.been.calledWith', 'child.html')
  cy.get('.overlay').should('be.visible').wait(1000)
  // set parent window is watching the "window.closed" property
  cy.wrap(Reflect).invoke('set', mockWindow, 'closed', true)
  cy.get('.overlay').should('not.be.visible')
})
