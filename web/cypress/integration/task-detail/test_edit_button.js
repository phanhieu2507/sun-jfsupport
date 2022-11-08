///  <reference types="Cypress" />
describe("Not Admin Login", function() {
    it("Load Page", function() {
        cy.visit('http://jobfair.local:8000/task-detail/1');
    })

    it("Not Display Edit Button", function() {
        cy.contains("編 集").should('have.length', 0);
    })
})

describe("Admin Login", function() {
    it("Login", function() {
        cy.visit('http://jobfair.local:8000/');
        cy.wait(1000);
        cy.get('#login_email').clear().type("AnAdmin@sun-asterisk.com");
        cy.get('#login_password').clear().type("12345678");
        cy.get('.ant-btn').click();
        cy.wait(5000);
        cy.visit('http://jobfair.local:8000/task-detail/1');

    })
})

describe("Test Edit Button", function() {
    it("Button Display", function() {
        cy.contains("編 集").should('have.length', 1);
    
    })

    it("Click Button: Edit Delete", function() {
        cy.contains("編 集").click();
        cy.url().should('contain', 'template-task-dt');
    })

})
