describe('button save + button cancel testing', () => {
  beforeEach(() => {
    cy.request('GET', '/api/web-init').then((response) => {
      const str = response.headers['set-cookie'][0]
      const token = `${str.replace('XSRF-TOKEN=', '').replace(/%3[Dd].*/g, '')}==`
      cy.request({
        method: 'POST',
        url: '/api/login',
        headers: {
          'X-XSRF-TOKEN': token,
        },
        body: {
          email: 'jobfair@sun-asterisk.com',
          password: '12345678',
        },
      })
    })
    cy.visit('/profile/edit')
    cy.wait(500)
  })
  it('button save', () => {
    cy.contains('保 存').should('not.be.disabled')
    cy.get('#basic_chatwork').clear().type('12345678')
    cy.contains('保 存').should('be.enabled').click()
    cy.get('.ant-notification').should('be.visible').should('contain', '変更は正常に保存されました。')
  })
  it('button cancel', () => {
    cy.contains('キャンセル').should('be.enabled').click()
    cy.get('.ant-modal .ant-btn').first().click()
    cy.url().should('include', '/profile/edit')
    cy.contains('キャンセル').should('be.enabled').click()
    cy.get('.ant-modal .ant-btn-primary').click()
    cy.url().should('include', '/profile')
  })
})
