///  <reference types="Cypress" />

describe("Test 1: Previous Task", function() {
    it("Label Display", function() {
        cy.visit('http://jobfair.local:8000/task-detail/3');
        cy.wait(1000);
        cy.contains("前のタスク").should('have.length', 1);
        cy.get('.list__task').eq(0).should('not.have.value', '');
    })

})

describe("Task 2: Next Task", function() {
    it("Label Display", function() {
        cy.contains("次のタスク").should('have.length', 1);
        cy.get('.list__task').eq(1).should('not.have.value', '');
    })
})

// check task display