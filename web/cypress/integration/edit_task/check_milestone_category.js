///  <reference types="Cypress" />

describe("Test 1: Milestone", function() {
    it("Load page", function() {
        cy.visit('http://jobfair.local:8000/edit-task/13');
        cy.wait(1000);
    })
    it("Display old milestone", function() {
        cy.get("#category").should('not.have.attr', 'value', '');
    })

})


describe("Test 2: Category", function() {
    it("Display old category", function() {
        cy.get('#milestone').should('not.have.attr', 'value', '');
    })
})