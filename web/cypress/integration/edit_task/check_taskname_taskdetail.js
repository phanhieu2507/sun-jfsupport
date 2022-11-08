///  <reference types="Cypress" />

describe("Test 1: Task Name", function() {
    it('Load Page', function() {
        cy.visit('http://jobfair.local:8000/edit-task/13');
    })
    
    it("Display Task Name", function() {
        cy.wait(2000);
        cy.get("#name").should('not.have.attr', 'value', '');
    });
    
    // Type existed task name
    it("Type in existed task name", function() {
        cy.get('#name').then(taskName => {
            cy.visit('http://jobfair.local:8000/edit-task/1');
            cy.wait(2000);
            cy.get('#name').clear().type(taskName.val());
            
        })

    })

    it("Type Vietnamese", function() {
        cy.get("#name").clear().type("Nguyễn Văn A").should('have.value', 'Nguyễn Văn A');
    })
    
    it('Type Japanese', function() {
        cy.get("#name").clear().type("こんにちは").should('have.value', 'こんにちは');
    })
    
    it('Delete Task Name', function() {
        cy.get("#name").clear();
        cy.contains('タスク編集').click();
        cy.contains('この項目は必須です').should('have.length', 1);
    })

    it("Type Invalid Characters", function() {
        cy.get("#name").clear().type("*&((((##!");
        cy.contains('使用できない文字が含まれています').should('have.length', 1);
    })
})


describe("Test 2: Task Detail", function() {
    it("Display detail", function() {
        cy.get('#detail');
    })
    it('Type content', function() {
        cy.get('#detail').type('asndsandsandsandsandjkasndkjandkasndknasdnanksnd');
    })
    it('Delete content', function() {
        cy.get('#detail').clear();
        cy.contains('タスク編集').click();
    })
})