describe('check button cancel', () => {
  beforeEach(() => {
    cy.visit('http://jobfair.local:8000/edit-jf/11')
    cy.wait(500)
  })

  it('check button cancel always be enabled', () => {
    cy.get('#name').clear()
    cy.get('#start_date').invoke('val', '');
    cy.get('#number_of_companies').type('10');
    cy.get('#number_of_students').type('10');
    cy.get('[type="button"]').should('not.be.disabled')
    cy.get('#name').type('aaa');
    cy.get('#start_date').invoke('val','2021-07-15');
    cy.get('#number_of_companies').type('10');
    cy.get('#number_of_students').type('10');
    cy.get('[type="button"]').should('not.be.disabled')
  })

  it('check modal when click no button', () => {
    cy.get('[type="button"]').click()
    cy.get('.ant-modal-content').should('be.visible')
    cy.get('.ant-modal-body').should('contain', '変更内容が保存されません。よろしいですか？')
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().should('be.visible').should('contain', 'いいえ').click()
      cy.url().should('eq', 'http://jobfair.local:8000/edit-jf/11')
    })
  })

  // it('check modal when click yes button', () => {
  //   cy.get('[type="button"]').click()
  //   cy.get('.ant-modal-content').should('be.visible')
  //   cy.get('.ant-modal-body').should('contain', '変更内容が保存されません。よろしいですか？')
  //   cy.get('.ant-modal-content').within(() => {
  //     cy.get('.ant-btn').last().should('be.visible').should('contain', 'はい').click();
  //     cy.visit('http://jobfair.local:8000/JF-List');
  //     cy.url().should('eq', 'http://jobfair.local:8000/JF-List')
  //   })
  //   cy.go('back')
  // })

  it('check when button no of the modal', () => {
    const arr = []
    cy.get('#name').invoke('val')
    .then((sometext) => { arr.push(sometext) })
    cy.get('#start_date').invoke('val')
      .then((sometext) => { arr.push(sometext) })
    cy.get('#number_of_companies').invoke('val')
      .then((sometext) => { arr.push(sometext) })
    cy.get('#number_of_students').invoke('val')
      .then((sometext) => { arr.push(sometext) })
    cy.get('.ant-select-selection-item').first().invoke('text')
      .then((sometext) => { arr.push(sometext)})
    cy.get('.ant-select-selection-item').last().invoke('text')
      .then((sometext) => { arr.push(sometext)})
    cy.get('[type="button"]').click()
    cy.get('.ant-modal-content').find('.ant-btn').first().click()
    cy.get('.ant-modal-root').should('not.be.visible')
    cy.get('#name').invoke('val')
      .then((sometext) => {expect(sometext).to.equal(arr[0])})
    cy.get('#start_date').invoke('val')
      .then((sometext) => { expect(sometext).to.equal(arr[1]) })
    cy.get('#number_of_companies').invoke('val')
      .then((sometext) => { expect(sometext).to.equal(arr[2]) })
    cy.get('#number_of_students').invoke('val')
      .then((sometext) => { expect(sometext).to.equal(arr[3]) })
    cy.get('.ant-select-selection-item').first().invoke('text')
      .then((sometext) => { expect(sometext).to.equal(arr[4]) })
    cy.get('.ant-select-selection-item').last().invoke('text')
      .then((sometext) => { expect(sometext).to.equal(arr[5])})
  })
})
