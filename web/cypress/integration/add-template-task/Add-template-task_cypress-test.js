const inputTextEng = 'Template Task'
const inputTextJap = 'タスクテンプレート'
const inputTextVie = 'Tiếng Việt'
const inputTextSpeci = '@$%^%#@$&'
const alert1 = '使用できない文字が含まれています'
const alert2 = 'このタスクテンプレート名は既に使用されています'
const alert3 = 'この項目は必須です'
const alert4 = '0以上の数字で入力してください'
const confirmMessage = '入力内容が保存されません。よろしいですか？'
const templateTaskIndexC1 = 0
const templateTaskIndexC2 = 1

const choosenCate = 0
const choosenMile = 0 + 5
const totalOption12 = 11
const biggerThan0 = '30'
const realNumber = '1.6'
const fullwidthNumber = '１２３４５'
const valueOfFullwidthNumber = '12345'
const negativeNumber = '-1'

describe('Add Template Task Test', () => {
  let templateTaskList
  let taskList
  let milestoneList
  beforeEach(() => {
    cy.request('GET', 'http://jobfair.local:8000/api/template-tasks').then((response) => {
      templateTaskList = response.body
    })
    cy.request('GET', 'http://jobfair.local:8000/api/categories-template-tasks').then((response) => {
      taskList = response.body
    })
    cy.request('GET', 'http://jobfair.local:8000/api/milestone').then((response) => {
      milestoneList = response.body
    })
  })
  it('0 Can visit Add Template Task', () => {
    const link = 'http://jobfair.local:8000/add-template-task/'
    cy.visit(link)
    cy.wait(500)
  })
  it('1 General Display HeadLine', () => {
    cy.get('h1').eq(0).invoke('text').should('include', 'テンプレートタスク追加')
  })
  it('2 General Display Item', () => {
    cy.get('div[class^="ant-row"]').then(($div) => {
      if ($div.length == 7) {
        expect(true).to.equal(true)
      } else {
        expect(true).to.equal(false)
      }
    })
    cy.get('div[class^="ant-row"]').eq(0).find('label[class*="required"]').invoke('text')
      .should('be.eq', 'テンプレートタスク名')
    cy.get('div[class^="ant-row"]').eq(1).find('label[class*="required"]').invoke('text')
      .should('be.eq', 'カテゴリ')
    cy.get('div[class^="ant-row"]').eq(2).find('label[class*="required"]').invoke('text')
      .should('be.eq', 'マイルストーン')

    cy.get('div[class^="ant-row"]').eq(3).find('label').invoke('text')
      .should('be.eq', 'リレーション')
    cy.get('div[class^="ant-row"]').eq(3).find('p').eq(0)
      .invoke('text')
      .should('include', '前のタスク')
    cy.get('div[class^="ant-row"]').eq(3).find('p').eq(1)
      .invoke('text')
      .should('include', '次のタスク')

    cy.get('div[class^="ant-row"]').eq(4).find('label[class*="required"]').invoke('text')
      .should('be.eq', '工数')
    cy.get('div[class^="ant-row"]').eq(5).find('label').invoke('text')
      .should('be.eq', '詳細')
  })
  it('3.1 Cancel Button Empty', () => {
    cy.get('button').eq(0).click()
    const templateTaskListPageLink = 'http://jobfair.local:8000/template-tasks'
    cy.url().should('eq', templateTaskListPageLink)
    const link = 'http://jobfair.local:8000/add-template-task/'
    cy.visit(link)
    cy.wait(500)
  })
  it('3.2 Cancel Button Already Input, Press "いいえ"', () => {
    cy.get('div[class^="ant-row"]').eq(0).find('input').type(inputTextEng)
    cy.get('button').eq(0).click()
    cy.get('div[class^="ant-modal ant-modal-confirm"]').find('span[class^="ant-modal-confirm-title"]').invoke('text').should('contain', confirmMessage)
    cy.get('div[class^="ant-modal ant-modal-confirm"]').find('div[class^="ant-modal-confirm-btns"]').then((buttonContainer) => {
      if (buttonContainer.find('button').length == 2) {
        expect(true).to.equal(true)
      } else {
        expect(true).to.equal(false)
      }
    })
  })
  it('3.3 Cancel Button Modal, Press "いいえ"', () => {
    cy.get('div[class^="ant-modal ant-modal-confirm"]').find('div[class^="ant-modal-confirm-btns"]').find('button').eq(0)
      .click()
    cy.url().should('contain', 'http://jobfair.local:8000/add-template-task')
  })
  it('3.4 Cancel Button Modal, Press "はい"', () => {
    cy.get('button').eq(0).click()
    cy.get('div[class^="ant-modal ant-modal-confirm"]').find('div[class^="ant-modal-confirm-btns"]').find('button').eq(1)
      .click()
    const templateTaskListPageLink = 'http://jobfair.local:8000/template-tasks'
    cy.url().should('eq', templateTaskListPageLink)
    const link = 'http://jobfair.local:8000/add-template-task/'
    cy.visit(link)
    cy.wait(500)
  })
  it('4 Press Link To A Task In Relation', () => {
    cy.get('div[class^="ant-row"]').eq(3).find('span[class^="ant-select-selection-placeholder"]').eq(0)
      .click({ force: true })
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(0).find('div[class^="ant-select-item ant-select-item-option"]').eq(0)
      .click()
    cy.get('h1').eq(0).click()
    cy.get('div[class^="ant-row"]').eq(3).find('div[class^="ant-select"]').find('span[class^="ant-tag"]')
      .click()
    cy.wait(1000)
    cy.url().should('contain', 'http://jobfair.local:8000/template-task-dt/')
    const link = 'http://jobfair.local:8000/add-template-task/'
    cy.visit(link)
    cy.wait(500)
  })
  it('5 Input Template Name', () => {
    cy.get('div[class^="ant-row"]').eq(0).find('input').type(inputTextEng)
    cy.get('div[class^="ant-row"]').eq(0).find('div').invoke('text')
      .should('not.contain', alert1)
    cy.get('div[class^="ant-row"]').eq(0).find('input').clear()

    cy.get('div[class^="ant-row"]').eq(0).find('input').type(inputTextJap)
    cy.get('div[class^="ant-row"]').eq(0).find('div').invoke('text')
      .should('not.contain', alert1)
    cy.get('div[class^="ant-row"]').eq(0).find('input').clear()

    cy.get('div[class^="ant-row"]').eq(0).find('input').type(inputTextVie)
    cy.get('div[class^="ant-row"]').eq(0).find('div').invoke('text')
      .should('not.contain', alert1)
    cy.get('div[class^="ant-row"]').eq(0).find('input').clear()

    // var index = Math.floor((Math.random() * 15) % 10)
    // cy.get('div[class^="ant-row"]').eq(0).find('input').type(templateTaskList[index].name)
    // cy.get('div[class^="ant-row"]').eq(0).find('div').invoke('text').should('contain', alert2)
    // cy.get('div[class^="ant-row"]').eq(0).find('input').clear()

    cy.get('div[class^="ant-row"]').eq(0).find('input').type(inputTextSpeci)
    cy.get('div[class^="ant-row"]').eq(0).find('div').invoke('text')
      .should('contain', alert1)
    cy.get('div[class^="ant-row"]').eq(0).find('input').clear()

    cy.get('div[class^="ant-row"]').eq(0).find('div').invoke('text')
      .should('contain', alert3)
    cy.get('div[class^="ant-row"]').eq(0).find('input').type(inputTextJap)
  })
  it('6 Category Check', () => {
    cy.get('div[class^="ant-row"]').eq(1).find('span[class^="ant-select-selection-placeholder"]').click({ force: true })
    for (let i = 0; i < 4; i++) {
      cy.get('div[class^="ant-select-dropdown"]').eq(0).invoke('text').should('contain', taskList[i].category_name)
    }
    cy.get('div[class^="ant-select-dropdown"]').eq(0).get('div[class^="ant-select-item"]').eq(choosenCate)
      .click({ force: true })
    cy.get('div[class^="ant-row"]').eq(1).find('span[class^="ant-select-selection-item"]').invoke('text')
      .should('contain', taskList[choosenCate].category_name)
  })
  it('7 Milestone Check', () => {
    cy.get('div[class^="ant-row"]').eq(2).find('span[class^="ant-select-selection-placeholder"]').click({ force: true })
    for (let i = 0; i < 7; i++) {
      cy.get('div[class^="ant-select-dropdown"]').eq(1).invoke('text').should('contain', milestoneList[i].name)
    }
    cy.get('.ant-select-item-option-content').eq(choosenMile).click()
    // cy.get('div[class^="ant-row"]').eq(2).find('span[class^="ant-select-selection-item"]').invoke('text').should('contain',  milestoneList[choosenMile].name)
  })
  it('8 Task Before', () => {
    cy.get('div[class^="ant-row"]').eq(3).find('span[class^="ant-select-selection-placeholder"]').eq(0)
      .click({ force: true })
    for (let i = 0; i < 10; i++) {
      cy.get('div[class^="ant-select-dropdown"]').eq(2).invoke('text').should('contain', templateTaskList[i].name)
    }
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(2).find('div[class^="ant-select-item ant-select-item-option"]').eq(1)
      .click()
    cy.get('h1').eq(0).click()
    cy.get('div[class^="ant-row"]').eq(3).find('span[class^="anticon anticon-close"]').eq(0)
      .click()
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(2).find('div[class^="ant-select-item ant-select-item-option"]').eq(templateTaskIndexC1)
      .click({ force: true })
    cy.get('div[class^="ant-row"]').eq(3).find('div[class^="ant-select"]').find('span[class^="ant-tag"]')
      .find('span[class^="inline-block"]')
      .invoke('attr', 'style')
      .should('contain', 'max-width: 20ch;')
    cy.get('div[class^="ant-row"]').eq(3).find('div[class^="ant-select"]').find('span[class^="ant-tag"]')
      .trigger('mouseover')
    cy.get('div[class^="ant-tooltip-inner"]').invoke('text').should('contain', templateTaskList[0].name)
    cy.get('div[class^="ant-row"]').eq(3).find('div[class^="ant-select"]').find('span[class^="ant-tag"]')
      .invoke('text')
      .should('contain', templateTaskList[templateTaskIndexC1].name)
  })
  it('9 Task After', () => {
    cy.get('div[class^="ant-row"]').eq(3).find('span[class^="ant-select-selection-placeholder"]').eq(0)
      .click({ force: true })
    for (let i = 0; i < 10; i++) {
      if (i == templateTaskIndexC1) {
      	cy.get('div[class^="ant-select-dropdown"]').eq(3).invoke('text').should('not.contain', templateTaskList[i].name)
      } else {
        cy.get('div[class^="ant-select-dropdown"]').eq(3).invoke('text').should('contain', templateTaskList[i].name)
      }
    }
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(3).find('div[class^="ant-select-item ant-select-item-option"]').eq(0)
      .click()
    cy.get('h1').eq(0).click()
    cy.get('div[class^="ant-row"]').eq(3).find('span[class^="anticon anticon-close"]').eq(0)
      .click()
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(2).find('div[class^="ant-select-item ant-select-item-option"]').eq(templateTaskIndexC1)
      .click({ force: true })
    cy.get('div[class^="ant-row"]').eq(3).find('div[class^="ant-select"]').find('span[class^="ant-tag"]')
      .eq(1)
      .find('span[class^="inline-block"]')
      .invoke('attr', 'style')
      .should('contain', 'max-width: 20ch;')
    cy.get('div[class^="ant-row"]').eq(3).find('div[class^="ant-select"]').find('span[class^="ant-tag"]')
      .eq(1)
      .trigger('mouseover')
    cy.get('div[class^="ant-tooltip-inner"]').invoke('text').should('contain', templateTaskList[1].name)
    cy.get('div[class^="ant-row"]').eq(3).find('div[class^="ant-select"]').find('span[class^="ant-tag"]')
      .invoke('text')
      .should('contain', templateTaskList[templateTaskIndexC1].name)
  })

  it('10 Input Effort Firstbox', () => {
    // bigger than 0
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .type(biggerThan0)
    cy.get('div[class^="ant-row"]').eq(4).then((findAlert) => {
      if (findAlert.find('div[role^="alert"]').length == 0) {
        expect(true).to.equal(true)
      } else {
        expect(true).to.equal(false)
      }
    })
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .clear()
    // real number
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .type(realNumber)
    cy.get('div[class^="ant-row"]').eq(4).then((findAlert) => {
      if (findAlert.find('div[role^="alert"]').length == 1) {
        expect(true).to.equal(true)
      } else {
        expect(true).to.equal(false)
      }
    })
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .clear()
    // fullwidth Number
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .type(fullwidthNumber)
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .should('have.value', valueOfFullwidthNumber)
    cy.get('div[class^="ant-row"]').eq(4).get('div[role^="alert"]').invoke('text')
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .clear()
    // negative number
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .type(negativeNumber)
    cy.get('div[class^="ant-row"]').eq(4).then((findAlert) => {
      if (findAlert.find('div[role^="alert"]').length == 1) {
        expect(true).to.equal(true)
        cy.get('div[class^="ant-row"]').eq(4).get('div[role^="alert"]').invoke('text')
          .should('be.eq', alert4)
      } else {
        expect(true).to.equal(false)
      }
    })
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .clear()
    cy.get('div[class^="ant-row"]').eq(4).get('div[role^="alert"]').invoke('text')
      .should('be.eq', alert3)
    cy.get('div[class^="ant-row"]').eq(4).find('input').eq(0)
      .type(biggerThan0)
  })
  it('11  Input Effort Secondbox', () => {
    cy.get('div[class^="ant-row"]').eq(4).find('span[class^="ant-select-selection-placeholder"]').eq(0)
      .click({ force: true })
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(4).find('div[class^="ant-select-item ant-select-item-option"]').invoke('text')
      .should('contain', '時間')
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(4).find('div[class^="ant-select-item ant-select-item-option"]').invoke('text')
      .should('contain', '日')
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(4).find('div[class^="ant-select-item ant-select-item-option"]').eq(0)
      .click()
    cy.get('div[class^="ant-row"]').eq(4).find('span[class^="ant-select-selection-item"]').invoke('text')
      .should('contain', '時間')
  })
  it('12  Input Effort Thirdbox', () => {
    cy.get('div[class^="ant-row"]').eq(4).find('span[class^="ant-select-selection-placeholder"]').eq(0)
      .click({ force: true })
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(5).find('div[class^="ant-select-item ant-select-item-option"]').should('contain', '学生数')
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(5).find('div[class^="ant-select-item ant-select-item-option"]').invoke('text')
      .should('contain', '企業数')
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(5).find('div[class^="ant-select-item ant-select-item-option"]').invoke('text')
      .should('contain', 'None')
    cy.get('div[class^="rc-virtual-list-holder-inner"]').eq(5).find('div[class^="ant-select-item ant-select-item-option"]').eq(0)
      .click()
    cy.get('div[class^="ant-row"]').eq(4).find('span[class^="ant-select-selection-item"]').invoke('text')
      .should('contain', '学生数')
  })
  it('13  Template Task Detail', () => {
    cy.get('div[class^="ant-row"]').eq(5).find('textarea').invoke('attr', 'rows')
      .should('eq', '7')
    cy.get('div[class^="ant-row"]').eq(5).find('textarea').type('something http://jobfair.local:8000/api http://jobfair.local:8000/api http://jobfair.local:8000/api 		http://jobfair.local:8000/api http://jobfair.local:8000/api http://jobfair.local:8000/api http://jobfair.local:8000/api')
    cy.get('div[class^="ant-row"]').eq(5).find('textarea').clear
  })
  it('14  Save Button', () => {
    cy.get('div[class^="ant-row"]').eq(0).find('input').clear()
    cy.get('button').eq(1).click()
    cy.get('div[class^="ant-row"]').then((findAlert) => {
      if (findAlert.find('div[role^="alert"]').length == 1) {
        expect(true).to.equal(true)
      } else {
        expect(true).to.equal(false)
      }
    })
    const legalName = `A legal name ${templateTaskList.length}`
    cy.get('div[class^="ant-row"]').eq(0).find('input').type(legalName)
    cy.get('button').eq(1).click()
    cy.get('.ant-notification', { timeout: 200000 }).should('contain', '正常に登録されました。')
  })
  it('15  Test redircet to Tempalate Task detail', () => {
    const newLinkOfDetailPage = `http://jobfair.local:8000/template-task-dt/${templateTaskList.length}`
    cy.url().should('eq', newLinkOfDetailPage)
  })
  it('16  Test Data Added via Api', () => {
    cy.request('GET', 'http://jobfair.local:8000/api/template-tasks').then((response) => {
      templateTaskList = response.body
    })
    const legalName = `A legal name ${templateTaskList.length - 1}`
    if (templateTaskList[0].name == legalName) {
      expect(true).to.equal(true)
    } else {
      expect(true).to.equal(false)
    }
    if (templateTaskList[0].milestone_id == 2) {
      expect(true).to.equal(true)
    } else {
      expect(true).to.equal(false)
    }
    if (templateTaskList[0].categories[0].id == 1) {
      expect(true).to.equal(true)
    } else {
      expect(true).to.equal(false)
    }
  })
  it('17  Test Data In Template Task List', () => {
    const templateTaskListPageLink = 'http://jobfair.local:8000/template-tasks'
    cy.visit(templateTaskListPageLink)
    cy.wait(500)
    const legalName = `A legal name ${templateTaskList.length - 1}`
    cy.get('tbody[class^="ant-table-tbody"]').find('tr').eq(1).find('td[class^="ant-table-cell"]')
      .eq(1)
      .invoke('text')
      .should('be.eq', legalName)
  })
})
