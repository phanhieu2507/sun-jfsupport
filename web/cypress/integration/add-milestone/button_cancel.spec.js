/// <reference types="cypress" />

describe('check button cancel', () => {
    beforeEach(() => {
      cy.visit('http://jobfair.local:8000/milestones/add')
      cy.wait(500)
    })
  
    it('check button cancel always be enabled', () => {
      cy.get('#addMilestone_name').clear()
      cy.get('#addMilestone_time').clear()
      cy.get('[type="button"]').contains('キャンセル').should('not.be.disabled')
      cy.get('#addMilestone_name').type('abcv')
      cy.get('#addMilestone_time').type('3')
      cy.get('[type="button"]').contains('キャンセル').should('not.be.disabled')
    })
  
    it('check modal when click cancel button', () => {
      cy.get('[type="button"]').contains('キャンセル').click()
      cy.get('.ant-modal-content').should('be.visible')
      cy.get('.ant-modal-body').should('contain', '変更内容が保存されません。よろしいですか？')
      cy.get('.ant-modal-content').within(() => {
        cy.get('.ant-btn').first().should('be.visible').should('contain', 'いいえ')
        cy.get('.ant-btn').last().should('be.visible').should('contain', 'はい')
      })
    })
  
    it('check when click outside the modal', () => {
      const arr = []
      cy.get('#addMilestone_name').invoke('val')
        .then((sometext) => { arr.push(sometext) })
      cy.get('#addMilestone_time').invoke('val')
        .then((sometext) => { arr.push(sometext) })
      cy.get('.ant-select-selection-item').invoke('text').then((sometext) => { arr.push(sometext) })
      cy.get('[type="button"]').contains('キャンセル').click()
      cy.get('body').click(0, 0)
      cy.get('.ant-modal-root').should('not.be.visible')
      cy.get('#addMilestone_name').invoke('val')
        .then((sometext) => {
          expect(sometext).to.equal(arr[0])
        })
      cy.get('#addMilestone_time').invoke('val')
        .then((sometext) => { expect(sometext).to.equal(arr[1]) })
      cy.get('.ant-select-selection-item').invoke('text')
        .then((sometext) => { expect(sometext).to.equal(arr[2]) })
    })
  
    it('check when button no of the modal', () => {
      const arr = []
      cy.get('#addMilestone_name').invoke('val')
        .then((sometext) => { arr.push(sometext) })
      cy.get('#addMilestone_time').invoke('val')
        .then((sometext) => { arr.push(sometext) })
      cy.get('.ant-select-selection-item').invoke('text').then((sometext) => { arr.push(sometext) })
      cy.get('[type="button"]').contains('キャンセル').click()
      cy.get('.ant-modal-content').find('.ant-btn').first().click()
      cy.get('.ant-modal-root').should('not.be.visible')
      cy.get('#addMilestone_name').invoke('val')
        .then((sometext) => { expect(sometext).to.equal(arr[0]) })
      cy.get('#addMilestone_time').invoke('val')
        .then((sometext) => { expect(sometext).to.equal(arr[1]) })
      cy.get('.ant-select-selection-item').invoke('text')
        .then((sometext) => { expect(sometext).to.equal(arr[2]) })
    })
  })
  