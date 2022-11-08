import Color from 'color'
const validPassword = '12345678'; // TODO: change your password in db
const existValidEmail = 'letitia.kessler@example.net'; // TODO: change your email in db
describe('User Profile Test', () => {
  const expectTextColor = Color('#272343').string() 
    it('Visits Jobfair Support Profile', () => {
      cy.visit('http://jobfair.local:8000/login');
      cy.get('#login_email').type(existValidEmail);
      cy.get('#login_password').type(validPassword);
      cy.get('.ant-btn')
      .should('contain', 'ログイン')
      .should('not.be.disabled')
      .click();
      cy.wait(1000);
      cy.visit('http://jobfair.local:8000/profile')
    })

    it('Check title', () => {
      cy.get('.title').contains('プロフィール').should('have.css', 'color')
      .and('eq', expectTextColor)
    })
    it('Check content', () => {
        cy.get('.col-span-3').find('p').contains('ユーザー名: ')
        cy.get('.col-span-3').find('p').contains('チャットワークID: ')
        cy.get('.col-span-3').find('p').contains('メール: ')
        cy.get('.col-start-3').find('a').contains('プロフィール編集').should('have.attr', 'href','profile/edit')

    })

  })