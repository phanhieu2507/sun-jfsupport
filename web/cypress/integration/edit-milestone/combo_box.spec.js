describe('Check Combobox', () => {
  before(() => {
    cy.visit('http://jobfair.local:8000/milestones/1/edit')
    cy.wait(500)
  })
  
  it('Click Dropdown', () => {
    cy.get('.ant-select-selection-item').click()
    cy.get('.ant-select-item-option-content').should('be.visible')
  })

  it('Click Dropdown Item', () => {
    cy.get('.ant-select-item-option-content').first().click()
    cy.get('.ant-select-selection-item').should('contain', '日後').click()
    cy.get('.ant-select-item-option-content').last().click()
    cy.get('.ant-select-selection-item').should('contain', '週間後')
  })
})
