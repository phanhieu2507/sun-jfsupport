describe('save test', () => {
  let admins; let schedules; let jflength

  before(() => {
    cy.visit('http://jobfair.local:8000/add-jobfair')
    cy.request('GET', 'http://jobfair.local:8000/api/admins').then((response) => {
      admins = response.body
    })
    cy.request('GET', 'http://jobfair.local:8000/api/schedules').then((response) => {
      schedules = response.body
    })
    cy.request('GET', 'http://jobfair.local:8000/api/jobfair').then((response) => {
      jflength = response.body.length
    })
  })

  it('availble button', () => {
    console.log(jflength)
    cy.get('.ant-btn-primary').should('not.be.disabled')
    const namefield = cy.get('#name')
    namefield.click()
    namefield.focused().type(`Henry Jonnathan${jflength}`)
    cy.get('.ant-btn-primary').should('not.be.disabled')
    cy.get('#start_date').type('2021/07/15{enter}', { force: true })
    cy.get('label[for="name"]').click()
    cy.get('.ant-btn-primary').should('not.be.disabled')
    cy.get('#number_of_companies').type('10')
    cy.get('#number_of_students').type('10')
    cy.get('#jobfair_admin_id').click()
    cy.contains(admins[0].name).click()
    cy.get('#schedule_id').click()
    cy.contains(schedules[0].name).click()
    cy.get('.ant-btn-primary').should('not.be.disabled')
    cy.get('.ant-btn-primary').click()
    // cy.get('.ant-notification',{timeout:200000}).should('contain','正常に登録されました。')
    cy.url().should('contain', 'http://jobfair.local:8000/jf-toppage/')
  })
})
