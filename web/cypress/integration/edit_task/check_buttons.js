///  <reference types="Cypress" />

describe("Test 1: Cancel Button", function() {
    it("Load Page", function() {
        cy.visit('http://jobfair.local:8000/edit-task/13');
        cy.wait(2000);
    })

    it("Button Is Enabled", function() {
        cy.contains('キャンセル').should('not.be.disabled');
    })  

    it("Not Cancel Edit", function() {
        cy.contains('キャンセル').click();
        // cancel message
        cy.contains('変更内容が保存されません。よろしいですか？').should('have.length', 1);
        cy.contains('いいえ').click();
        cy.url().should('contain', 'edit-task');
    })

    it('Cancel Edit', function() {
        cy.contains('キャンセル').click();
        cy.contains('はい').click();
        cy.wait(3000);
    })

    it('Redirect To Jobfairs Page After Cancel Editing', function() {
        cy.url().should('contain', 'tasks');
    })
})

describe("Test 2: Save Button", function() {
    it("Load Page", function() {
        cy.visit('http://jobfair.local:8000/edit-task/13');
        cy.wait(2000);
    })
    
    it("Button Is Enabled", function() {
        cy.contains('保 存').should('not.be.disabled');
    })

    it('Save Task', function() {
        cy.get("#name").clear().type("Alibaba");
        cy.contains('保 存').click();
        cy.contains('変更は正常に保存されました。').should('have.length', 1);
        // check info updated in task detail screen
        cy.url().should('contain', 'task-detail');
        cy.get('.item__right').eq(0).should('contain', 'Alibaba');
    })
})

