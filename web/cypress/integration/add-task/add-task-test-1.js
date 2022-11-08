const pageIndex=1
const headLine="夕スク登録"
const searchTemplateTaskNamePlaceholder="テンプレートタスク名"
const categorySelectBoxPlaceholder="カテゴリ"
const milestoneSelectBoxPlaceholder="マイルストーン"
const cancelButtonText="キャンセル"
const saveButtonText="登 録"
describe('Add Task Test', () => {
  var jobfairList;
  var taskList;
  var milestoneList;
  var index;
  beforeEach(() => {
    cy.request('GET', 'http://jobfair.local:8000/api/jobfair').then((response) => {
      jobfairList = response.body;
    })
    cy.request('GET', 'http://jobfair.local:8000/api/categories-template-tasks').then((response) => {
      taskList = response.body;
    })
    cy.request('GET', 'http://jobfair.local:8000/api/milestone').then((response) => {
      milestoneList = response.body;
    })
  })
  it('0 Can visit Add Task', () => {
    const link='http://jobfair.local:8000/add-task/'+pageIndex
    cy.visit(link)
    cy.wait(500)
  })
  it('1 Display Item On Screen', () => {
    //check head line
    cy.get('h1').eq(0).invoke('text').should('include',headLine)
    //check jobfair name
    cy.get('h1').eq(0).find('span[class^="ant-tag"]').invoke('text').should('include',jobfairList[pageIndex-1].name)
    //check tempalte task search box
    cy.get('form[class^="ant-form"]').eq(0).find('div[class^="search-input"]').find('input').invoke('attr', 'placeholder').should('contain', searchTemplateTaskNamePlaceholder)
    //check Category and Milestone
    for(let i=0;i<2;i++){
      let placeHolderText;
      if(i==0) placeHolderText=categorySelectBoxPlaceholder;
      else placeHolderText=milestoneSelectBoxPlaceholder;
      cy.get('form[class^="ant-form"]').eq(0).find('div[class^="filter"]').find('span[class^="ant-select-selection-placeholder"]').eq(i).invoke('text').should('include',placeHolderText)
    }
    //check button Cancel and Save
    cy.get('div[class^="data-controller"]').find('button[class^="ant-btn"]').eq(0).invoke('attr', 'type').should('contain', 'button')//check role of cancel button
    cy.get('div[class^="data-controller"]').find('button[class^="ant-btn"]').eq(0).invoke('text').should('contain', cancelButtonText)//check text of cancel button
    cy.get('div[class^="data-controller"]').find('button[class^="ant-btn"]').eq(1).invoke('attr', 'type').should('contain', 'submit')//check role of save button
    cy.get('div[class^="data-controller"]').find('button[class^="ant-btn"]').eq(1).invoke('text').should('contain', saveButtonText)//check text of save button
  })
  it('2 Category Select Box', () => {
    //check click select box
    cy.get('form[class^="ant-form"]').eq(0).find('div[class^="ant-row"]').eq(0).find('div[class^="ant-select-selector"]').click()
    //check display option
    for(let i=0;i<taskList.length;i++){
      cy.get('div[class^="ant-select-dropdown"]').find('div[class="rc-virtual-list"]').eq(0).invoke('text').should('contain', taskList[i].category_name)
    }
    //check select category
    cy.get('div[class^="ant-select-dropdown"]').find('div[class="rc-virtual-list"]').eq(0).find('div[class="ant-select-item ant-select-item-option"]').eq(0).click()
    //check display category after select
    cy.get('form[class^="ant-form"]').eq(0).find('div[class^="ant-row"]').eq(0).find('div[class^="ant-select-selector"]').find('span[class^="ant-select-selection-item"]').invoke('text').should('contain', taskList[1].category_name)
  })
   it('3 Milestone Select Box', () => {
    //check click select box
    cy.get('form[class^="ant-form"]').eq(0).find('div[class^="ant-row"]').eq(1).find('div[class^="ant-select-selector"]').click()
    //check display option
    for(let i=0;i<milestoneList.length;i++){
      cy.get('div[class^="ant-select-dropdown"]').find('div[class="rc-virtual-list"]').eq(1).invoke('text').should('contain', milestoneList[i].name)
    }
    //check select milestone
    cy.get('div[class^="ant-select-dropdown"]').find('div[class="rc-virtual-list"]').eq(1).find('div[class="ant-select-item ant-select-item-option"]').eq(0).click()
    //check display milestone after select
    cy.get('form[class^="ant-form"]').eq(0).find('div[class^="ant-row"]').eq(1).find('div[class^="ant-select-selector"]').find('span[class^="ant-select-selection-item"]').invoke('text').should('contain', milestoneList[1].name)
  })
}) 
