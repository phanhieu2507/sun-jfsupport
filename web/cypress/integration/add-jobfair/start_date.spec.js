describe('開始日 test',()=>{
    beforeEach(()=>{
        cy.visit('http://jobfair.local:8000/add-jobfair')
    })
    it('Type day',()=>{
        cy.get('#start_date').type('2021/07/15',{force: true})
            cy.get('.ant-btn-primary').click()
            cy.get('div.ant-row:nth-child(2) > div:nth-child(2) > div:nth-child(2)').should('contain','')
    })
    it('Type nothing',()=>{
            cy.get('.ant-btn-primary').click()
            cy.get('div.ant-row:nth-child(2) > div:nth-child(2) > div:nth-child(2)').should('contain','この項目は必須です')
    })
    // it('Type wrong format day',()=>{
    //     cy.get('#開始日').type('15/07/2021',{force: true})
    //         cy.get('.ant-btn-primary').click()
    //         cy.get('div.ant-row:nth-child(2) > div:nth-child(2) > div:nth-child(2)').should('contain','日付は YYYY/MM/DD 形式でなければなりません')
    // })

    it('Type past day',()=>{
        cy.get('#start_date').type('2001/07/15',{force: true})
            cy.get('.ant-btn-primary').click()
            cy.get('div.ant-row:nth-child(2) > div:nth-child(2) > div:nth-child(2)').should('contain','')
    })
})