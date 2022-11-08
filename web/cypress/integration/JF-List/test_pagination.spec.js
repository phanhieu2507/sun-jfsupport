describe('Test pagination', () => {
    var pagination = 1;
    function LengthPagination(PageSize) {
        var length = Math.ceil(jflist.length / PageSize)
        return length;
    }
    var jflist;
    beforeEach(() => {
        cy.request('GET', '/api/jf-list').then((response) => {
            console.log(response.body)
            jflist = response.body;

        })
        cy.visit('/jobfairs')
    })
    it('check number of display', () => {
        cy.get('.ant-select-selector').eq(0).as('NumberOfDisplay')
        cy.get('@NumberOfDisplay').click().get('[title="10"]').contains('10').as('10')
        cy.get('@NumberOfDisplay').click().get('[title="25"]').contains('25').as('25')
        cy.get('@NumberOfDisplay').click().get('[title="50"]').contains('50').as('50')
        var arr = [10, 25, 50]
        var randIndex = Math.floor((Math.random() * 10) % 3)
        if (arr[randIndex] <= jflist.length) {
            cy.get('@' + arr[randIndex]).click()
            cy.get('[rel="nofollow"]').should('have.length', LengthPagination(arr[randIndex]))
            cy.get('.ant-table-row').should('have.length', arr[randIndex])
        } else {
            cy.get('@' + arr[randIndex]).click()
            cy.get('[rel="nofollow"]').should('have.length', LengthPagination(arr[randIndex]))
            cy.get('.ant-table-row ').should('have.length', jflist.length)
        }
    })
    it('check pagination when data is empty', () => {
        cy.get('.ant-input').type('*****')
        cy.get('.ant-empty-description').contains('該当結果が見つかりませんでした')
        cy.get('.ant-table-pagination').should('not.exist')
    })
    it('check pagination', () => {
        cy.get('.ant-pagination-item-link').as('arrow')
        var length = LengthPagination(10)
        if (length == 1) {
            cy.get('@arrow').eq(0).should('be.disabled')
            cy.get('@arrow').eq(1).should('be.disabled')
        } else if (length == 2) {
            cy.get('.ant-pagination-item-1').click()
            cy.get('.ant-pagination-item-active').contains('1')
            cy.get('@arrow').eq(0).should('be.disabled')
            cy.get('@arrow').eq(1).should('not.be.disabled').as('rightArrow')
            cy.get('@rightArrow').click()
            cy.get('.ant-pagination-item-active').contains(2)

            cy.get('.ant-pagination-item-2').click()
            cy.get('@arrow').eq(0).should('not.be.disabled').as('leftArrow')
            cy.get('@arrow').eq(1).should('be.disabled')
            cy.get('@leftArrow').click()
            cy.get('.ant-pagination-item-active').contains(1)
        } else if (length > 2) {
            cy.get('.ant-pagination-item-1').click()
            cy.get('.ant-pagination-item-active').contains('1')
            cy.get('@arrow').eq(0).should('be.disabled')
            cy.get('@arrow').eq(1).should('not.be.disabled').as('rightArrow')
            cy.get('@rightArrow').click()
            cy.get('.ant-pagination-item-active').contains(2)

            var index = Math.floor((Math.random() * 10) % (length - 2)) + 2
            cy.get('.ant-pagination-item-' + index).click()
            cy.get('.ant-pagination-item-active').contains(index)
            cy.get('@arrow').eq(0).should('not.be.disabled').as('leftArrow')
            cy.get('@arrow').eq(1).should('not.be.disabled').as('rightArrow')
            cy.get('@leftArrow').click().get('.ant-pagination-item-active').contains(index - 1)
            cy.get('.ant-pagination-item-' + index).click()
            cy.get('@rightArrow').click()
            cy.get('.ant-pagination-item-active').contains(index + 1)

            cy.get('.ant-pagination-item-' + length).click()
            cy.get('.ant-pagination-item-active').contains(length)
            cy.get('@arrow').eq(0).should('not.be.disabled').as('leftArrow')
            cy.get('@arrow').eq(1).should('be.disabled')
            cy.get('@leftArrow').click()
            cy.get('.ant-pagination-item-active').contains(length - 1)
        }
    })
})