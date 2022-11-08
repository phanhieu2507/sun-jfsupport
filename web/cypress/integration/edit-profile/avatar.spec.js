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
  it('avatar display', () => {
    cy.get('.avatar-img').should('have.css', 'width', '150px')
    cy.get('.avatar-img').should('have.css', 'height', '150px')
    cy.get('[type="file"]').attachFile('download.jpeg')
    cy.get('.ant-notification-notice-message').should('contain', '.jpg, .png, サイズ4MB未満の画像を選択してください')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('[type="file"]').attachFile('aot.png')
    cy.get('.ant-notification-notice-message').should('contain', '.jpg, .png, サイズ4MB未満の画像を選択してください')
    cy.contains('保 存').should('not.be.disabled')
    cy.get('[type="file"]').attachFile('cat.jpg')
    cy.get('.ant-notification-notice-message').should('not.exist')
    cy.get('[type="file"]').attachFile('default.jpg')
    cy.contains('保 存').should('not.be.disabled').click()
  })
})
