const expectTextColor = 'rgba(0, 0, 0, 0.85)' // #2d334a
const columns = ['No', 'マイルストーン一名', '期日', '', '']
const options = ["10","25","50"]
const role = 'admin'

describe('check dropdown list', () => {
    it('Visits Jobfair Support List Milestone', () => {
      cy.visit('http://jobfair.local:8000/milestones');
    });
  
    it.skip('check title', () => {
        cy.get('h1').contains('マイルストーン一覧').should('have.css', 'color', expectTextColor)
    })

    it.skip('check button show', () => {
        if (role == 'admin') {
            cy.get('.ant-btn').should('contain', '追 加')
        }
    })

    it.skip('click select', () => {
        cy.get('.ant-select').click()
        cy.get('.ant-select-selector').should('be.visible')
        cy.get('.ant-select').click().get('.ant-select-item-option').each((ele, index) => {
            expect(ele.text()).to.equal(options[index])
        })
    })

    it.skip('Click Dropdown', () => {
      cy.get('.ant-select').click();
      cy.get('.ant-select-selector').should('be.visible');
    });
  
    it.skip('Click Dropdown Item', () => {
      cy.get('.ant-select-item-option-content').eq(1).click();
      cy.get('.ant-select-selection-item').should('contain', '25').click();
      cy.get('.ant-select-item-option-content').eq(2).click();
      cy.get('.ant-select-selection-item').should('contain', '50').click();
      cy.get('.ant-select-item-option-content').eq(0).click();
      cy.get('.ant-select-selection-item').should('contain', '10').click();
    });

   
    // Check table
    it.skip('check table has column', () => {
        cy.get('.ant-table-wrapper')
        cy.get('.ant-table-wrapper').get('th').each((ele, index) => {
            expect(ele.text()).to.equal(columns[index])
        })
    })

    it.skip('check no data no pagination', () => {
        cy.get('input[placeholder*="マイルストーン一名, 期日"]').type('mafafaqeqwe').should('have.value', 'mafafaqeqwe')
        cy.get('.ant-pagination').should('not.exist')
        cy.get('input[placeholder*="マイルストーン一名, 期日"]').clear()
    })

    it.skip('check search action', () => {
        cy.get('input[placeholder*="マイルストーン一名, 期日"]').type('elise').should('have.value', 'elise')
        cy.get('.ant-table-container').contains('td.ant-table-cell', 'Elise_Volkman')
        cy.get('input[placeholder*="マイルストーン一名, 期日"]').clear()
        cy.get('input[placeholder*="マイルストーン一名, 期日"]').type('mafafaqeqwe').should('have.value', 'mafafaqeqwe')
        cy.get('.ant-empty-description').should('contain', 'No Data')
        cy.get('input[placeholder*="マイルストーン一名, 期日"]').clear()
    })

    it.skip('check pagination show', () => {
        cy.get('.ant-pagination')
    })

    it.skip('check button disable when one page', () => {
        cy.get('.ant-select').click().get('.ant-select-item-option-content').eq(2).click({force: true}).then(ele => {
            const num = parseInt(ele.text())
            cy.get('tr.ant-table-row').as('pages')
            cy.get('@pages').its('length').then(len => {
                expect(len).to.most(num)
                cy.get('.ant-pagination-prev .ant-pagination-item-link').should('be.disabled')
            })
        })
    })


    it.skip('check next button', () => {
        cy.get('.ant-select').click().get('.ant-select-item-option:nth-child(1)').click().then(ele => {
            cy.get('.ant-pagination-item').last().click()
            cy.get('.ant-pagination-next .ant-pagination-item-link').should('be.disabled')
        })
    })

    it.skip('check button enable', () => {
        cy.get('.ant-select').click().get('.ant-select-item-option:nth-child(1)').click().then(ele => {
            cy.get('.ant-pagination-item').eq(3).click()
            cy.get('.ant-pagination-prev .ant-pagination-item-link').should('not.be.disabled')
            cy.get('.ant-pagination-next .ant-pagination-item-link').should('not.be.disabled')
        })
    })

    it.skip('check prev button', () => {
        cy.get('.ant-select').click().get('.ant-select-item-option:nth-child(1)').click().then(ele => {
            cy.get('.ant-pagination-item').first().click()
            cy.get('.ant-pagination-prev .ant-pagination-item-link').should('be.disabled')
        })
    })
    
    it('click prev and next page', () => {
        cy.get('.ant-pagination-next .ant-pagination-item-link').should('not.disabled').click()
        .then(result => {
            cy.get('tr > td:nth-child(1)').as('rows')
            cy.get('@rows').last().then(len => {
                expect(len.text()).to.equal('20')
            })

            cy.get('@rows').eq(1).then(len => {
                expect(len.text()).to.equal('11')
            })
        })

        cy.get('.ant-pagination-prev .ant-pagination-item-link').should('not.disabled').click()
        .then(result => {
            cy.get('tr > td:nth-child(1)').as('rows')
            cy.get('@rows').last().then(len => {
                expect(len.text()).to.equal('10')
            })

            cy.get('@rows').eq(1).then(len => {
                expect(len.text()).to.equal('1')
            })
        })
    })

    it.skip('check button add', () => {
        if (role == 'admin') {
            cy.get('.ant-btn').should('contain', '追 加')
        }
        cy.get('.ant-btn').should('contain', '追 加').click()
        cy.get('.ant-modal-content').within(() => {
            cy.get('.ant-btn').first().should('be.visible').should('contain', 'いいえ').click()
            cy.get('.ant-btn').last().should('be.visible').should('contain', 'はい')
          })
    })
  });