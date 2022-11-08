describe('Test link to other Page', () => {
    var templateTaskList;
    beforeEach(() => {
        cy.request('GET', '/api/template-tasks').then((response) => {
            templateTaskList = response.body;

        })
        cy.visit('/template-tasks')
    })

    // it('check link of icon edit', () => {
    //     var index = Math.floor((Math.random() * 15) % 10)
    //     if (templateTaskList.length < 10) {
    //         Math.floor((Math.random() * 15) % templateTaskList.length)
    //     }
    //     cy.get('.anticon-edit').eq(index).click()
    //     cy.url().should('include', '/edit-jf/' + templateTaskList[index].id)
    // })
    it('check link of button add JF', () => {
        cy.get('.ant-btn').should('have.text', '追 加').click()
        cy.url().should('include', '/add-template-task')
    })
    it('check link of JF Name', () => {
        var index = Math.floor((Math.random() * 15) % 10)
        if (templateTaskList.length < 10) {
            index = Math.floor((Math.random() * 15) % templateTaskList.length)
        }
        cy.get('[href="/template-task-dt/' + templateTaskList[index].id +'"]').contains(templateTaskList[index].name).click()
        cy.url().should('include', '/template-task-dt/' + templateTaskList[index].id)
    })
})