describe('Username Testing', () => {
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
  it('username_test', () => {
    cy.request({
      method: 'GET',
      url: 'api/web-init',
    }).then((res) => {
      cy.get('#basic_email').should('have.value', res.body.auth.user.email)
    })
    cy.get('#basic_email').clear()
    cy.get('[role="alert"]').should('contain', 'この項目は必須です。')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('#basic_email').type('abc')
    cy.get('[role="alert"]').should('contain', 'メールアドレスの形式が正しくありません。')
    cy.contains('保 存').should('not.be.disabled')
    cy.request({
      method: 'GET',
      url: 'api/profile/10',
    }).then((res) => {
      cy.get('#basic_email').clear().type(res.body.email)
      cy.wait(10000)
      cy.get('[role="alert"]').should('contain', 'このメールは既に存在しました。')
      cy.contains('保 存').should('not.be.disabled')
    })
    cy.get('#basic_email').clear().type('vu.van.phong-b@sun-asterisk.com')
    cy.get('#basic_email').should('not.have.css', 'border-color', '#ff617b')
  })
  it('chatwork_test', () => {
    cy.request({
      method: 'GET',
      url: 'api/web-init',
    }).then((res) => {
      cy.get('#basic_chatwork').should('have.value', res.body.auth.user.chatwork_id)
    })
    cy.get('#basic_chatwork').clear()
    cy.get('[role="alert"]').should('contain', 'この項目は必須です。')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('#basic_chatwork').type('#@')
    cy.get('[role="alert"]').should('contain', '特殊文字を入力しないでください。')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('#basic_chatwork').type('   ')
    cy.get('[role="alert"]').should('contain', 'スペースを入力しないでください。')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('#basic_chatwork').clear().type('abc123')
    cy.get('#basic_chatwork').should('not.have.css', 'border-color', '#ff617b')
  })
})
