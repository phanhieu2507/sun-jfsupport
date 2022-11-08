const invalidShorterPassword = '123';
const invalidLongerPassword = '012345678901234567890123456789';
const validPassword = '12345678'; // TODO: change your password in db

const invalidEmails = ['abc', 'abcdefg@', 'abc@example', 'abc@example.'];
const notExistValidEmail = 'abc@example.net';
const existValidEmail = 'harris.isadore@example.org'; // TODO: change your email in db

describe('check login', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(500);
  });

  it('displays title, img correct', () => {
    // Check title of login screen
    cy.get('.text-3xl').should('contain', 'Jobfair サポート');
    // Check logo
    cy.get('.h-screen').find('img').should('have.attr', 'src', './logo.png');
    // Check title of email input
    cy.get('.ant-form-item-required')
      .first()
      .should('contain', 'メールアドレス');
    // Check placeholder of email input
    cy.get('#login_email')
      .invoke('attr', 'placeholder')
      .should('contain', 'メールアドレスを入力してください。');
    // Check title of password input
    cy.get('.ant-form-item-required').last().should('contain', 'パスワード');
    // Check placeholder of password input
    cy.get('#login_password')
      .invoke('attr', 'placeholder')
      .should('contain', 'パスワードを入力してください。');
    // Check remember checkbox
    cy.get('.ant-checkbox-input');
    // Check link href reset password
    cy.get('#login').find('a').should('contain', 'パスワードをお忘れの方');
    // Check button login
    cy.get('.ant-btn').should('contain', 'ログイン');
  });

  it('has input email response correct', () => {
    // Check when page has just loaded
    // Check empty
    cy.get('#login_email').should('have.value', '');
    // Check placeholder
    cy.get('#login_email')
      .invoke('attr', 'placeholder')
      .should('contain', 'メールアドレスを入力してください。');
    // Check input invalid email
    invalidEmails.forEach((invalidEmail) => {
      cy.get('#login_email').clear().type(invalidEmail);
      cy.get('.ant-form-item-explain-error > div')
        .should('be.visible')
        .should('contain', 'メールアドレスを正しく入力してください。');
    });
    // Check input valid email
    cy.get('#login_email').clear().type(existValidEmail);
    cy.get('.ant-form-item-explain-error > div').should('not.exist');
    // Check enter email then delete
    cy.get('#login_email').clear().type(existValidEmail).clear();
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'メールアドレスを入力してください。');
  });

  it('has input password response correct', () => {
    // Check when page has just loaded
    // Check password is hidden
    cy.get('#login_password')
      .invoke('attr', 'type')
      .should('contain', 'password');
    // Check input invalid password
    // Check input password shorter than 8 characters
    cy.get('#login_password').type(invalidShorterPassword);
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'パスワードは8文字以上24文字以下で入力してください。');
    // Check ipnput valid password between 8 and 24 characters
    cy.get('#login_password').clear().type(validPassword);
    cy.get('.ant-form-item-explain-error > div').should('not.exist');
    // Check input password longer than 24 characters
    cy.get('#login_password').clear().type(invalidLongerPassword);
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'パスワードは8文字以上24文字以下で入力してください。');
    // Check enter password then delete
    cy.get('#login_password').clear().type(validPassword).clear();
    cy.get('.ant-form-item-explain-error > div')
      .should('be.visible')
      .should('contain', 'パスワードを入力してください。');
  });

  it('has remember checkbox', () => {
    cy.get('.ant-checkbox .ant-checkbox-input');
    // Check checkbox hasn't checked yet
    cy.get('.ant-checkbox-checked').should('not.exist');
    // No test remember because function hasn't finished yet
    cy.get('.ant-checkbox .ant-checkbox-input').click().click();
  });

  it('has forgot password modal', () => {
    // Check link forgot password
    cy.get('#login').find('a').click();
    // Check display modal
    cy.get('.ant-modal-wrap').should('not.have.attr', 'style');
    // Check header modal
    cy.get('.ant-modal-header').should('contain', 'パスワード変更');
    // When modal has just opened
    // Check button OK disabled
    cy.get('.ant-modal-footer .ant-btn-primary')
      .should('contain', 'OK')
      .should('be.disabled');
    cy.get('.ant-modal-footer .ant-btn-primary')
      .should('contain', 'OK')
      .should('be.disabled');
    // Check button Cancel
    cy.get('.ant-modal-footer .ant-btn')
      .first()
      .should('contain', 'キャンセル')
      .should('be.visible');
    // Check input invalid email
    invalidEmails.forEach((invalidEmail) => {
      cy.get('#reset-password_reset-email').clear().type(invalidEmail);
      cy.get('.ant-form-item-explain-error > div')
        .should('be.visible')
        .should('contain', 'メールアドレスを正しく入力してください。');
      cy.get('.ant-modal-footer .ant-btn-primary')
        .should('contain', 'OK')
        .should('be.disabled');
    });
    // Check input valid email
    // Check not exist valid email
    cy.get('#reset-password_reset-email').clear().type(notExistValidEmail);
    cy.get('.ant-form-item-explain-error > div').should('not.exist');
    cy.get('.ant-modal-footer .ant-btn-primary')
      .should('contain', 'OK')
      .should('not.be.disabled')
      // Check response when click OK
      .click();
    cy.get('.ant-modal-wrap').should('have.attr', 'style', 'display: none;');
    cy.get('.ant-notification-notice-error')
      .find('.ant-notification-notice-message')
      .should('contain', 'メールが存在しません');
    cy.wait(2500);
    cy.get('.ant-notification-notice-error')
      .find('.ant-notification-notice-message')
      .should('not.exist');
    // Check exist valid email
    cy.get('#login').find('a').click();
    cy.get('#reset-password_reset-email').clear().type(existValidEmail);
    cy.get('.ant-form-item-explain-error > div').should('not.exist');
    cy.get('.ant-modal-footer .ant-btn-primary')
      .should('contain', 'OK')
      .should('not.be.disabled')
      // Check response when click OK
      .click();
    cy.get('.ant-modal-wrap').should('have.attr', 'style', 'display: none;');
    cy.wait(1000);
    cy.get('.ant-notification-notice-success')
      .find('.ant-notification-notice-message')
      .should('contain', 'メールは正常に送信されました');
    cy.wait(2500);
    cy.get('.ant-notification-notice-success')
      .find('.ant-notification-notice-message')
      .should('not.exist');
    // Check when click cancle button and then modal will hide
    cy.get('#login').find('a').click();
    cy.get('.ant-modal-footer .ant-btn').first().click();
    cy.get('.ant-modal-wrap').should('have.attr', 'style', 'display: none;');
  });

  it('has login button response correct', () => {
    // Check when page has just loaded
    cy.get('.ant-btn').should('contain', 'ログイン').should('be.disabled');
    // Check when input invalid email and password
    // When one of them invalid
    cy.get('#login_email').clear().type(invalidEmails[0]);
    cy.get('.ant-btn').should('contain', 'ログイン').should('be.disabled');
    cy.get('#login_email').clear();
    cy.get('.ant-btn').should('contain', 'ログイン').should('be.disabled');
    cy.get('#login_password').type(invalidShorterPassword);
    cy.get('.ant-btn').should('contain', 'ログイン').should('be.disabled');
    cy.get('#login_password').clear();
    // When both of them invalid
    cy.get('#login_email').type(invalidEmails[0]);
    cy.get('#login_password').type(invalidShorterPassword);
    cy.get('.ant-btn').should('contain', 'ログイン').should('be.disabled');
    // Check when input both valid email and password
    cy.get('#login_email').clear().type(notExistValidEmail);
    cy.get('#login_password').clear().type(validPassword);
    cy.get('.ant-btn')
      .should('contain', 'ログイン')
      .should('not.be.disabled')
      // Check when login with not exist valid email
      .click();
    cy.get('.ant-notification-notice-error')
      .find('.ant-notification-notice-message')
      .should('contain', 'メールアドレスもしくはパスワードが間違っています');
    // Check when login with exist valid email and password
    cy.get('#login_email').clear().type(existValidEmail);
    cy.get('.ant-btn')
      .should('contain', 'ログイン')
      .should('not.be.disabled')
      .click();
    cy.get('.ant-notification-notice-success')
      .find('.ant-notification-notice-message')
      .should('contain', '正常にログインしました');
    cy.wait(3500);
    cy.url().should('contain', 'top-page');
  });
});
