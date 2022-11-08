describe('Filter task test',()=>{
    it('add button test ',()=>{
        cy.contains('登 録').should('not.be.disable')
        cy.contains('登 録').click()
    })
    it('cancel button test ',()=>{
        cy.contains('キャンセル').should('not.be.disable')
        cy.contains('キャンセル').click()
    })
})