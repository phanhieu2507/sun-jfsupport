///  <reference types="Cypress" />

describe("Test 1: Effort", function() {
    it("Load page", function() {
        cy.visit('http://jobfair.local:8000/edit-task/13');
        cy.wait(1000);
    })
    it("Display effort", function() {
        cy.get('.ef').each(($element, index, $list) => {
           cy.get('.ef').eq(index).should('not.have.text', ''); 
        })
        cy.get('.row-ef > :nth-child(3)').should('have.length', 1);
    })

})

describe("Test 2: Manager", function() {
    it("Display manager", function() {
        cy.get('.grid > :nth-child(5) .ant-select-selector').then(element => {
            expect(element.length).to.gte(0);
        })
    })
    
    it('Delete Manager', function() {
       cy.get(':nth-child(1) > :nth-child(1) > .ant-tag > .anticon > svg').each(($element, index, $list) => {
        cy.get(':nth-child(1) > :nth-child(1) > .ant-tag > .anticon > svg').eq(index).click();
       })
       cy.contains('タスク編集').click();
    })

    it('Type in new manager', function() {
        cy.get('.grid > :nth-child(5) .ant-select-selector').click();
        cy.get('.ant-select-item-option-content').eq(0).click();
        cy.get('.ant-select-item-option-content').eq(1).click();
        cy.get('.ant-select-item-option-content').eq(2).click();
        cy.contains('タスク編集').click();
    })

})

