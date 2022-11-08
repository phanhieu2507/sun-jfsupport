const id = 3

describe('Check button cancel', () => {
    it('visit', () => {
        cy.visit(`/member/${id}/edit`)
    })

    it.skip('check modal when click save button', () => {
        cy.get('[type="submit"]').first().click()
        cy.get('.ant-popover').should('be.visible')
        cy.get('.ant-popover-message-title').should('contain', '変更は保存されていません。続行してもよろしいですか？')
        cy.get('.ant-popover-buttons').within(() => {
          cy.get('.ant-btn').first().should('be.visible').should('contain', 'いいえ')
          cy.get('.ant-btn').last().should('be.visible').should('contain', 'はい')
        })
    })

    it.skip('check when click outside or cancel the modal', () => {
        cy.get('[type="submit"]').first().click()
        cy.get('.ant-popover-buttons').within(() => {
            cy.get('.ant-btn').first().should('be.visible').should('contain', 'いいえ').click()
        })
    })

    it('check when click oke the modal', () => {
        cy.get('[type="submit"]').first().click()
        cy.get('.ant-popover-buttons').within(() => {
            cy.get('.ant-btn').last().should('be.visible').should('contain', 'はい').click()
            cy.url().should('include', `member/${id}`)
            cy.go('back')
        })
    })
})