///  <reference types="Cypress" />


describe("Test Display Numbers", function() {
    it("Check Default Numbers of Task", function() {
        cy.visit('http://jobfair.local:8000/tasks/1');
        cy.get("span[title='10']").should('have.length', 1);
    })
    
    it("Check Pulldown Values", function() {
        cy.get(".ant-select-selection-item").click();
        cy.get('.ant-select-item.ant-select-item-option').eq(0).should('have.attr', 'title', 10);
        cy.get('.ant-select-item.ant-select-item-option').eq(1).should('have.attr', 'title', 25);
        cy.get('.ant-select-item.ant-select-item-option').eq(2).should('have.attr', 'title', 50);
    })

    it("Check Less Than 25 Records", function() {
        cy.get('.ant-select-item.ant-select-item-option').eq(1).click();
        cy.get(".ant-table-cell-ellipsis").then(records => {
            const recordsLength = records.length;
            expect(recordsLength).to.lte(25);
        }) 
        cy.get('.ant-select-item.ant-select-item-option').eq(0).click({force: true});
    })

    // Check Pagination
    it("Pagination At First Page", function() {
        cy.get('.ant-pagination-item').then(pages => {
            const numOfPages = pages.length;
            if (numOfPages > 1) {
                cy.get('.ant-pagination-item-active > a').contains('1').should('have.length', 1);
                // check left arrow
                cy.get('.ant-pagination-prev').should('have.attr', 'aria-disabled', 'true');
            }
        })
    })

    it("Pagination At Middle Pages", function() {
        cy.get('.ant-pagination-item').then(pages => {
            const numOfPages = pages.length;
            const middlePage = Math.floor(Math.random() * numOfPages) + 1;
            if (numOfPages >= 3) {
                cy.get('.ant-pagination-item-active > a').contains(middlePage).should('have.length', 1);
                // check left arrow
                cy.get('.ant-pagination-prev').should('have.attr', 'aria-disabled', 'false');
                cy.get('.ant-pagination-next').should('have.attr', 'aria-disabled', 'false');
            }
        })
    })
    
    it("Pagination At Last Page", function() {
        cy.get('.ant-pagination-item').then(pages => {
            const numOfPages = pages.length;
            cy.get('.ant-pagination-item').eq(numOfPages - 1).click();
            cy.wait(300);
            if (numOfPages > 1) {
                cy.get('.ant-pagination-item-active > a').contains(numOfPages).should('have.length', 1);
                // check left arrow
                cy.get('.ant-pagination-next').should('have.attr', 'aria-disabled', 'true');
            }
        })
    })
    
    // Check List 30 records

})