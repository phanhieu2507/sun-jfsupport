describe('Check reset password feature', () => {
  before(() => {
    cy.request('GET', '/login').then((response) => {
      let str = response.headers['set-cookie'][0];
      let token =
        str.replace('XSRF-TOKEN=', '').replace(/%3[Dd].*/g, '') + '==';
      cy.request({
        method: 'POST',
        url: '/api/reset-password',
        headers: {
          'X-XSRF-TOKEN': token,
        },
        body: {
          email: 'orosenbaum@example.net', // TODO: Change your email address
        },
      }).then((res) => {
        const resetToken = res.body.token;
        const resetLink = `/reset-password?token=${resetToken}`;
        cy.wrap(resetLink).as('resetLink');
      });
    });
  });

  it('Check form label', () => {
    cy.visit('/reset-password');
    cy.get('div > p').should('be.visible').as('formLabel');
    cy.get('@formLabel').should('contain', 'ログインパスワード変更');
  });

  it('Check inputs label', () => {
    cy.visit('/reset-password');
    cy.get('label[for="reset_password_password"]')
      .should('be.visible')
      .as('passwordLabel');
    cy.get('@passwordLabel').should('contain', '新しいパスワード');
    cy.get('label[for="reset_password_confirm_password"]')
      .should('be.visible')
      .as('confirmPasswordLabel');
    cy.get('@confirmPasswordLabel').should('contain', 'パスワード確認用');
  });

  it('Check inputs placeholder ', () => {
    cy.visit('/reset-password');
    cy.get('#reset_password_password').should(
      'have.attr',
      'placeholder',
      '新しいパスワードを入力してください。',
    );
    cy.get('#reset_password_confirm_password').should(
      'have.attr',
      'placeholder',
      'パスワード確認用を入力してください。',
    );
  });

  it('Check password empty error message', function () {
    cy.visit(this.resetLink);
    cy.get('#reset_password_password').type('123').as('password');
    cy.get('@password').clear();
    cy.get('.ant-form-item-explain-error').then((message) =>
      cy.wrap(message).should('contain', '新しいパスワードを入力してください'),
    );
  });

  it('Check confirm password empty error message', function () {
    cy.visit('/reset-password');
    cy.get('#reset_password_confirm_password')
      .type('123')
      .as('confirmPassword');
    cy.get('@confirmPassword').clear();
    cy.get('.ant-form-item-explain-error').then((message) =>
      cy.wrap(message).should('contain', 'パスワード確認用を入力してください'),
    );
  });

  it('Check short password error message', () => {
    cy.visit('/reset-password');
    cy.get('#reset_password_password').type('1234567');
    cy.get('.ant-form-item-explain-error').then((message) =>
      cy
        .wrap(message)
        .should('contain', 'パスワードは8文字以上24文字以下で入力してください'),
    );
  });

  it('When enter valid password', () => {
    cy.visit('/reset-password');
    cy.get('#reset_password_password').type('12345678');
    cy.get('.ant-form-item-explain-error').should('not.exist');
  });

  it('Check long password error message', () => {
    cy.visit('/reset-password');
    cy.get('#reset_password_password').type('h6BYrjZQQSd1Yd2mIISEVRxwJl');
    cy.get('.ant-form-item-explain-error').then((message) =>
      cy
        .wrap(message)
        .should('contain', 'パスワードは8文字以上24文字以下で入力してください'),
    );
  });

  it('Check confirm password not match error message', () => {
    cy.visit('/reset-password');
    cy.get('#reset_password_password').type('password').as('password');
    cy.get('#reset_password_confirm_password').type('abcd');
    cy.get('.ant-form-item-explain-error').then((message) =>
      cy
        .wrap(message)
        .should('contain', '新しいパスワードとパスワード確認用が一致しません'),
    );
  });

  it('Button reset password disable until enter valid input', () => {
    cy.visit('/reset-password');
    cy.get('button').should('have.attr', 'disabled');
    cy.get('#reset_password').within(() => {
      cy.get('#reset_password_password').type('password');
      cy.get('button').should('have.attr', 'disabled');
      cy.get('#reset_password_confirm_password').type('password');
      cy.get('button').should('be.visible');
    });
  });

  it('Check invalid password and password not match error messages', () => {
    cy.visit('/reset-password');
    cy.get('#reset_password').within(() => {
      cy.get('#reset_password_password').type('abc');
      cy.get('.ant-form-item-explain-error')
        .eq(0)
        .should('contain', 'パスワードは8文字以上24文字以下で入力してください');
      cy.get('#reset_password_confirm_password').type('password');
      cy.get('.ant-form-item-explain-error')
        .eq(1)
        .should('contain', '新しいパスワードとパスワード確認用が一致しません');
      cy.get('button').should('be.visible');
    });
  });

  it('When show password and confirm password icon click', () => {
    cy.visit('/reset-password');
    cy.get('#reset_password_password').as('password');
    cy.get('#reset_password_confirm_password').as('confirmPassword');
    cy.get('.ant-input-suffix span').should('not.be.empty').as('shows');
    cy.get('@shows').eq(0).as('showPassword');
    cy.get('@shows').eq(1).as('showConfirmPassword');

    cy.get('@password').type('abcd');
    cy.get('@showPassword')
      .click()
      .then(($icon) => {
        expect($icon).to.have.attr('aria-label', 'eye-invisible');
        cy.get('@password').should('have.attr', 'type', 'text');
      });

    cy.get('@confirmPassword').type('abcd');
    cy.get('@showConfirmPassword')
      .click()
      .then(($icon) => {
        expect($icon).to.have.attr('aria-label', 'eye-invisible');
        cy.get('@confirmPassword').should('have.attr', 'type', 'text');
      });
  });

  it('Password has been successfully changed', function () {
    cy.visit(this.resetLink);
    cy.get('#reset_password').within(() => {
      cy.get('#reset_password_password').type('password');
      cy.get('#reset_password_confirm_password').type('password');
      cy.get('button').should('be.visible').click();
      cy.get('.ant-notification').should('not.empty');
      cy.wait(3500);
      cy.url().should('contain', 'login');
    });
  });
});
