describe('参加企業社数 test', () => {
  before(() => {
    cy.visit('http://jobfair.local:8000/add-jobfair')
  })
  it('type zero', () => {
    cy.get('#number_of_companies').type('0')
    cy.get('div.ant-row:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').should('contain', '1以上の半角の整数で入力してください')
    cy.get('#number_of_companies').clear()
    cy.get('#number_of_companies').type('-6')
    cy.get('div.ant-row:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').should('contain', '1以上の半角の整数で入力してください')
    cy.get('#number_of_companies').clear()
  })
  it('fullwidth number', () => {
    cy.get('#number_of_companies').type('１２３４５')

    cy.get('#number_of_companies').should('have.value', '12345')
  })
  // １２３４５
  // it('Increase by 1 button',()=>{
  //     for(var i=0;i<5;i++){
  //         cy.get('div.ant-row:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)').click()
  //     }

  //     cy.get('#number_of_companies').should('have.attr','aria-valuenow','6')
  // })

  // it('Decrease by 1 button',()=>{
  //     cy.get('#number_of_companies').type('10')
  //     for(var i=0;i<5;i++){
  //         cy.get('div.ant-row:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)').click()
  //     }

  //     cy.get('#number_of_companies').should('have.attr','aria-valuenow','605')
  // })

  it('Emty field', () => {
    for (let i = 0; i < 5; i++) {
      cy.get('#number_of_companies').type('{backspace}')
    }
    cy.get('div.ant-row:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').should('contain', 'この項目は必須です')
  })
})
