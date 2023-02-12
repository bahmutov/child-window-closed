/// <reference types="cypress" />

it('opens the child window', () => {
  const mockWindow = {}
  cy.visit('index.html').then((win) => {
    cy.stub(win, 'open').returns(mockWindow).as('open')
  })
  cy.contains('a', 'link').click()
  cy.get('@open').should('have.been.calledWith', 'child.html')
  cy.get('.overlay')
    .should('be.visible')
    .wait(1000)
    .then(() => {
      // set parent window is watching the "window.closed" property
      mockWindow.closed = true
    })
  cy.get('.overlay').should('not.be.visible')
})
