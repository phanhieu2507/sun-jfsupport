///  <reference types="Cypress" />
describe("Not Admin Login", function() {
    it("Load Page", function() {
        cy.visit('http://jobfair.local:8000/task-detail/1');
    })

    it("Not Display Edit Button", function() {
        cy.contains("削 除").should('have.length', 0);
    })
})


describe("Login", function() {
    it("Admin Login", function() {
        cy.visit('http://jobfair.local:8000/');
        cy.wait(1000);
        cy.get('#login_email').clear().type("AnAdmin@sun-asterisk.com");
        cy.get('#login_password').clear().type("12345678");
        cy.get('.ant-btn').click();
        cy.wait(5000);
        cy.visit('http://jobfair.local:8000/task-detail/3');

    })
})

describe("Test Delete Button", function() {
    it("Button Display", function() {
        cy.contains("削 除").should('have.length', 1);
    
    })

    it("Click Button: Not Delete", function() {
        cy.contains("削 除").click();
        cy.contains("削除してもよろしいですか？").should('have.length', 1);
        cy.contains('いいえ').click();
        cy.url().should('contain', 'task-detail');
    })

    it("Click Button: Delete", function() {
        cy.get(':nth-child(1) > .grid > .col-span-2 > .item__right').then(taskName => {
            taskName = taskName.text();
            cy.contains("削 除").click();
            cy.contains("削除してもよろしいですか？").should('have.length', 1);
            cy.contains('はい').click();
            // code not redirect user to task list page
        })
    })
})
