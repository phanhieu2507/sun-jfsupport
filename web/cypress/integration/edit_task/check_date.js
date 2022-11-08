///  <reference types="Cypress" />

describe("Test 1: Start Date", function() {
    it("Load page", function() {
        cy.visit('http://jobfair.local:8000/edit-task/13');
        cy.wait(1000);
    })
    it("Display old date", function() {
        cy.get('#start_time').should('not.have.attr', 'value', '');
    })
    it('Type new date', function() {
        cy.get(':nth-child(7) > .ant-row > .ant-col-18 > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-picker > .ant-picker-input > .ant-picker-clear > .anticon > svg > path').click({force: true});
        cy.get('#start_time').type('2020/03/13', {force: true});
        cy.get('#start_time').should('have.attr', 'value', '2020/03/13');  
    })
    
})

describe("Test 2: End Date", function() {
    it("Display old date", function() {cy.get('#start_time')
        cy.get('#end_time').should('not.have.attr', 'value', '');
    })
    it('Type new date', function() {
        cy.get(':nth-child(8) > .ant-row > .ant-col-18 > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-picker > .ant-picker-input > .ant-picker-clear > .anticon > svg > path').click({force: true});
        cy.get('#end_time').type('2021/03/30', {force: true});
        cy.get('#end_time').should('have.attr', 'value', '2021/03/30');  
    })

})