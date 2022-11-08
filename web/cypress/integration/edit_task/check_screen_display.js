///  <reference types="Cypress" />

describe("Screen Display", function() {
    it("Title", function() {
        cy.visit('http://jobfair.local:8000/edit-task/13');
        cy.contains('タスク編集').should('have.length', 1);
    });

    it("Task Info", function() {
        cy.wait(3000);
        cy.contains('タスク名').should('have.length', 1);
        cy.contains('カテゴリ').should('have.length', 1);
        cy.contains('マイルストーン').should('have.length', 1);
        cy.contains('工数').should('have.length', 1);
        cy.contains('担当者').should('have.length', 1);
        cy.contains('前のタスク').should('have.length', 1);
        cy.contains('次のタスク').should('have.length', 1);
        cy.contains('開始日').should('have.length', 1);
        cy.contains('ステータス').should('have.length', 1);
        cy.contains('キャンセル').should('have.length', 1);
        cy.contains('保存').should('have.length', 1);
        cy.contains('終了日').should('have.length', 1);

    
    })
})

