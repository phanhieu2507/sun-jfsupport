describe('Check invite member', () => {
  const randomString = () => `randomstring${Math.random().toString(10).substring(2, 7)}`

  const randomEmail = () => `${randomString()}@gmail.com`

  beforeEach(() => {
    cy.visit('/invite-member')
  })
  
  it('Check screen name', () => {
    cy.get('.screen-name').should('be.visible').should('contain', 'メンバ招待')
  })

  it('Check input labels name', () => {
    cy.get('label[for="email"]').should('contain', 'メールアドレス')
    cy.get('label[for="categories"]').should('contain', '役割')
  })

  it('Check buttons status on load page', () => {
    cy.get('#btn-cancel').should('be.visible').find('span').should('contain', 'キャンセル')
    cy.get('#btn-submit').should('be.disabled')
    cy.get('#btn-submit span').should('contain', '招 待')
  })

  it('Check category selector', () => {
    cy.get('.ant-select-selection-placeholder').should('contain', 'カテゴリを選んでください')
    cy.get('#categories')
      .click()
      .then((selector) => {
        cy.wrap(selector).should('have.attr', 'aria-expanded').and('eq', 'true')
        cy.get('.ant-select-item-option-content').as('categories').should('have.length', 2)
        cy.get('@categories').eq(1).should('contain', 'メンバ')
        cy.get('@categories')
          .eq(0)
          .should('be.visible')
          .should('contain', '管理者')
          .click()
          .then(() => {
            cy.get('#categories').should('have.attr', 'aria-expanded').and('eq', 'false')
          })
      })
  })

  it('Check email invalid error message', () => {
    cy.get('#email').then((input) => cy.wrap(input).type(randomString()))
    cy.get('div[role="alert"]')
      .should('be.visible')
      .should('contain', 'メールアドレス有効なメールではありません!')
  })

  it('Check email input empty error message', () => {
    cy.get('#email').then((input) => cy.wrap(input).type(randomString()))
    cy.get('#email').clear()
    cy.get('div[role="alert"]')
      .should('be.visible')
      .should('contain', 'メールアドレスを入力してください。')
  })

  it('Check error message when enter email already exist in system', () => {
    cy.get('#btn-submit').should('be.disabled')
    cy.get('#email').type('existemail@gmail.com') // TODO: change email already exist in DB
    cy.get('#categories')
      .click()
      .then(() => {
        cy.get('.ant-select-item-option-content').eq(0).click()
        cy.get('#btn-submit').should('not.be.disabled').click()
        cy.get('#errorEmail').should('be.visible').should('contain', 'このメールは既に存在しました')
      })
  })

  it('Reset form after send email', () => {
    cy.get('#btn-submit').should('be.disabled')
    cy.get('#email').then((input) => cy.wrap(input).type(randomEmail()))
    cy.get('#categories')
      .click()
      .then(() => {
        cy.get('.ant-select-item-option-content').eq(0).click()
        cy.get('#btn-submit').should('not.be.disabled').click()
        cy.get('.ant-notification-notice-message')
          .should('be.visible')
          .should('contain', 'ご登録のメールアドレスに招待メールを送信しました。')
        cy.get('#email').should('have.value', '')
        cy.get('#categories').should('have.value', '')
        cy.get('#btn-submit').should('be.disabled')
      })
  })
})
