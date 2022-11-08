///  <reference types="Cypress" />

describe("Test 1: Effort", function() {
    it("Load Page", function() {
        cy.visit('http://jobfair.local:8000/task-detail/1');
        cy.wait(1000);
    })

    it("Check Effort Time Unit", function() {
        cy.contains('工数').should('have.length', 1);
        cy.get('.ef').eq(1).then(time => {
            const unit = time.text();
            let isHourOrDay = 0; 
            if(unit === '時間') {
                isHourOrDay = 1;
            }
            if(unit === '日') {
                isHourOrDay = 1;
            }
            expect(isHourOrDay).to.eq(1);
        })
    })

    it("Check Effort Object Unit", function() {
        cy.contains('工数').should('have.length', 1);
        cy.get('.ef').eq(2).then(time => {
            const unit = time.text();
            cy.log(unit);
            let isHourOrDay = 0; 
            if(unit === '学生数') {
                isHourOrDay = 1;
            }
            if(unit === '企業数') {
                isHourOrDay = 1;
            }
            if(unit === 'none') {
                isHourOrDay = 1;
            }
            expect(isHourOrDay).to.eq(1);
        })
    })
    
    it("Check '/' Symbol", function() {
        cy.contains('/').should('have.length', 1);
    })
})

describe("Test 2: Check Task Details", function() {
    it("Task Details Display", function() {
        // check label
        cy.contains('詳細').should('have.length', 1);
    })
    // Check Scrollbar
})

describe("Test 3: Back Button", function() {
    it("Button Display", function() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        cy.contains('戻る').should('have.length', 1);
    })

    it("Click Button", function() {
        // Check redirect to タスク一覧 page
        cy.contains('戻る').click();
        cy.wait(1000);
        cy.contains('タスク一覧').should('have.length', 1);
    })

    it("Redirect Back To Task Details Page", function() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        cy.visit('http://jobfair.local:8000/task-detail/1');
        cy.wait(1000);
    })
})  
