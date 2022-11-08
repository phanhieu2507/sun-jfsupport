///  <reference types="Cypress" />


describe("Test Search Box", function() {
    it("Type Task Name", function() {
        cy.visit('http://jobfair.local:8000/tasks/1');
        cy.wait(1000);

        cy.get('.ant-table-row td:nth-child(2)').eq(0).then(element => {
            const taskName = element.text();
            cy.get(".ant-input").clear().type(taskName);
            cy.get('.ant-table-row td:nth-child(2)').each(($element, index, $lst) => {
                if ($element.text() === taskName) {
                    cy.get('.ant-table-row td:nth-child(2)').eq(index).should('contain', taskName);
                } else {
                    cy.contains('該当結果が見つかりませんでした').should('have.length', 1);
                }
            })
        })
    })

    it("Type Not Exist Name", function() {
        cy.get(".ant-input").clear().type("*&*()dsa");
        cy.contains('該当結果が見つかりませんでした').should('have.length', 1);
    })

    it("Type Task Manager", function() {
        cy.get(".ant-input").clear();
        cy.get('.ant-table-row td:nth-child(8)').eq(1).then(taskManager => {
            const managerName = taskManager.text().split(',')[0];
            if (managerName) {
                cy.get(".ant-input").clear().type(managerName);
                cy.get('.ant-table-row td:nth-child(8)').each(($element, index, $lst) => {
                    expect($element.text()).contain(managerName);
                })
            }
        })
        
    })

    it("Type Not Exist Task Manager", function() {
        cy.get(".ant-input").clear().type("*&*()dsa");
        cy.contains('該当結果が見つかりませんでした').should('have.length', 1);
    })

    it("Move To New Page When Searching", function() {
        cy.get(".ant-input").clear().type("*&*()dsa");
        cy.get('.ant-menu-item-selected > .ant-menu-title-content > a').click();
        cy.url().should('contain', 'jf-toppage');
    })
    

})