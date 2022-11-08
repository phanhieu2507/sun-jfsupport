describe('管理者 Test', () => {
  before(() => {
    cy.visit('http://jobfair.local:8000/add-jobfair')
  })
  context('Admin field test', () => {
    let adminlist
    it('Empty field admin', () => {
      cy.get('.ant-btn-primary').click()
      cy.get('div.ant-row:nth-child(5) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').should('contain', 'この項目は必須です')
    })
    it('Admin list', () => {
      cy.get('#jobfair_admin_id').click()
      cy.request('GET', 'http://jobfair.local:8000/api/admins').then((response) => {
        adminlist = response.body
        cy.wrap(adminlist).each((admin) => {
          cy.get('.rc-virtual-list-holder-inner').should('be.exist', admin.name)
        })
      })
    })

    it('Choose admin from list', () => {
      cy.get('div.ant-select-item:nth-child(1) > div:nth-child(1)').click()
      cy.get('.ant-select-selection-item').should('contain', adminlist[Object.keys(adminlist)[0]].name)
    })
  })
})
