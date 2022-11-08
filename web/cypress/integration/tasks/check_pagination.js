///  <reference types="Cypress" />

describe("Check Pagination", function() {
    it("Pagination Bar Not Visible", function() {
        cy.visit('http://jobfair.local:8000/tasks/1');
        cy.wait(300);
        cy.get(".ant-input").clear().type("*&*()dsa");
        cy.get('.ant-pagination').should('have.length', 0);
    })
})