import { before } from 'lodash'

describe('JF名 test', () => {
  beforeEach(() => {
    cy.visit('http://jobfair.local:8000/add-jobfair')
  })
  it('Type name', () => {
    const namefield = cy.get('#name')
    namefield.click()
    namefield.focused().type('Henry Jonnathan')
    for (var i = 0; i < 15; i++) {
      namefield.type('{backspace}')
    }
    cy.get('.ant-btn-primary').click()
    cy.get('.ant-form-item-explain.ant-form-item-explain-error').should('contain', 'この項目は必須です')
    cy.get('#name').click()
    for (var i = 0; i < 2; i++) {
      cy.get('#name').type('!@?%')
    }
    cy.get('.ant-btn-primary').click()
    cy.get('.ant-form-item-explain.ant-form-item-explain-error').should('contain', '使用できない文字が含まれています')
  })
})
