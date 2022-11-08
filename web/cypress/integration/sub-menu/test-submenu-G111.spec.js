///  <reference types="Cypress" />

describe('Check Display', () => {
  // check sub-menu
  it('Case 1', () => {
    cy.visit('http://jobfair.local:8000/jf-toppage/kanban')
    // check sub-menu icon
    cy.get('.ant-menu-item').each(($el, index, $list) => {
      const win = $el[0].ownerDocument.defaultView
      const before = win.getComputedStyle($el[0], 'before')
      const contentValue = before.getPropertyValue('content')
      expect(contentValue).to.eq('none')
    })
    // check sub-menu text
    cy.get('.ant-menu-item').each(($el, index, $list) => {
      if (index === 0) {
        expect($el.text()).to.eq('ホーム')
      } else if (index === 1) {
        expect($el.text()).to.eq('タスク')
      } else if (index === 2) {
        expect($el.text()).to.eq('ガントチャート')
      } else if (index === 3) {
        expect($el.text()).to.eq('カンバン')
      } else if (index === 4) {
        expect($el.text()).to.eq('ファイル')
      }
    })
  })
  // check sub-menu status
  it('Case 2', () => {
    // sub-menu not open
    cy.get("aside[class*='ant-layout-sider-collapsed']").should('have.length', 0)
    // arrow left
    cy.get("span[aria-label='arrow-left']:visible").should('have.length', 1)
    // close sub-menu and check arrow status again
    cy.get('.ant-menu > .relative > .absolute > .button').click()
    cy.get("span[aria-label='arrow-right']:visible").should('have.length', 1)
    cy.get('.ant-menu > .relative > .absolute > .button').click()
    cy.get("aside[class*='ant-layout-sider-collapsed']").should('have.length', 0)
  })
})

describe('Check Activities', () => {
  // check link sub-menu links

  it('Case 1', () => {
    // check JFTopPage link
    cy.contains('ホーム').click()
    cy.url().should('include', 'jf-toppage')
    // check Task link
    cy.contains('タスク').click()
    cy.url().should('include', 'task-list')
    // check GranttChart link
    cy.contains('ガントチャート').click()
    cy.url().should('include', 'grantt-chart')
    // Check KanBan
    cy.contains('カンバン').click()
    cy.url().should('include', 'kanban')
    // Check file
    cy.contains('ファイル').click()
    cy.url().should('include', 'file')
  })

  it('Case 2', () => {
    // close menu
    cy.get('.ant-menu > .relative > .absolute > .button').click()
    // hover icons when sub-menu closed
    cy.get('.ant-menu-item').each(($item, index, $list) => {
      cy.get('.ant-menu-item').eq(index).trigger('mouseover')
      if (index === 0) {
        cy.contains('ホーム').should('have.length', 1)
      } else if (index === 1) {
        cy.contains('タスク').should('have.length', 1)
      } else if (index === 2) {
        cy.contains('ガントチャート').should('have.length', 1)
      } else if (index === 3) {
        cy.contains('カンバン').should('have.length', 1)
      } else {
        cy.contains('ファイル').should('have.length', 1)
      }
    })
  })
})
