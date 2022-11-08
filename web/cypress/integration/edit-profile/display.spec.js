describe('Display Testing', () => {
  before(() => {
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
  it('title, button, ...', () => {
    cy.get('main>h1').should('contain', 'プロフィール編集')
    cy.get('.avatar').should('be.visible')
    cy.get('[for="basic_name"]').should('contain', 'ユーザー名')
    cy.get('#basic_name').should('be.visible')
    cy.get('#basic_chatwork').should('be.visible')
    cy.get('[for="basic_chatwork"]').should('contain', 'チャットワークID')
    cy.get('#basic_email').should('be.visible')
    cy.get('[for="basic_email"]').should('contain', 'メール')
    cy.contains('キャンセル').should('be.visible')
    cy.contains('保 存').should('be.visible')
    cy.contains('パスワード変更').should('be.visible')
    cy.get('.navbar').should('be.visible')
  })
})
