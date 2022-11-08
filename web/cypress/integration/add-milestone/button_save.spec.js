/// <reference types="cypress" />

describe('Check button save', () => {
    beforeEach(() => {
      cy.visit('http://jobfair.local:8000/milestones/add')
      cy.wait(500)
    })
  
    it('check modal when click save button', () => {
      cy.get('#addMilestone_name').type('abc2')
      cy.get('#addMilestone_time').type('2')
      cy.get('[type="submit"]').contains('登 録').click()
      cy.get('.ant-modal-content').should('be.visible')
      cy.get('.ant-modal-body').should('contain', 'このまま保存してもよろしいですか？')
      cy.get('.ant-modal-content').within(() => {
        cy.get('.ant-btn').first().should('be.visible').should('contain', 'いいえ')
        cy.get('.ant-btn').last().should('be.visible').should('contain', 'はい')
      })
    })
  
    it('check when click outside modal', () => {
      cy.get('#addMilestone_name').type('abc2')
      cy.get('#addMilestone_time').type('2')
      cy.get('[type="submit"]').contains('登 録').click()
      const arr = []
      cy.get('#addMilestone_name').invoke('val')
        .then((sometext) => { arr.push(sometext) })
      cy.get('#addMilestone_time').invoke('val')
        .then((sometext) => { arr.push(sometext) })
      cy.get('.ant-select-selection-item').invoke('text').then((sometext) => { arr.push(sometext) })
      cy.get('body').click(0, 0)
      cy.get('.ant-modal-root').should('not.be.visible')
      cy.get('#addMilestone_name').invoke('val')
        .then((sometext) => { expect(sometext).to.equal(arr[0]) })
      cy.get('#addMilestone_time').invoke('val')
        .then((sometext) => { expect(sometext).to.equal(arr[1]) })
      cy.get('.ant-select-selection-item').invoke('text')
        .then((sometext) => { expect(sometext).to.equal(arr[2]) })
    })
  
    it('check click save and click yes when milestone name is available', () => {
      cy.get('#addMilestone_name').type('abc1') // replace with a input name that available in your database
      cy.get('#addMilestone_time').type('2')
      cy.get('[type="submit"]').contains('登 録').click()
      cy.get('.ant-modal-content').find('.ant-btn').last().click()
      cy.wait(100)
      cy.get('.ant-notification-notice-message').should('be.visible').should('contain', '正常に保存されました。')
    })
  
    it('check click save and click no', () => {
      cy.get('#addMilestone_name').type('milestone')
      cy.get('#addMilestone_time').type('1')
      cy.get('[type="submit"]').contains('登 録').click()
      const arr = []
      cy.get('#addMilestone_name').invoke('val')
        .then((sometext) => { arr.push(sometext) })
      cy.get('#addMilestone_time').invoke('val')
        .then((sometext) => { arr.push(sometext) })
      cy.get('.ant-select-selection-item').invoke('text').then((sometext) => { arr.push(sometext) })
      cy.get('.ant-modal-content').find('.ant-btn').last().click()
      cy.get('.ant-modal-root').should('not.be.visible')
      cy.get('#addMilestone_name').invoke('val')
        .then((sometext) => { expect(sometext).to.equal(arr[0]) })
      cy.get('#addMilestone_time').invoke('val')
        .then((sometext) => { expect(sometext).to.equal(arr[1]) })
      cy.get('.ant-select-selection-item').invoke('text')
        .then((sometext) => { expect(sometext).to.equal(arr[2]) })
    })
  })
  