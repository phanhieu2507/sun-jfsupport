describe('cancel test', () => {
  let admins; let schedules

  before(() => {
    cy.visit('http://jobfair.local:8000/add-jobfair')
    cy.request('GET', 'http://jobfair.local:8000/api/admins').then((response) => {
      admins = response.body
    })
    cy.request('GET', 'http://jobfair.local:8000/api/schedules').then((response) => {
      schedules = response.body
    })
  })

  it('availble button', () => {
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('not.be.disabled')
    const namefield = cy.get('#name')
    namefield.click()
    namefield.focused().type('Henry Jonnathan')
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('not.be.disabled')
    cy.get('#start_date').type('2021/07/15{enter}', { force: true })
    cy.get('label[for="name"]').click()
    cy.get('#number_of_companies').type('10')
    cy.get('#number_of_students').type('10')
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('not.be.disabled')
    cy.get('#jobfair_admin_id').click()
    cy.wait(500)
    cy.contains(admins[0].name).click()
    cy.wait(500)
    cy.get('#schedule_id').click()
    cy.contains(schedules[0].name).click()
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('not.be.disabled')
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').click()
    cy.get('.ant-modal-content').should('be.visible')
    cy.get('.ant-modal-confirm-btns > button:nth-child(1)').click()
    cy.url().should('contain', 'add-jobfair')
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').click()
    cy.get('.ant-modal-content').should('be.visible')
    cy.get('.ant-modal-confirm-btns > button:nth-child(2)').click()
    cy.url().should('contain', 'jobfairs')
  })
})
