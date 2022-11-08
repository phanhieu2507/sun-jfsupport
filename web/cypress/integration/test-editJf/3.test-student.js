///  <reference types="Cypress" />

describe("Test 3: Check Numbers of Student", function() {
    before(function() {
        // visit jobfairs edit page
        cy.visit("http://jobfair.local:8000/edit-jf/1");
    })
    it("Check Input Display", function() {
        cy.get('#number_of_students').type('12321');
        cy.get('.mx-auto >.text-3xl').click();
        cy.get("#number_of_students").should("not.have.attr", 'value', '');
    })
    // 
    it("Check input typed by user", function() {
        const randomValue = Math.floor(Math.random() * 100) + 1;
        cy.get('#number_of_students').clear().type(randomValue);
        cy.get('#number_of_students').should('have.attr', 'value', randomValue);
        // Check fullwidth - halfwidth
        cy.get('#number_of_students').clear().type("４５６");
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('#number_of_students').should('have.attr', 'value', 456);
         // Check empty input
        cy.get('#number_of_students').clear({force: true});
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('.ant-form-item-explain > div').should('have.text', 'この項目は必須です');
        //
        cy.get('#number_of_students').clear().type(Math.random() * 100);
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('.ant-form-item-explain > div').should('have.text', '1以上の半角の整数で入力してください');
        //
        cy.get('#number_of_students').clear().type(Math.random() * 100 * (-1))
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('.ant-form-item-explain > div').should('have.text', '1以上の半角の整数で入力してください');
         
    })


})