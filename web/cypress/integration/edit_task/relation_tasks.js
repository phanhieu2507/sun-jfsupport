///  <reference types="Cypress" />

describe('Test 1: Previous Task', function() {
    it('Load Page', function() {
        cy.visit('http://jobfair.local:8000/edit-task/1');
        cy.wait(3000);
    })
    
    it('Task more than 20 characters', function() {
        cy.contains("Prof. Nicola O'Reilly...").should('have.length', 1);
    })

    it("Click Task", function() {
        cy.get(':nth-child(9) .ant-tag .inline-block').click().then(() => {
            // hover
            cy.contains("Prof. Nicola O'Reilly III").should('have.length', 1);
            cy.wait(3000);
        })
        cy.url().should('contain', 'task-detail');
        cy.visit('http://jobfair.local:8000/edit-task/1');
    })

    it('Type In Task', function() {
        cy.get('.grid > :nth-child(9) .ant-select').click().type('Ms');
        cy.wait(2000);
        cy.contains('Ms. Jayda Aufderhar').should('have.length', 1);
    })

    it('Delete Task', function() {
        cy.get(':nth-child(9) .ant-tag > .anticon').each(($deleteTag, index, $list) => {
            cy.get(':nth-child(9) .ant-tag > .anticon').eq(index).click();
        })
    })

})

describe('Test 2: Next Task', function() {
    it("Click Task", function() {
        cy.get(':nth-child(10) .ant-tag .inline-block').click().then(() => {
            // hover
            cy.contains("Miss Ida Wiegand").should('have.length', 1);
            cy.wait(3000);
        })
        cy.url().should('contain', 'task-detail');
        cy.visit('http://jobfair.local:8000/edit-task/1');
    })

    it('Type In Task', function() {
        cy.get('.grid > :nth-child(10) .ant-select').click().type('Ms');
        cy.wait(2000);
        cy.contains('Ms. Jayda Aufderhar').should('have.length', 1);
    })

    it('Delete Task', function() {
        cy.get(':nth-child(10) .ant-tag > .anticon').each(($deleteTag, index, $list) => {
            cy.get(':nth-child(10) .ant-tag > .anticon').eq(index).click();
        })
    })

})