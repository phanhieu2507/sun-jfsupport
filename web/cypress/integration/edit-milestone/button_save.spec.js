describe('Check button save', () => {
  beforeEach(() => {
    cy.visit('http://jobfair.local:8000/milestones/1/edit')
    cy.wait(500)
  })

  it('Check button save clickable', () => {
    cy.get('#basic_name').clear().type('abc')
    cy.get('#basic_time').clear().type('2')
    cy.get('[type="submit"]').should('not.be.disabled')
  })

  it('check modal when click save button', () => {
    cy.get('[type="submit"]').click()
    cy.get('.ant-modal-content').should('be.visible')
    cy.get('.ant-modal-body').should('contain', 'このまま保存してもよろしいですか？ ')
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().should('be.visible').should('contain', 'いいえ')
      cy.get('.ant-btn').last().should('be.visible').should('contain', 'はい')
    })
  })

  it('check when click outside modal', () => {
    cy.get('[type="submit"]').click()
    const arr = []
    cy.get('#basic_name').invoke('val')
      .then((sometext) => { arr.push(sometext) })
    cy.get('#basic_time').invoke('val')
      .then((sometext) => { arr.push(sometext) })
    cy.get('.ant-select-selection-item').invoke('text').then((sometext) => { arr.push(sometext) })
    cy.get('body').click(0, 0)
    cy.get('.ant-modal-root').should('not.be.visible')
    cy.get('#basic_name').invoke('val')
      .then((sometext) => { expect(sometext).to.equal(arr[0]) })
    cy.get('#basic_time').invoke('val')
      .then((sometext) => { expect(sometext).to.equal(arr[1]) })
    cy.get('.ant-select-selection-item').invoke('text')
      .then((sometext) => { expect(sometext).to.equal(arr[2]) })
  })

  it('check click save and click yes when milestone name is duplicate', () => {
    cy.get('#basic_name').clear().type('Mr._Abelardo_Botsford') // replace input name with a name that duplicate in database
    cy.get('[type="submit"]').click()
    cy.get('.ant-modal-content').find('.ant-btn').last().click()
    cy.wait(100)
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', 'このマイルストーン名は存在しています')
  })

  it('check click save and click no', () => {
    cy.get('[type="submit"]').click()
    const arr = []
    cy.get('#basic_name').invoke('val')
      .then((sometext) => { arr.push(sometext) })
    cy.get('#basic_time').invoke('val')
      .then((sometext) => { arr.push(sometext) })
    cy.get('.ant-select-selection-item').invoke('text').then((sometext) => { arr.push(sometext) })
    cy.get('.ant-modal-content').find('.ant-btn').last().click()
    cy.get('.ant-modal-root').should('not.be.visible')
    cy.get('#basic_name').invoke('val')
      .then((sometext) => { expect(sometext).to.equal(arr[0]) })
    cy.get('#basic_time').invoke('val')
      .then((sometext) => { expect(sometext).to.equal(arr[1]) })
    cy.get('.ant-select-selection-item').invoke('text')
      .then((sometext) => { expect(sometext).to.equal(arr[2]) })
  })
})
