describe('Change Password Modal', () => {
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
  it('button change password + display modal', () => {
    cy.get('.ant-btn-round').should('be.visible').should('contain', 'パスワード変更').click()
    cy.get('.ant-modal').should('be.visible')
    cy.get('[for="reset_password_current_password"]').should('contain', '現在のパスワード')
    cy.get('#reset_password_current_password').should('be.visible')
    cy.get('[for="reset_password_password"]').should('contain', '新しいパスワード')
    cy.get('#reset_password_password').should('be.visible')
    cy.get('[for="reset_password_confirm_password"]').should('contain', '新しいパスワード(再確認)')
    cy.get('#reset_password_confirm_password').should('be.visible')
    cy.contains('キャンセル').should('be.visible')
    cy.contains('保 存').should('be.visible')
  })

  it('current password input', () => {
    cy.get('.ant-btn-round').click()
    cy.get('#reset_password_current_password').should('have.attr', 'placeholder', '現在のパスワードを入力してください。')
    // Check when page has just loaded
    // Check password is hidden
    cy.get('#reset_password_current_password')
      .invoke('attr', 'type')
      .should('contain', 'password')
      // Check input invalid password
      // Check input password shorter than 8 characters
    cy.get('#reset_password_current_password').type('1234')
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'パスワードは8文字以上24文字以下で入力してください。')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')
    // Check ipnput valid password between 8 and 24 characters
    cy.get('#reset_password_current_password').clear().type('abc123456')
    cy.get('.ant-form-item-explain-error > div').should('not.exist')
    // Check input password longer than 24 characters
    cy.get('#reset_password_current_password').clear().type('12345678920123132131232132133123')
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'パスワードは8文字以上24文字以下で入力してください。')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')

    // Check enter password then delete
    cy.get('#reset_password_current_password').clear().type('abc').clear()
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'この項目は必須です。')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')
  })

  it('new password input', () => {
    cy.get('.ant-btn-round').click()
    cy.get('#reset_password_password').should('have.attr', 'placeholder', '新しいパスワードを入力してください。')
    // Check when page has just loaded
    // Check password is hidden
    cy.get('#reset_password_password')
      .invoke('attr', 'type')
      .should('contain', 'password')
      // Check input invalid password
      // Check input password shorter than 8 characters
    cy.get('#reset_password_password').type('1234')
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'パスワードは8文字以上24文字以下で入力してください。')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')

    // Check ipnput valid password between 8 and 24 characters
    cy.get('#reset_password_password').clear().type('abc123456')
    cy.get('.ant-form-item-explain-error > div').should('not.exist')
    // Check input password longer than 24 characters
    cy.get('#reset_password_password').clear().type('12345678920123132131232132133123')
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'パスワードは8文字以上24文字以下で入力してください。')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')

    // Check enter password then delete
    cy.get('#reset_password_password').clear().type('abc').clear()
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'この項目は必須です。')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')
  })

  it('new password confirm input', () => {
    cy.get('.ant-btn-round').click()
    cy.get('#reset_password_confirm_password').should('have.attr', 'placeholder', 'パスワード確認用を入力してください。')
    // Check when page has just loaded
    // Check password is hidden
    cy.get('#reset_password_confirm_password')
      .invoke('attr', 'type')
      .should('contain', 'password')
      // Check input invalid password
      // Check input password shorter than 8 characters
    cy.get('#reset_password_confirm_password').clear().type('abc').clear()
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'この項目は必須です。')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')

    cy.get('#reset_password_password').clear().type('123456789')
    cy.get('#reset_password_confirm_password').clear().type('123456788')
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', '新しいパスワードとパスワード確認用が一致しません。')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')

    cy.get('#reset_password_confirm_password').clear().type('123456789')
    cy.get('.ant-form-item-explain-error > div').should('not.exist')
  })

  it('button save modal', () => {
    cy.get('.ant-btn-round').click()
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')
    cy.get('#reset_password_current_password').type('12345678')
    cy.get('#reset_password_password').type('123456789')
    cy.get('#reset_password_confirm_password').type('123456789')
    cy.get('.ant-modal .ant-btn-primary').should('be.enabled')

    cy.get('#reset_password_current_password').clear().type('12345678910')
    cy.get('.ant-modal .ant-btn-primary').click()
    cy.wait(500)
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', '現在のパスワードは間違っています')
    cy.get('.ant-modal .ant-btn-primary').should('be.disabled')

    cy.get('#reset_password_current_password').clear().type('12345678')
    cy.get('.ant-modal .ant-btn-primary').click()
    cy.get('.ant-modal').should('not.be.visible')
    cy.get('.ant-notification').should('be.visible').should('contain', 'パスワードを正常に変更しました。')

    cy.get('.ant-btn-round').click()
    cy.get('#reset_password_current_password').clear().type('123456789')
    cy.get('#reset_password_password').clear().type('12345678')
    cy.get('#reset_password_confirm_password').clear().type('12345678')
    cy.get('.ant-modal .ant-btn-primary').click()
    cy.wait(500)
  })

  it('button cancel modal', () => {
    cy.get('.ant-btn-round').click()
    cy.get('.ant-modal .ant-btn').first().should('be.enabled').click()
    cy.get('.ant-modal').should('not.be.visible')
  })
})
