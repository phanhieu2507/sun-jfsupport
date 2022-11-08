const expectTextColor = 'rgb(45, 51, 74)' // #2d334a
const columns = ['No.', 'フルネーム', 'メールアドレス', '参加日']
const options = ['10', '25', '50']
const role = 'admin'
describe('List Member Test', () => {
  context('Index Page', () => {
    it.skip('visit', () => {
      cy.visit('/member')
    })

    // Check component show
    it.skip('check logo', () => {
      cy.get('img').should('have.attr', 'alt')
    })
    it.skip('check title', () => {
      cy.get('.title').contains('メンバ一覧').should('have.css', 'color', expectTextColor)
    })
    it.skip('check label', () => {
      cy.get('span.text-xl').contains('表示件数')
    })

    // Check input search
    it.skip('check input search', () => {
      cy.get('input[placeholder*="探索"]')
      cy.get('.anticon-search').should('be.visible')
    })

    // Check select
    it.skip('click select', () => {
      cy.get('.ant-select').click()
      cy.get('.ant-select-selector').should('be.visible')
      cy.get('.ant-select')
        .click()
        .get('.ant-select-item-option')
        .each((ele, index) => {
          expect(ele.text()).to.equal(options[index])
        })
    })

    // Check button
    it.skip('check button show', () => {
      if (role == 'admin') {
        cy.get('.ant-btn').should('contain', 'メンバー招待')
      }
    })

    // Check pagination
    it.skip('check pagination show', () => {
      cy.get('.ant-pagination')
    })

    // Check table
    it.skip('check table has column', () => {
      cy.get('.ant-table-wrapper')
      cy.get('.ant-table-wrapper')
        .get('th')
        .each((ele, index) => {
          expect(ele.text()).to.equal(columns[index])
        })
    })

    // ----- Check action ------
    // Check button invite click
    it.skip('check button invite click', () => {
      cy.get('.ant-btn').should('contain', 'メンバー招待').click()
      cy.url().should('include', 'member/invite')
      cy.go('back')
    })

    // Check search action
    it.skip('check search action', () => {
      cy.get('input[placeholder*="探索"]').type('forest').should('have.value', 'forest')
      cy.get('.ant-table-container').contains('td.ant-table-cell', 'Forest Grimes')
      cy.get('input[placeholder*="探索"]').clear()
      cy.get('input[placeholder*="探索"]').type('mafafaqeqwe').should('have.value', 'mafafaqeqwe')
      cy.get('.ant-empty-description').should('contain', 'No Data')
      cy.get('input[placeholder*="探索"]').clear()
    })

    // Check default num of JF
    it.skip('check default num of JF', () => {
      cy.get('tr.ant-table-row').as('pages')
      cy.get('@pages')
        .its('length')
        .then((len) => {
          expect(len).to.equal(10)
        })
    })

    // Check prev button disable and num rows JF < num select
    it.skip('check button disable when num JF < num select', () => {
      cy.get('.ant-select')
        .click()
        .get('.ant-select-item-option:nth-child(2)')
        .click()
        .then((ele) => {
          const num = parseInt(ele.text())
          cy.get('tr.ant-table-row').as('pages')
          cy.get('@pages')
            .its('length')
            .then((len) => {
              expect(len).to.most(num)
              cy.get('.ant-pagination-prev .ant-pagination-item-link').should('be.disabled')
            })
        })
    })

    // Check row click to c2
    it.skip('click row', () => {
      cy.get('tr.ant-table-row:nth-child(1)').click()
      cy.url().should('include', 'member/1')
      cy.go('back')
    })

    // Check no data no pagination
    it.skip('check no data no pagination', () => {
      cy.get('input[placeholder*="探索"]').type('mafafaqeqwe').should('have.value', 'mafafaqeqwe')
      cy.get('.ant-pagination').should('not.exist')
    })

    // Check next button disable when page active is last
    it.skip('check next button', () => {
      cy.get('.ant-select')
        .click()
        .get('.ant-select-item-option:nth-child(2)')
        .click()
        .then((ele) => {
          cy.get('.ant-pagination-item').last().click()
          cy.get('.ant-pagination-next .ant-pagination-item-link').should('be.disabled')
        })
    })

    // Click prev and next page to redirect
    it.skip('click prev and next page', () => {
      cy.get('.ant-pagination-next .ant-pagination-item-link')
        .should('not.disabled')
        .click()
        .then((result) => {
          cy.get('tr > td:nth-child(1)').as('rows')
          cy.get('@rows')
            .last()
            .then((len) => {
              expect(len.text()).to.equal('20')
            })

          cy.get('@rows')
            .first()
            .then((len) => {
              expect(len.text()).to.equal('11')
            })
        })

      cy.get('.ant-pagination-prev .ant-pagination-item-link')
        .should('not.disabled')
        .click()
        .then((result) => {
          cy.get('tr > td:nth-child(1)').as('rows')
          cy.get('@rows')
            .last()
            .then((len) => {
              expect(len.text()).to.equal('10')
            })

          cy.get('@rows')
            .first()
            .then((len) => {
              expect(len.text()).to.equal('1')
            })
        })
    })
  })
})
