///  <reference types="Cypress" />


describe("Test Screen", function() {
    it("Check Title", function() {
        cy.visit('http://jobfair.local:8000/tasks/1');
        cy.contains("タスクー覧").should('have.length', 1);
    })

    it("Check Category Filter", function() {
        cy.contains('全て').should('have.length', 1);
        cy.contains('未着手').should('have.length', 1);
        cy.contains('進行中').should('have.length', 1);
        cy.contains('完了').should('have.length', 1);
        cy.contains('中断').should('have.length', 1);
        cy.contains('未完了').should('have.length', 1);
    })

    it("Check Dropdown", function() {
        cy.get('.ant-select-selection-search').should('have.length', 3);
    }) 

    it("Check Add Task Button", function() {
        cy.contains("追加").should('have.length', 1);
    })


})