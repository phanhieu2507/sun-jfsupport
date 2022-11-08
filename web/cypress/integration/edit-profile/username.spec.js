describe('Username Testing', () => {
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
  it('username_test', () => {
    cy.request({
      method: 'GET',
      url: 'api/web-init',
    }).then((res) => {
      cy.get('#basic_name').should('have.value', res.body.auth.user.name)
    })
    cy.get('#basic_name').clear()
    cy.get('[role="alert"]').should('contain', 'この項目は必須です。')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('#basic_name').type('@#')
    cy.get('[role="alert"]').should('contain', '特殊文字を入力しないでください。')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('#basic_name').type('32')
    cy.get('[role="alert"]').should('contain', '数字を入力しないでください。')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('#basic_name').clear().type('Vũ Văn Phong')
    cy.get('#basic_name').should('not.have.css', 'border-color', '#ff617b')
  })
})
