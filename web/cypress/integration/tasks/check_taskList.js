///  <reference types="Cypress" />

describe("Check Pagination", function() {
    it("List Inital Status", function() {
        cy.visit('http://jobfair.local:8000/tasks/1');
        cy.wait(1000);
        cy.get('.active').should('contain', '全て')
    })
    
    it("No. Order", function() {
        cy.get('.ant-table-row td:nth-child(1)').each(($element, index, $lst) => {
            expect(parseInt($element.text())).to.eq(index + 1);
        })
    })

    it("Task Name", function() {
        cy.get('.ant-table-row td:nth-child(2)').each(($element, index, $lst) => {
            expect($element.text()).not.eq("");
        })
    })

    it("Task Start Date", function() {
        cy.get('.ant-table-row td:nth-child(3)').each(($element, index, $lst) => {
            expect($element.text()).not.eq("");
        })
    })

    it("Task End Date", function() {
        cy.get('.ant-table-row td:nth-child(4)').each(($element, index, $lst) => {
            expect($element.text()).not.eq("");
        })
    })

    it("Task Category", function() {
        cy.get('.ant-table-row td:nth-child(6)').each(($element, index, $lst) => {
            expect($element.text()).not.eq("");
        })
    })

    it("Task Milestone", function() {
        cy.get('.ant-table-row td:nth-child(7)').each(($element, index, $lst) => {
            expect($element.text()).not.eq("");
        })
    })

    it("Task Manager", function() {
        cy.get('.ant-table-row td:nth-child(8)').each(($element, index, $lst) => {
            expect($element.text()).not.eq("");
        })
    })

    // Check task link
    it("Click Task Name", function() {
        cy.get('.ant-table-row td:nth-child(2) > a').eq(0).click();
        cy.url().should('contain', 'task-detail');
        cy.visit('http://jobfair.local:8000/tasks/1');
        cy.wait(1000);
    })

    // Check hover task => display full task name
    it("Hover Task Name", function() {
        cy.get('.ant-table-row td:nth-child(2) > a').each(($element, index, $list) => {
            cy.get('.ant-table-row td:nth-child(2) > a').eq(index).invoke('mouseover');
            cy.contains($element.text()).should('have.length', 1);
    
        })
    })

})