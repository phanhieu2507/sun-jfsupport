///  <reference types="Cypress" />
describe("Test 1", function() {
    before(function() {
        // visit jobfairs edit page
        cy.visit("http://jobfair.local:8000/edit-jf/1");
    })

    it("Check Title", function() {
        cy.contains('JF 編集').should('have.length', 1);
        
    })

    it("Check Screen Display", function() {
        // check all labels
        cy.get('.ant-form-item-no-colon').each(($requiredField, index, $list) => {
            if (index === 0) {
                cy.get('.ant-form-item-no-colon').eq(index).should('have.text', 'JF名');
                cy.get('input').eq(index).should('have.attr', 'id', 'name');
            }
            else if (index === 1) {
                cy.get('.ant-form-item-no-colon').eq(index).should('have.text', '開始日');
                cy.get('input').eq(index).should('have.attr', 'id', 'start_date');
            } 
            else if (index === 2) {
                cy.get('.ant-form-item-no-colon').eq(index).should('have.text', '参加企業社数');
                cy.get('input').eq(index).should('have.attr', 'id', 'number_of_companies');
            
            }
            else if (index === 3) {
                cy.get('.ant-form-item-no-colon').eq(index).should('have.text', '推定参加学生数');
                cy.get('input').eq(index).should('have.attr', 'id', 'number_of_students');

            }
            else if (index === 4) {
                cy.get('.ant-form-item-no-colon').eq(index).should('have.text', '管理者');
                cy.get('input').eq(index).should('have.attr', 'id', 'jobfair_admin_id');
            }
            else if (index === 5) {
                cy.get('.ant-form-item-no-colon').eq(index).should('have.text', 'JF-スケジュール');
                cy.get('input').eq(index).should('have.attr', 'id', 'schedule_id');
            } 
            else if (index === 6) {
                cy.contains('タスク一覧').should('have.length', 1);
                cy.get('.ant-list-empty-text').eq(0).should('have.length', 1);

            }
            else {
                cy.contains('マイルストーン一覧').should('have.length', 1);
                cy.get('.ant-list-empty-text').eq(1).should('have.length', 1);
                
            }
        })
        // check buttons
        cy.contains('保 存').should('have.length', 1);
        cy.contains('キャンセル').should('have.length', 1);  
    })

    it("Check JF Name", function() {
        // check JF name was filled with old name
        cy.get('#name').should('not.have.attr', 'value', '');
        // type new name
        cy.get("#name").focus().clear().type('new name')
        cy.get('#name').should('have.attr', 'value', 'new name');
        // type empty
        cy.get("#name").focus().clear();
        cy.get("label[title='開始日']").click();
        // display alert message
        cy.get('.ant-form-item-explain-error').eq(0).should('have.text', 'この項目は必須です');
    })

    it("Check JF Start Date", function() {
        cy.get('#start_date').should('not.have.length', 0);
        cy.get('#start_date').clear({force: true}).type('2020/02/19').type('{enter}');
        cy.get('#start_date').should('have.value', '2020/02/19');
        cy.get('#start_date').clear({force: true}).type('{enter}');
        cy.get('.ant-picker-clear > .anticon > svg > path').click({force: true});
        // check alert
        cy.get('.ant-form-item-explain-error').eq(1).should('have.text', 'この項目は必須です');
        
        // auto convert to date picker when type in invalid date
        cy.get('#start_date').clear({force: true}).type('2020/02/19');
        cy.get('#start_date').clear().type('01/01/2021').type('{enter}');
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('#start_date').should('have.attr', 'value', '2020/02/19');        
       
        // auto convert to date picker when type in invalid characters
        cy.get('#start_date').clear().type('2020/02/19');
        cy.get('#start_date').clear().type('3/20$2001...$#@!%^&*()+_');
        cy.get('.mx-auto >.text-3xl').click();
        cy.get('#start_date').should('have.attr', 'value', '2020/02/19');        
    
        // type in earlier date
        cy.get('#start_date').then(currentDate => {
            // type in earlier date
            cy.get('#start_date').clear().type('2019/06/18').type('{enter}')
            currentDate = Date.parse(currentDate.prop('value'));
            cy.get('#start_date').then(earlierDate => {
                earlierDate = Date.parse(earlierDate.prop('value'));
                expect(earlierDate).to.be.lte(currentDate);
            })  
            
        })
    })
})
