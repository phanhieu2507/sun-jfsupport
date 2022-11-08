///  <reference types="Cypress" />

describe("Test 1: Manager", function() {
    it("Load Page", function() {
        cy.visit('http://jobfair.local:8000/task-detail/3');
        cy.wait(1000);
    })

    it("Manager Display", function() {
        // check manger label
        cy.contains('担当者').should('have.length', 1);
        // check display manager name
        cy.get('.list__member > li').each(($managerName, index, $list) => {
            expect($managerName.text()).to.not.eq('');
        })
    })
})

describe('Test 2: Date', function() {
    it("Start Day", function() {
        cy.contains('開始日').should('have.length', 1);
        cy.get(':nth-child(7) > .grid > :nth-child(2) > .item__right').should('not.have.length', '');
    })

    it("End Day", function() {
        cy.contains('終了日').should('have.length', 1);
        cy.get(':nth-child(8) > .grid > :nth-child(2) > .item__right').should('not.have.length', '');
    })
})

describe('Test 3: Status', function() {
    it("Status Display", function() {
        cy.contains('ステータス').should('have.length', 1);
        cy.get(':nth-child(6) > .grid > :nth-child(2) > .item__right').should('not.have.length', '');
    })
})

describe("Test 4: Milestone", function() {
    it("Milestone Display", function() {
        cy.contains('マイルストーン').should('have.length', 1);
    })
})

describe("Test 5: Category", function() {
    it("Category Display", function() {
        cy.contains('カテゴリ').should('have.length', 1);
    })
})


describe("Test 6: Status", function() {
    it("Status Display", function() {
        cy.contains('ステータス').should('have.length', 1);
    })
})

