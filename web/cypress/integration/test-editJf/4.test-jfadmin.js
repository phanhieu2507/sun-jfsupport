///  <reference types="Cypress" />

describe("Test 4: Check JF Admin", function() {
    before(function() {
        // visit jobfairs edit page
        cy.visit("http://jobfair.local:8000/edit-jf/1");
    })
    it("Check Display", function() {
        cy.get('#jobfair_admin_id').should("not.have.text", "");
    })
    it("Check input typed by user", function() {
        // Check users in dropdown menu
        cy.get('#jobfair_admin_id').click();
        cy.get("#jobfair_admin_id_list").its('length').should('be.gte', 0);
        // Select user from dropdown menu
        cy.get("#jobfair_admin_id_list").eq(0).click().then((selectedUser) => {
            const userName = selectedUser.text();
            cy.get("#jobfair_admin_id").should('have.text', userName);
        })
    })
})