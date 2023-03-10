/// <reference types="cypress" />

it('opens the child window (using cy.invoke)', () => {
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
