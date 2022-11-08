describe('Check button save', () => {
  beforeEach(() => {
    cy.visit('http://jobfair.local:8000/edit-jf/11')
    cy.wait(500)
  })

  it('Check button save clickable', () => {
    cy.get('#name').clear().type('abc')
    cy.get('#start_date').invoke('val', '');
    cy.get('[type="submit"]').should('not.be.disabled')
  })

  it('check click save ', () => {
    cy.get('#basic_name').clear().type('なめ') // replace with a input name that available in your database
    cy.get('[type="submit"]').click()
    cy.wait(300)
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', '変更は正常に保存されました。')
    
  })


})
