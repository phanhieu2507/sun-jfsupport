describe('delete button test',()=>{
    var templatetask,beforetask,aftertask,len;
    before(()=>{
        // cy.visit('http://jobfair.local:8000/login')
        // cy.get('#login_email.ant-input').type('nitzsche.arne@example.org')
        // cy.get('#login_password').type('12345678')
        // cy.get('.ant-btn').click()
        // cy.url({timeout:100000}).should('contain','jobfair.local:8000/top')
        cy.loginAs('superadmin')
        cy.request('GET','http://jobfair.local:8000/api/template-tasks').then((response)=>{
            var obj=response.body;
            const arrays=Object.keys(obj);
            console.log(arrays);
            len=arrays.length-1;
            cy.visit('http://jobfair.local:8000/template-task-dt/'+len)
            cy.url().should('contain','jobfair.local:8000/template-task-dt/'+len)
            cy.request('GET','http://jobfair.local:8000/api/template-tasks/'+len).then((response)=>{
                templatetask=response.body;
            })
            cy.request('GET','http://jobfair.local:8000/api/before-template-tasks/'+len).then((response)=>{
                beforetask=response.body;
            })
            cy.request('GET','http://jobfair.local:8000/api/after-template-tasks/'+len).then((response)=>{
                aftertask=response.body;
            })
        })
        
        
    })
    it('delete button',()=>{
        cy.visit('http://jobfair.local:8000/template-task-dt/'+len)
        cy.contains('削 除').should('be.visible')
        cy.contains('削 除').click()
        cy.contains('削除してもよろしいですか？').should('be.visible')
        cy.contains('いいえ').click()
        cy.url().should('contain','jobfair.local:8000/template-task-dt')
        cy.contains('削 除').click()
        cy.contains('削除してもよろしいですか？').should('be.visible')
        cy.contains('はい').click()
        cy.url({timeout:100000}).should('not.contain','template-task-dt')

    })
})