///  <reference types="Cypress" />
describe("Test 2: Check Numbers of Enterprise", function() {
    before(function() {
        // visit jobfairs edit page
        cy.visit("http://jobfair.local:8000/edit-jf/1");
    })
    
    it("Check Input Display", function() {
        cy.get('#number_of_companies').type(23);
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('#number_of_companies').should('not.have.attr', 'value', '');
    })
    // check input replaced by user input
    it("Check input typed by user", function() {
        const randomValue = Math.floor(Math.random() * 100) + 1;
        cy.get('#number_of_companies').clear().type(randomValue);
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('#number_of_companies').should('have.attr', 'value', randomValue);
        // Check fullwidth - haflwitdh
        cy.get('#number_of_companies').clear().type("４５６");
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('#number_of_companies').should('have.attr', 'value', 456);
        // check empty
        cy.get('#number_of_companies').clear();
        cy.get('.ant-form-item-explain-error').should('have.text', 'この項目は必須です');
        // check float input
        cy.get('#number_of_companies').clear().type(Math.random() * 100);
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('.ant-form-item-explain-error').should('have.text', '1以上の半角の整数で入力してください');
        // check negative input
        cy.get('#number_of_companies').clear().type(Math.random() * 100 * (-1));
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('.ant-form-item-explain-error').should('have.text', '1以上の半角の整数で入力してください');
          

    })

})