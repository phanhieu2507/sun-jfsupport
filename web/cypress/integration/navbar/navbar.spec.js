describe('check navbar', () => {
  beforeEach(() => {
    cy.visit('/file/01');
    cy.wait(500);
  });

  it('has logo', () => {
    // Check logo
    cy.get('.navbar')
      .find('img')
      .should('have.attr', 'alt', 'logo')
      .should('have.attr', 'src', '/images/logo.png')
      .should('be.visible');
    // Check click logo
      cy.get('.navbar').find('img').parent().click();
      cy.wait(3000);
      cy.url().should('contain', 'top');
  });

  it('has link of JF', () => {
    // Check text
    cy.get('.justify-between > :nth-child(1) > .flex > :nth-child(1) > a')
      .should('contain', 'JF')
      // Check link
      .click();
    cy.wait(3000);
    cy.url().should('contain', 'jobfairs');
  });

  it('has link of member list', () => {
    // Check text
    cy.get('.flex > :nth-child(2) > a')
      .should('contain', 'メンバ')
      // Check lin
      .click();
    cy.wait(3000);
    cy.url().should('contain', 'members');
  });

  it('has others link', () => {
    // Check text
    cy.get(':nth-child(3) > .ant-dropdown-trigger').should('contain', 'その他')
    // Check others link
    .click();
    cy.get('.ant-dropdown-menu').children().should('have.length', 3);
    cy.get('.ant-dropdown-menu')
      .children()
      .first()
      .should('contain', 'テンプレートタスク')
      .next()
      .should('contain', 'スケジュール')
      .next()
      .should('contain', 'マスター設定');
  });

  it('has link of template task', () => {
    cy.get(':nth-child(3) > .ant-dropdown-trigger').click();
    cy.get('.ant-dropdown-menu')
      .children()
      .first()
      // Check text
      .should('contain', 'テンプレートタスク')
      // Check link
      .click();
      cy.wait(3000);
      cy.url().should('contain', 'template-tasks');
  });

  it('has link of jf schedule', () => {
    cy.get(':nth-child(3) > .ant-dropdown-trigger').click();
    cy.get('.ant-dropdown-menu')
      .children()
      .first()
      .next()
      // Check text
      .should('contain', 'スケジュール')
      // Check link
      .click();
    cy.wait(3000);
    cy.url().should('contain', 'jf-schedules');
  });

  it('has link of milestone list', () => {
    cy.get(':nth-child(3) > .ant-dropdown-trigger').click();
    cy.get('.ant-dropdown-menu')
      .children()
      .first()
      .next()
      .next()
      // Check text
      .should('contain', 'マスター設定')
      // Check link
      .click();
    cy.wait(3000);
    cy.url().should('contain', 'milestones');
  });

  it('has notification', () => {
    // Check notification icon
    cy.get(':nth-child(1) > .ant-dropdown-trigger > .anticon > svg').should('be.visible',); // Chua check color
    // Check notification badge
    cy.get('.ant-dropdown-trigger > .text-lg').should('be.visible'); // Chua check so luong 99+
    // Check when click notification icon
    cy.get(':nth-child(1) > .ant-dropdown-trigger').click();
    cy.get('.ant-dropdown-menu').should('be.visible');
  });


  it('has user status', () => {
    // Check user icon
    cy.get(':nth-child(2) > .ant-dropdown-trigger > .anticon > svg')
      .should('be.visible') // Chua check color
      // Check when click user icon
      .click();
    cy.get('.ant-dropdown-menu').should('be.visible');
    cy.get('.ant-dropdown-menu').children().should('have.length', 2);
  });

  it('has link display profile', () => {
    // Check user icon
    cy.get(':nth-child(2) > .ant-dropdown-trigger > .anticon > svg').click();
    cy.get('.ant-dropdown-menu')
      .children()
      .first()
      // Check text
      .should('contain', 'プロフィール表示')
      // Check link
      .click();
    cy.wait(3000);
    cy.url().should('contain', 'profile');
  });

  it('has link logout', () => {
    // Check user icon
    cy.get(':nth-child(2) > .ant-dropdown-trigger > .anticon > svg').click();
    cy.get('.ant-dropdown-menu')
      .children()
      .first()
      .next()
      // Check text
      .should('contain', 'ログアウト')
      // Check link
      .click();
    cy.wait(3000);
    cy.url().should('contain', 'login');
  });
});
