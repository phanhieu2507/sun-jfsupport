describe('Check Schedule', () => {
  before(() => {
    cy.visit('http://jobfair.local:8000/edit-jf/11')
    cy.wait(500)
  })
  
  it('Check Schedule', () =>{
    cy.get('.ant-select').last().click({force: true}).type('{enter}')

    cy.request('GET','http://jobfair.local:8000/api/schedules/1/milestones').then((response)=>{
      var milestones=response.body.milestones
      cy.wrap(milestones).each((milestone)=>{
        cy.get('.ant-list').first().find('ul.ant-list-items').first().should('contain',milestone.name)
      })
    })

    cy.request('GET','http://jobfair.local:8000/api/schedules/1/tasks').then((response)=>{
      var tasks=response.body.tasks
      cy.wrap(tasks).each((task)=>{
        cy.get('.ant-list').find('ul.ant-list-items').last().should('contain',task.name)
      })
    })
  })
})
