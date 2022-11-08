import "@4tw/cypress-drag-drop";
const validPassword = '12345678'; // TODO: change your password in db
const existValidEmail = 'AnAdmin@sun-asterisk.com'; // TODO: change your email in db

describe('Check kanban', function () {
  const id = 1// TODO: change in db
  var total = 0
  var jobfair = []
  // Get information
  before(() => {
  cy.request('GET', `/api/kanban/${id}`).then((res) => {
    cy.wrap(res.body).as('data')
    cy.get('@data').then((data) => {
      total = data.length
      jobfair = data
    })
  })
  cy.visit('http://jobfair.local:8000/login');
  cy.get('#login_email').type(existValidEmail);
  cy.get('#login_password').type(validPassword);
  cy.get('.ant-btn')
      .should('contain', 'ログイン')
      .should('not.be.disabled')
      .click();

  cy.wait(3000);
  cy.visit(`http://jobfair.local:8000/kanban/${id}`);
  cy.wait(3000);

})
    
  

    
    it('Check title'),
      () => {
        cy.get('h1').contains(jobfair[0].jobfairName).should('be','visible');
        cy.get('h1').contains('カンバン').should('be.visible');
      };
  
    it('Check all columns', function () {
      cy.get('.container__column').should('have.length', 5);
    });
  
  
    it('Check column name', function () {
      const columnItems = ['未着手', '進行中', '完了', '中断', '未完了'];
      cy.get('.container__column').each((item, index, list) => {
        expect(Cypress.$(item).text()).contains(columnItems[index]);
      });
    });

    it('Check column length', function () {
      cy.get('[data-rbd-droppable-id="未着手"]').find('div.container__column--task').its('length').then((len)=>{

        cy.get('.container__column').find('h3').contains(len);
      });
      cy.get('[data-rbd-droppable-id="進行中"]').find('div.container__column--task').its('length').then((len)=>{

        cy.get('.container__column').find('h3').contains(len);
      });
      cy.get('[data-rbd-droppable-id="完了"]').find('div.container__column--task').its('length').then((len)=>{

        cy.get('.container__column').find('h3').contains(len);
      });
      cy.get('[data-rbd-droppable-id="中断"]').find('div.container__column--task').its('length').then((len)=>{

        cy.get('.container__column').find('h3').contains(len);
      });
      cy.get('[data-rbd-droppable-id="未完了"]').find('div.container__column--task').its('length').then((len)=>{

        cy.get('.container__column').find('h3').contains(len);
      });
      
    
    });
  
    it('card info', function () {
      cy.get('.ant-card').should('be.visible');
      cy.get('.ant-card').each(() => {
        cy.get('.text-lg').should('be.visible');
        cy.get('.ant-avatar').should('be.visible');
        cy.get('.anticon-calendar').should('be.visible');
        cy.get('.anticon-link').should('be.visible');
      });
      cy.get('[data-rbd-droppable-id="中断"]').find('div.container__column--task').its('length').then((len)=>{
        if(len !== 0){
          cy.get('button.memo--中断').find('span').contains('問 題').should('be.visible');
          
        }
        
      });
    });
    it('Check card color', function () {
      cy.get('.ant-card__bordered--未着手').should(
        'have.css',
        'border-left',
        '4px solid rgb(94, 181, 166)'
      );
      cy.get('.ant-card__bordered--進行中').should(
        'have.css',
        'border-left',
        '4px solid rgb(161, 175, 47)'
      );
      cy.get('.ant-card__bordered--完了').should(
        'have.css',
        'border-left',
        '4px solid rgb(68, 136, 197)'
      );
      cy.get('.ant-card__bordered--中断').should(
        'have.css',
        'border-left',
        '4px solid rgb(185, 86, 86)'
      );
      cy.get('.ant-card__bordered--未完了').should(
        'have.css',
        'border-left',
        '4px solid rgb(121, 86, 23)'
      );
    });
 
    it('Check task detail', function () {
      cy.get('.ant-card-body a').eq(0).click({ multiple: true });
      cy.url().should('include', '/task-detail');
      cy.go('back')
    });

    it('pendding to in progress', function(){
        
        // var MyDataTransfer = function () {};
        // var dt = new MyDataTransfer ();
	      // dt.types = [];
        const dataTransfer = new DataTransfer();
        cy.get('[data-rbd-droppable-id="中断"]').find('.container__column--task:nth-child(1)').trigger('dragstart', {dataTransfer});
        cy.get('[data-rbd-droppable-id="進行中"]').find('.container__column--task:nth-child(1)').trigger('drop', {dataTransfer});
        cy.get('[data-rbd-droppable-id="中断"]').find('.container__column--task:nth-child(1)').trigger('dragend');
        // cy.get('.進行中 > div.container__column--task:nth-child(1)').drag('.中断> div.container__column--task:nth-child(1)')
        
        // cy.get('[data-rbd-droppable-id="進行中"]')
        // .trigger('drop', { dataTransfer: dt });

        // cy.get('[data-rbd-droppable-id="進行中"]').trigger('dragend');
        // cy.get('[data-rbd-droppable-id="中断"]').find('div.container__column--task:nth-child(1)').trigger('dragend');  
        // cy.get('.進行中:nth-child(1) button').contains('問 題').should('not.be.visible');
        // cy.get('[data-rbd-droppable-id="中断"]').find('div.container__column--task:nth-child(1)')
        // .trigger("mousedown", {button:0})
        // .trigger("mousemove", {clientX:50, clientY: 20})
        // //cy.get('#container1') tried without the coordinates
        // .trigger("mouseup", {force:true})

        //Drag and Drop using custom command  
        // cy.draganddrop('.進行中:nth-child(1)', '.中断')

      }) ;
    
    
});
