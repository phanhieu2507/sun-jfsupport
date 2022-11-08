describe('Recursion and Pagination', () => {
    // Check pagination
    it('Pagination', () => {
        cy.visit('/member')
        findItem("Lesly Predovic")
    })
    // Check id of next pages
    it('check id of next pages', () => {
        cy.get('li.ant-pagination-item-active').then(result => {
            cy.get('.ant-select').click().get('.ant-select-item-option:nth-child(1)').click().then(ele => {
                const num = parseInt(ele.text())
                findId(num + 1, result.text())
            })
        })
    })
    function findItem(value) {
        function findInPage(index) {
            let found = false
            cy.get('li.ant-pagination-item').as('pages')
            cy.get('@pages').its('length').then(len => {
                if (index >= len) {
                    return false
                } else {
                    cy.get('@pages').eq(index).click()
                    cy.get('.ant-table tr > td:nth-child(2)').each((item) => {
                        const itemText = item.text();
                        if (itemText == value) {
                            found = true
                            return false
                        }
                    }).then(() => {
                        if (!found) {
                            findInPage(++index)
                        }
                    })
                }
            })
        }
        findInPage(0)
    }

    function findId(value, nextPage) {
        let found = false
        cy.get(`li.ant-pagination-item-${nextPage}`).as('page-next')
        cy.get('@page-next').then(ele => {
            cy.get('.ant-table tr > td:nth-child(1)').first().then(item => {
                if (item.text() == value) {
                    found = true
                    return true
                }
            })
        })
        return false
    }
})