function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
describe('display test',()=>{
    var lasttemplateid,templatetask,previewTemplatetask,categorys,milestones,beforetask,aftertask;
    const Url='http://jobfair.local:8000';
    beforeEach(()=>{
        cy.request('GET',Url+'/api/template-tasks').then((response)=>{
            lasttemplateid=response.body.length-1;
            console.log(lasttemplateid)
            lasttemplateid=3;
            cy.request('GET',Url+'/api/template-tasks/'+lasttemplateid).then((response)=>{
                templatetask=response.body;
                console.log(templatetask);
                cy.visit(Url+'/template-tasks/'+lasttemplateid+'/edit')
            })
            cy.request('GET',Url+'/api/template-tasks/'+(lasttemplateid-1)).then((response)=>{
                previewTemplatetask=response.body;
                console.log(previewTemplatetask);
            })
            cy.request('GET',Url+'/api/categories-template-tasks').then((response)=>{
                categorys=response.body;
                console.log(categorys);
            })
            cy.request('GET',Url+'/api/milestone/').then((response)=>{
                milestones=response.body;
                console.log(milestones);
            })
            cy.request('GET','http://jobfair.local:8000/api/before-template-tasks/'+lasttemplateid).then((response)=>{
                beforetask=response.body;
            })
            cy.request('GET','http://jobfair.local:8000/api/after-template-tasks/'+lasttemplateid).then((response)=>{
                aftertask=response.body;
            })
        })
        
    })
    it('display',()=>{
        cy.contains('テンプレートタスク編集').should('be.visible')
        cy.contains('カテゴリ').should('be.visible')
        cy.contains('マイルストーン').should('be.visible')
        cy.contains('リレーション').should('be.visible')
        cy.contains('前のタスク').should('be.visible')
        cy.contains('次のタスク').should('be.visible')
        cy.contains('工数').should('be.visible')
        cy.contains('詳細').should('be.visible')
        cy.contains('キャンセル').should('be.visible')
        cy.contains('保 存').should('be.visible')
        
    })
    it('template task name',()=>{
        cy.get('#basic_templateTaskName').should('have.attr','value',templatetask.name)
        cy.get('#basic_templateTaskName').type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
        cy.get('.ant-form-item-explain').should('contain','この項目は必須です。')
        cy.get('#basic_templateTaskName').type('jack Hán')
        cy.get('#basic_templateTaskName').type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
        cy.get('#basic_templateTaskName').type('%/:')
        cy.get('.ant-form-item-explain').should('contain','使用できない文字が含まれています')

        
    })

    it('category',()=>{
        cy.get('#basic > div:nth-child(2) > div:nth-child(2)')
        .should('contain',templatetask.categories[0].category_name)
        cy.get('#basic > div:nth-child(2) > div:nth-child(2)').click()
        for(var i=0;i<categorys.length;i++)
        {
            cy.get('.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft div div.rc-virtual-list')
            .should('contain',categorys[i].category_name)
        }
        var afterCategory;
        cy.get('body > div:nth-child(13) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
        .contains(categorys[categorys.findIndex((object)=>{
            afterCategory=object.category_name;
            return object.category_name!==templatetask.categories[0].category_name
        })].category_name).click()
        cy.get('#basic > div:nth-child(2) > div:nth-child(2)').should('contain',afterCategory)
    })

    it('milestone',()=>{
        cy.get('div.ant-row:nth-child(3) > div:nth-child(2)')
        .should('contain',milestones[milestones.findIndex((object)=>{
                    return object.id==templatetask.milestone_id
                })].name                                                                                               
        )
        cy.get('div.ant-row:nth-child(3) > div:nth-child(2)').click()
        cy.wait(1000)
        for(var i=0;i<milestones.length;i++)
        {
            cy.get('.rc-virtual-list').should('contain',milestones[i].name)
        }
        var afterMilestone;
        cy.get('html body div div div.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft')
        .contains(milestones[milestones.findIndex((object)=>{
            afterMilestone=object.name
            return object.id!==templatetask.milestone_id
        })].name)
        cy.get('.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft div div.rc-virtual-list div.rc-virtual-list-holder div div.rc-virtual-list-holder-inner div.ant-select-item.ant-select-item-option div.ant-select-item-option-content').contains(afterMilestone).first().click()
        cy.get('div.ant-row:nth-child(3) > div:nth-child(2)')
        .should('contain',afterMilestone)
    })

    it('before task',()=>{
        console.log(beforetask.before_tasks.length);
        const beforeTaskField=cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)');
        if(beforetask.before_tasks.length<1) beforeTaskField.should('contain','前のタスク')
        else {
            for(var i=0;i<beforetask.before_tasks.length;i++)
            {
                if(beforetask.before_tasks[i].name.length>20) beforeTaskField.should('contain',beforetask[i].name.slice(0,20))
                else beforeTaskField.should('contain',beforetask.before_tasks[i].name)
            }
        } 
        beforeTaskField.click()
        cy.get('.rc-virtual-list div.rc-virtual-list-holder div div.rc-virtual-list-holder-inner div.ant-select-item.ant-select-item-option div.ant-select-item-option-content').first().click()
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)').click('right')
        cy.get('div.rc-virtual-list div.rc-virtual-list-holder div div.rc-virtual-list-holder-inner div.ant-select-item.ant-select-item-option.ant-select-item-option-selected')
        .each((object)=>{
        cy.get('div.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft').invoke('attr','class','ant-select-dropdown ant-select-dropdown-placement-bottomLeft')
            cy.wrap(object).click({force: true})
            cy.wait(500)
        })
        cy.get('.rc-virtual-list div.rc-virtual-list-holder div div.rc-virtual-list-holder-inner div.ant-select-item.ant-select-item-option div.ant-select-item-option-content').first().click({force:true})
        cy.get('span.anticon.anticon-close.ant-tag-close-icon')
        .click()
        cy.wait(500)
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)').click()
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)').click()
    })

    it('after task',()=>{
        console.log(aftertask.after_tasks.length);
        const afterTaskField=cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)');
        if(aftertask.after_tasks.length<1) afterTaskField.should('contain','次のタスク')
        else {
            for(var i=0;i<aftertask.after_tasks.length;i++)
            {
                if(aftertask.after_tasks[i].name.length>20) afterTaskField.should('contain',aftertask[i].name.slice(0,20))
                else afterTaskField.should('contain',aftertask.after_tasks[i].name)
            }
        } 
        afterTaskField.click()
        cy.get('.rc-virtual-list div.rc-virtual-list-holder div div.rc-virtual-list-holder-inner div.ant-select-item.ant-select-item-option div.ant-select-item-option-content').first().click()
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').click('right')
        cy.get('div.rc-virtual-list div.rc-virtual-list-holder div div.rc-virtual-list-holder-inner div.ant-select-item.ant-select-item-option.ant-select-item-option-selected')
        .each((object)=>{
        cy.get('div.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft').invoke('attr','class','ant-select-dropdown ant-select-dropdown-placement-bottomLeft')
            cy.wrap(object).click({force: true})
            cy.wait(500)
        })
        cy.get('.rc-virtual-list div.rc-virtual-list-holder div div.rc-virtual-list-holder-inner div.ant-select-item.ant-select-item-option div.ant-select-item-option-content').first().click({force:true})
        cy.get('span.anticon.anticon-close.ant-tag-close-icon')
        .click()
        cy.wait(500)
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').click()
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').click()
    })

    it('effort',()=>{
        
            cy.get('#basic_effort').should('have.attr','value',templatetask.effort)
            if(templatetask.is_day==0)  cy.get('.ant-select-selection-item').should('contain','時間')
            else  cy.get('.ant-select-open > div:nth-child(1) > span:nth-child(2)').should('have.attr','title','日')
            cy.get('.ant-select-selection-item').last().should('have.attr','title',templatetask.unit)
        
    }
    )

    it('detail',()=>{
        
        cy.get('#basic_description').should('contain',templatetask.description_of_detail)
        cy.get('#basic_description').type('asiufjhasdiufohsfdhuiifsedsdfiouhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
    })

    it('cancel button',()=>{
        // cy.get('button.text-base:nth-child(1)').click()
        // cy.Url().should('not.contain',Url+'/template-tasks/'+lasttemplateid+'/edit')
        // cy.visit(Url+'/template-tasks/'+lasttemplateid+'/edit')
        cy.get('#basic_templateTaskName').type('Aby')
        cy.contains('キャンセル').click()
        cy.contains('いいえ').click()
        cy.contains('キャンセル').click()
        cy.contains('はい').click()
        cy.url().should('not.contain',Url+'/template-tasks/'+lasttemplateid+'/edit')

    })

    it('save button',()=>{
        cy.get('#basic_templateTaskName').type('Aby')
        cy.contains('保 存').click()
        cy.contains('いいえ').click()
        cy.contains('保 存').click()
        cy.contains('はい').click()
        //cy.url({timeout:100000}).should('not.contain',Url+'/template-tasks/'+lasttemplateid+'/edit')

    })
})