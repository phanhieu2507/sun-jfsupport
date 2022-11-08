describe('Test link to other Page', () => {
    var jflist;
    beforeEach(() => {
        cy.request('GET', '/api/jf-list').then((response) => {
            console.log(response.body)
            jflist = response.body;

        })
        cy.visit('/jobfairs')
    })

    // it('check link of icon edit', () => {
    //     var index = Math.floor((Math.random() * 15) % 10)
    //     if (jflist.length < 10) {
    //         Math.floor((Math.random() * 15) % jflist.length)
    //     }
    //     cy.get('.anticon-edit').eq(index).click()
    //     cy.url().should('include', '/edit-jf/' + jflist[index].id)
    // })
    it('check link of button add JF', () => {
        cy.get('.ant-btn').contains('JF追加').click()
        cy.url().should('include', '/add-jobfair')
    })
    it('check link of JF Name', () => {
        var index = Math.floor((Math.random() * 15) % 10)
        if (jflist.length < 10) {
            index = Math.floor((Math.random() * 15) % jflist.length)
        }
        cy.get('[href="/jf-toppage/' + jflist[index].id +'"]').contains(jflist[index].name).click()
        cy.url().should('include', '/jf-toppage/' + jflist[index].id)
    })
})