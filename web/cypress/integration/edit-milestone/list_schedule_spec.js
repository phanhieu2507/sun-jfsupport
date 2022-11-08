/// <reference types="cypress" />
const select_options = ['10', '25', '50']
const role = 'admin'
describe('list-schedule', () => {
  beforeEach(() => {
    cy.visit('http://jobfair.local:8000/schedule')
  })
  it('chech items', () => {
    cy.get('.ant-table-tbody').should('exist')
    cy.get('.ant-pagination').should('exist')
  })
  it('check numbers', () => {
    cy.get('.ant-select-selection-item').as('select')
    cy.get('@select').invoke('attr', 'title').should('eq', '10')
    cy.get('@select').click().then(() => {
      cy.get('.ant-select-item-option').as('options')
      cy.get('@options').each((el, index) => {
        expect(el.text()).to.equal(select_options[index])
      })
    })
    cy.get('.ant-pagination-item').its('length').should('eq', 3)
    cy.get('@select').click().then(() => {
      cy.get('@options').eq(2).click({force: true}).then(() => {
        cy.get('.ant-pagination-item').its('length').should('eq', 1)
      })
    })
  })
  it('check button add', () => {
    cy.get('.anticon-plus-circle').as('add-button')
    if(role == 'admin') {
      cy.get('@add-button').should('exist')
      cy.get('@add-button').click().then(() => {
        cy.location().should((url) => {
          expect(url.pathname).to.eq('/schedule/add')
        })
      })
    } 
  })
  it('check button search', () => {
    cy.get('.anticon-search').should('exist')
    cy.get('.ant-input').should('exist').as('search-input')
    cy.get('@search-input').invoke('attr', 'placeholder').should('eq', '探索')
    cy.get('@search-input').type('b').then(() => {
      cy.wait(1000)
      cy.get('.ant-table-row').contains('b', {matchCase: false})
    })
  })
  it('check jf schedule', () => {
    cy.get('.ant-pagination-item').its('length').should('eq', 3)
    cy.get('.ant-select-selection-item').click().then(() => {
      cy.get('.ant-select-item-option').eq(2).click({force: true}).then(() => {
        cy.get('.ant-pagination-item').its('length').should('eq', 1)
      })
    })
    cy.get('.ant-table-row').eq(0).click().then(() => {
      cy.url().should('contains', '/schedule/1')
    })
    cy.go('back')
    cy.get('.ant-input').type('asdkjashdf').then(() => {
      cy.get('.ant-empty').should('exist')
    })
  })
  it('check pagination', () => {
    cy.get('.ant-select-selection-item').click().then(() => {
      cy.get('.ant-select-item-option').as('options').eq(2).click({force: true}).then(() => {
        cy.get('.ant-pagination-prev .ant-pagination-item-link').as('prev-link').should('be.disabled')
        cy.get('.ant-pagination-next .ant-pagination-item-link').as('next-link').should('be.disabled')
      })
    })
    cy.get('.ant-input').type('asdkjashdf').then(() => {
      cy.get('.ant-pagination').should('not.exist')
      cy.get('.ant-input').clear()
    })
    cy.get('@options').eq(0).click({force: true})
    cy.get('@prev-link').should('be.disabled')
    cy.get('@next-link').click()
    cy.get('.ant-pagination-item-2').as('page-2').click().then(() => {
      cy.get('@prev-link').should('not.be.disabled')
      cy.get('@next-link').should('not.be.disabled')
      cy.get('@prev-link').click().then(() => {
        cy.get('.ant-pagination-item-1').as('page-1').should('have.class', 'ant-pagination-item-active')
        cy.get('@next-link').dblclick()
        cy.get('.ant-pagination-item-3').should('have.class', 'ant-pagination-item-active')
        cy.get('@next-link').should('be.disabled')
      })
    })
    cy.get('@page-1').click().then(() => {
      cy.get('@next-link').click().then(() => {
        cy.get('@page-2').should('have.class', 'ant-pagination-item-active')
      })
    })
    cy.get('@prev-link').click(() => {
      cy.get('@page-1').should('have.class', 'ant-pagination-item-active')
    })
  })
})