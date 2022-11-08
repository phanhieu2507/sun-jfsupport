import Color from 'color'

const green = Color('#5EB5A6').toString()
const yellow = Color('#A1AF2F').toString()
const blue = Color('#4488C5').toString()
const red = Color('rgb(185, 86, 86)').toString()
const black = Color('rgb(121, 86, 23)').toString()

describe('Jobfair toppage test', () => {
  beforeEach(() => {
    cy.visit('http://jobfair.local:8000/jf-toppage/11')
    cy.wait(500)
  })

  it('Enter a task name in the search box', () => {
    // This input can be changed to fit the test
    const task = 'a'

    cy.get('.react-autosuggest__input').type(`${task}`, {
      force: true,
    })
    cy.get('.react-autosuggest__suggestions-list li')
      .find('div')
      .should('be.visible')
      .should('contain', `${task}`)
  })

  it('Enter a existent task name in the search box and press the search button', () => {
    // This input can be changed to fit the test
    const existentTask = 'Ahmad Muller'

    cy.get('.react-autosuggest__input').type(`${existentTask}`, {
      force: true,
    })
    cy.get('.search__task > .ant-btn').click()
    cy.url().should('include', 'task-list')
  })

  it('Enter a nonexistent task name in the search box and press the search button', () => {
    // This input can be changed to fit the test
    const nonexistentTask = 'Nonexistent Task'

    cy.get('.react-autosuggest__input').type(`${nonexistentTask}`, {
      force: true,
    })
    cy.get('.search__task > .ant-btn').click()
    cy.get('.ant-notification-notice-description')
      .should('be.visible')
      .should('contain', '該当結果が見つかりませんでした')
    cy.get('.ant-notification-notice-description', { timeout: 4000 }).should(
      'not.be.visible',
    )
  })

  it('Switch pages while entering keyword', () => {
    cy.get('.react-autosuggest__input').type('random keyword', {
      force: true,
    })
    cy.visit('http://jobfair.local:8000')
    cy.url().should('not.include', 'jf-toppage')
  })

  it('Check the task status area display and colors', () => {
    cy.get(':nth-child(2) > .status__global > .status')
      .should('be.visible')
      .should('contain', '未着手', '進行中', '完了', '中断', '未完了')

    cy.get('.name__stt > :nth-child(1) > span')
      .should('have.css', 'background')
      .and('contain', green)

    cy.get('.name__stt > :nth-child(2) > span')
      .should('have.css', 'background')
      .and('contain', yellow)

    cy.get('.name__stt > :nth-child(3) > span')
      .should('have.css', 'background')
      .and('contain', blue)

    cy.get('.name__stt > :nth-child(4) > span')
      .should('have.css', 'background')
      .and('contain', red)

    cy.get('.name__stt > :nth-child(5) > span')
      .should('have.css', 'background')
      .and('contain', black)
  })

  it('Check the chart of task status colors', () => {
    cy.get(':nth-child(1) > .chart__stt > .new')
      .should('have.css', 'background')
      .and('contain', green)

    cy.get(':nth-child(1) > .chart__stt > .in__propress')
      .should('have.css', 'background')
      .and('contain', yellow)

    cy.get(':nth-child(1) > .chart__stt > .done')
      .should('have.css', 'background')
      .and('contain', blue)

    cy.get(':nth-child(1) > .chart__stt > .pending')
      .should('have.css', 'background')
      .and('contain', red)

    cy.get(':nth-child(1) > .chart__stt > .break')
      .should('have.css', 'background')
      .and('contain', black)
  })

  it('Mouseover chart bar', () => {
    cy.get(':nth-child(1) > .chart__stt > .new').trigger('mouseover')
    cy.get('.ant-tooltip-inner')
      .should('be.visible')
      .should('contain', '未着手')

    cy.get(':nth-child(1) > .chart__stt > .in__propress').trigger('mouseover')
    cy.get('.ant-tooltip-inner')
      .should('be.visible')
      .should('contain', '進行中')

    cy.get(':nth-child(1) > .chart__stt > .done').trigger('mouseover')
    cy.get('.ant-tooltip-inner').should('be.visible').should('contain', '完了')

    cy.get(':nth-child(1) > .chart__stt > .pending').trigger('mouseover')
    cy.get('.ant-tooltip-inner').should('be.visible').should('contain', '中断')

    cy.get(':nth-child(1) > .chart__stt > .break').trigger('mouseover')
    cy.get('.ant-tooltip-inner')
      .should('be.visible')
      .should('contain', '未完了')
  })

  it('Click on an status name', () => {
    cy.get('.name__stt > :nth-child(1) > span').click()
    cy.url().should('include', 'task-list')
  })

  it('Check display milestones area and mouseover chart bar', () => {
    cy.get(':nth-child(3) > .status__global > .status').should('be.visible')
    cy.get(':nth-child(1) > .Mile__title > :nth-child(1)').should('be.visible')
    cy.get(':nth-child(1) > .Mile__title > :nth-child(2)').should('be.visible')
    cy.get(':nth-child(1) > .mile__chart > .chart__stt').should('be.visible')

    cy.get(':nth-child(1) > .mile__chart > .chart__stt > .new').trigger(
      'mouseover',
    )
    cy.get('.ant-tooltip-inner').should('be.visible')
  })
})
