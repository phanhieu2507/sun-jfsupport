describe('filter test',()=>{
    var taskList,categoryList,milestones;
    const url='http://jobfair.local:8000'
    before(()=>{
        cy.visit(url+'/tasks/1')
        cy.request('GET',url+'/api/jobfair/1/tasks').then((response)=>{
            taskList=response.body;
            taskList=taskList.schedule.tasks;
            console.log(taskList[0].tasks)
        })
        cy.request('GET',url+'/api/categories-template-tasks').then((response)=>{
            categoryList=response.body;
        })
        cy.request('GET',url+'/api/milestone').then((response)=>{
            milestones=response.body;
       })
    })
    it('status filter',()=>{
        cy.get('button.ant-btn-text:nth-child(2)').should('have.css','background-color','rgb(255, 216, 3)')

        cy.get('button.ant-btn-text:nth-child(3)').click()
        const notStarted=taskList.reduce((count,object)=>{
            console.log(object)
            if(object.status=='未着手') count++;
            if(count>10) count=10;
            return count;
        },0)
        cy.get('.ant-table-row').should('have.length',notStarted)

        cy.get('button.ant-btn-text:nth-child(4)').click()
        const inProgress=taskList.reduce((count,object)=>{
            console.log(object)
            if(object.status=='進行中') count++;
            if(count>10) count=10;
            return count;
        },0)
        cy.get('.ant-table-row').should('have.length',inProgress)

        cy.get('button.ant-btn-text:nth-child(5)').click()
        const completion=taskList.reduce((count,object)=>{
            console.log(object)
            if(object.status=='完了') count++;
            if(count>10) count=10;
            return count;
        },0)
        cy.get('.ant-table-row').should('have.length',completion)

        cy.get('button.ant-btn-text:nth-child(6)').click()
        const Suspension=taskList.reduce((count,object)=>{
            console.log(object)
            if(object.status=='中断') count++;
            if(count>10) count=10;
            return count;
        },0)
        cy.get('.ant-table-row').should('have.length',Suspension)

        cy.get('button.ant-btn-text:nth-child(7)').click()
        const Incomplete=taskList.reduce((count,object)=>{
            console.log(object)
            if(object.status=='未完了') count++;
            if(count>10) count=10;
            return count;
        },0)
        cy.get('.ant-table-row').should('have.length',Incomplete)


    })
    it('category dropdown list',()=>{
        cy.get('button.ant-btn-text:nth-child(2)').click()
        for(var i=0;i<categoryList.length;i++)
        {
            cy.get('#rc_select_0').click({force: true})
            cy.get('.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft')
                .should('contain',categoryList[i].category_name)
            var amountCategory=taskList.reduce((count,object)=>{
                if(object.categories[0].category_name==categoryList[i].category_name) count++;
                if(count>10) count=10;
                return count;
            },0)
            cy.get('div.ant-select-item.ant-select-item-option').contains(categoryList[i].category_name).click()
            cy.get('.ant-table-row').should('have.length',amountCategory)
        }
        cy.get('.ant-select-clear')
        .first().invoke('show').click()
        
        
    })

    it('milestones dropdown list',()=>{
        for(var i=0;i<milestones.length;i++)
        {
            cy.get('#rc_select_1').click({force: true})
            cy.get('.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft').should('contain',milestones[i].name)
            var amountMilestone=taskList.reduce((count,object)=>{
                if(object.milestone.name==milestones[i].name) count++;
                if(count>10) count=10;
                return count;
            },0)
            cy.get('div.ant-select-item.ant-select-item-option').contains(milestones[i].name).click()
            cy.get('.ant-table-row').should('have.length',amountMilestone)
        }
        cy.get('.ant-select-clear')
        .last().invoke('show').click()
        
        
    })

    function mixMilestoneFilter(status){
        for(var i=0;i<milestones.length;i++)
        {
            cy.get('#rc_select_1').click({force: true})
            cy.get('.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft').should('contain',milestones[i].name)
            var amountTask=taskList.reduce((count,object)=>{
                if(object.milestone.name==milestones[i].name&&object.status==status) count++;
                if(count>10) count=10;
                return count;
            },0)
            cy.get('div.ant-select-item.ant-select-item-option').contains(milestones[i].name).click()
            cy.get('.ant-table-row').should('have.length',amountTask)
            if(amountTask<1) cy.get('.ant-table-wrapper').should('contain','該当結果が見つかりませんでした')
        }
        cy.get('.ant-select-clear')
        .last().invoke('show').click()
    }

    function mixCategoryFilter(status){
        for(var i=0;i<categoryList.length;i++)
        {
            cy.get('#rc_select_0').click({force: true})
            cy.get('.ant-select-dropdown.ant-select-dropdown-placement-bottomLeft')
                .should('contain',categoryList[i].category_name)
            var amountTask=taskList.reduce((count,object)=>{
                if(object.categories[0].category_name==categoryList[i].category_name&&object.status==status) count++;
                if(count>10) count=10;
                return count;
            },0)
            cy.get('div.ant-select-item.ant-select-item-option').contains(categoryList[i].category_name).click()
            cy.get('.ant-table-row').should('have.length',amountTask)
            if(amountTask<1) cy.get('.ant-table-wrapper').should('contain','該当結果が見つかりませんでした')
        }
        cy.get('.ant-select-clear')
        .first().invoke('show').click()
    }

    function mixNameFilter(status,uniqueNameArr){
        const len=uniqueNameArr.length>5?5:uniqueNameArr.length;
        for(var i=0;i<len;i++)
        {
            var amountTask=taskList.reduce((count,object)=>{
                if(object.name==uniqueNameArr[i]&&object.status==status) count++;
                if(count>10) count=10;
                return count;
            },0)
            cy.get('.ant-input').type(uniqueNameArr[i]);
            cy.get('.ant-table-row').should('have.length',amountTask)
            if(amountTask<1) cy.get('.ant-table-wrapper').should('contain','該当結果が見つかりませんでした')
            cy.get('.ant-input').clear()
        }
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
    
    function makeArrayFromTaskName(ObjLikeArr){
        var arr=[];
        for(var i=0;i<ObjLikeArr.length;i++) arr.push(ObjLikeArr[i].name);
        return arr;
    }
    it('Mixed filter',()=>{
        const taskNameList=makeArrayFromTaskName(taskList);
        const uniqueNameList=taskNameList.filter(onlyUnique);
        cy.get('button.ant-btn-text:nth-child(3)').click()
        mixMilestoneFilter('未着手');
        mixCategoryFilter('未着手');
        mixNameFilter('未着手',uniqueNameList);
        cy.get('button.ant-btn-text:nth-child(4)').click()
        mixMilestoneFilter('進行中');
        mixCategoryFilter('進行中');
        mixNameFilter('進行中',uniqueNameList);
        cy.get('button.ant-btn-text:nth-child(5)').click()
        mixMilestoneFilter('完了');
        mixCategoryFilter('完了');
        mixNameFilter('完了',uniqueNameList);
        cy.get('button.ant-btn-text:nth-child(6)').click()
        mixMilestoneFilter('中断');
        mixCategoryFilter('中断');
        mixNameFilter('中断',uniqueNameList);
        cy.get('button.ant-btn-text:nth-child(7)').click()
        mixMilestoneFilter('未完了');
        mixCategoryFilter('未完了');
        mixNameFilter('未完了',uniqueNameList);
    })

    it('hidden button',()=>{
        cy.contains('フィルタ').should('be.exist')
        cy.contains('フィルタ').click()
        cy.contains('フィルタ').click() 
    })

    it('add task button',()=>{
        cy.contains('追 加').should('be.exist')
        cy.contains('追 加').click()
        cy.url().should('not.contain',url+'/api/jobfair/1/tasks')
    })

    
})

