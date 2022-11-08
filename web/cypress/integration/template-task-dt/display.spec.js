describe('display test',()=>{
    var templatetask,beforetask,aftertask,len;
    before(()=>{
        // cy.visit('http://jobfair.local:8000/login')
        // cy.get('#login_email.ant-input').type('jobfair@sun-asterisk.com')
        // cy.get('#login_password').type('12345678')
        // cy.get('.ant-btn').click()
        cy.loginAs('superadmin').then((response)=>{
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
        
        
    })
    it('base',()=>{
        cy.get('h1').should('contain','テンプレートタスク詳細')
        cy.get('.button__left > button:nth-child(1)').should('be.visible')
        //cy.contains('編 集').should('be.visible')
        //cy.contains('削 除').should('be.visible')
        cy.contains('テンプレートタスク名:').should('be.visible')
        cy.contains('カテゴリ:').should('be.visible')
        cy.contains('マイルストーン:').should('be.visible')
        //cy.contains('リレーション').should('be.visible')
        cy.contains('前のタスク ').should('be.visible')
        cy.contains('次のタスク').should('be.visible')
        cy.contains('工数').should('be.visible')
        cy.contains('詳細').should('be.visible')
        
    })

    
    it('name',()=>{
        cy.get('div.mt-5:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)').should('contain',templatetask.name)
    })
    it('category',()=>{
        cy.get('div.grid-cols-2:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)').should('contain',templatetask.categories[0].category_name)
    })
    it('milestones',()=>{
        cy.get('div.col-span-1:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)').should('contain',templatetask.milestone.name)
    })
    it('before task',()=>{
        if(beforetask.length<1) cy.get('div.rela:nth-child(1) > div:nth-child(2)').should('contain','データがありません')
        else {
            for(var i=0;i<beforetask.length;i++)
            {
                if(beforetask[i].name>20) cy.get('div.rela:nth-child(1) > div:nth-child(2)').should('contain',beforetask[i].name.slice(0,20))
                else cy.get('div.rela:nth-child(1) > div:nth-child(2)').should('contain',beforetask[i].name)
            }
        } 
    })
    it('after task',()=>{
        if(aftertask.length<1) cy.get('div.rela:nth-child(2) > div:nth-child(2)').should('contain','データがありません')
        else {
            for(var i=0;i<aftertask.length;i++)
            {
                if(aftertask[i].name>20) cy.get('div.rela:nth-child(2) > div:nth-child(2)').should('contain',aftertask[i].name.slice(0,20))
                else cy.get('div.rela:nth-child(2) > div:nth-child(2)').should('contain',aftertask[i].name)
            }
        } 
    })
    it('effort ',()=>{
        cy.get('span.ef:nth-child(1)').should('contain',templatetask.effort)
        if(templatetask.is_day==1) cy.get('span.ef:nth-child(2)').should('contain','日')
        else cy.get('span.ef:nth-child(2)').should('contain','時間')
        cy.get('span.ef:nth-child(4)').should('contain',templatetask.unit)
    })
    it('detail',()=>{
        var detailLen=beforetask.length;
        if(detailLen>5) detailLen=5;
        if(detailLen==0) cy.get('.des').should('not.contain')
        else {
            for(var i=0;i<detailLen;i++)
            {
                cy.get('.des').should('contain',beforetask[i].name)
            }
        }
    })
    // it('edit button',()=>{
    //     cy.contains('編 集').should('be.visible')
    //     cy.contains('編 集').click()
    //     cy.url().should('not.contain','template-task-dt')

    // })
    
    it('back button',()=>{
        cy.visit('http://jobfair.local:8000/template-task-dt/'+len)
        cy.contains('戻る').should('be.visible')
        cy.contains('戻る').click()
        cy.url().should('not.contain','template-task-dt')
    })
})