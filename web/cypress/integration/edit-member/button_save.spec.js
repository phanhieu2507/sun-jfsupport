const id = 2
describe('Check button save', () => {
    beforeEach(() => {
        cy.visit(`/member/${id}/edit`)
        cy.wait(500)
    })
  
    it.skip('Check button save clickable', () => {
        cy.get('#name').clear().type('abc')
        cy.get('#email').clear().type('2')
        cy.get('[type="submit"]').should('not.be.disabled')
    })
  
    it.skip('check modal when click save button', () => {
        cy.get('[type="submit"]').last().click()
        cy.get('.ant-modal-content').should('be.visible')
        cy.get('.ant-modal-body').should('contain', 'このまま保存してもよろしいですか？ ')
        cy.get('.ant-modal-content').within(() => {
            cy.get('.ant-btn').first().should('be.visible').should('contain', 'いいえ')
            cy.get('.ant-btn').last().should('be.visible').should('contain', 'はい')
        })
    })
  
    it.skip('check when click outside modal', () => {
        cy.get('[type="submit"]').last().click()
        const arr = []
        cy.get('#name').invoke('val')
            .then((sometext) => { arr.push(sometext) })
        cy.get('#email').invoke('val')
            .then((sometext) => { arr.push(sometext) })
        cy.get('.ant-select-selection-item').invoke('text').then((sometext) => { arr.push(sometext) })
        cy.get('body').click(0, 0)
        cy.get('.ant-modal-root').should('not.be.visible')
        cy.get('#name').invoke('val')
            .then((sometext) => { expect(sometext).to.equal(arr[0]) })
        cy.get('#email').invoke('val')
            .then((sometext) => { expect(sometext).to.equal(arr[1]) })
        cy.get('.ant-select-selection-item').invoke('text')
            .then((sometext) => { expect(sometext).to.equal(arr[2]) })
    })
  
    it.skip('check click save and click yes when email is duplicate', () => {
        cy.get('#email').clear().type('desmond81@example.net')
        cy.get('[type="submit"]').last().click()
        cy.get('.ant-modal-content').find('.ant-btn').last().click()
        cy.wait(100)
        cy.get('.ant-notification-notice-message').should('be.visible').should('contain', 'The email has already been taken.')
    })
  
    it('check click save and click no', () => {
        cy.get('[type="submit"]').last().click()
        const arr = []
        cy.get('#name').invoke('val')
            .then((sometext) => { arr.push(sometext) })
        cy.get('#email').invoke('val')
            .then((sometext) => { arr.push(sometext) })
        cy.get('#categories').invoke('val').then((sometext) => { arr.push(sometext) })
        cy.get('.ant-modal-content').find('.ant-btn').last().click()
        cy.get('.ant-modal-root').should('not.be.visible')
        cy.get('#name').invoke('val')
            .then((sometext) => { expect(sometext).to.equal(arr[0]) })
        cy.get('#email').invoke('val')
            .then((sometext) => { expect(sometext).to.equal(arr[1]) })
        cy.get('#categories').invoke('val')
            .then((sometext) => { expect(sometext).to.equal(arr[2]) })

        cy.url().should('include', `member/${id}`)
        cy.go('back')
    })
  })