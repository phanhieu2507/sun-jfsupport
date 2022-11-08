describe('Search test',()=>{
      var jflist;
      beforeEach(()=>{
          cy.request('GET','/api/jf-list').then((response)=>{
              console.log(response.body)
              jflist=response.body;
  
          })
          cy.visit('/jobfairs')
          cy.wait(3000)
      })
  
      // it('JFname Select Search',()=>{
      //     var len=jflist.length;
      //     if(jflist.length>10) len=10;
      //     for(var i=0;i<len;i++)
      //     {
      //         const search_name=jflist[Object.keys(jflist)[i]].name;
      //         cy.get('.ant-input').type(search_name)
      //         cy.get('div.ant-select-item[aria-selected="true"]').contains(search_name,{matchCase:true}).click()
      //         var countJF=jflist.reduce((count,jfobject)=>{
      //             if(jfobject.name.includes(search_name)) 
      //             {
      //                 console.log(search_name+jfobject.name+ count)
      //                 count++;
      //             }
      //             if(count>10) count=10;
      //             return count;
      //         },0)
      //         cy.get('.ant-table-row').should('have.length',countJF)
  
      //         cy.get('.ant-input').clear()
      //     }
          
      // })
  
      it('JFname type Search',()=>{
          var len=jflist.length;
          if(jflist.length>10) len=10;
          for(var i=0;i<len;i++)
          {
              const search_name=jflist[Object.keys(jflist)[i]].name;
              cy.get('.ant-input').type(search_name+ '{enter}')
              var countJF=jflist.reduce((count,jfobject)=>{
                  if(jfobject.name.includes(search_name)) 
                  {
                      console.log(search_name+jfobject.name+ count)
                      count++;
                  }
                  if(count>10) count=10;
                  return count;
              },0)
              cy.get('.ant-table-row').should('have.length',countJF)
  
              cy.get('.ant-input').clear()
          }
          
      })
  
      // it('Admin Select Search',()=>{
      //     var len=jflist.length;
      //     if(jflist.length>10) len=10;
      //     for(var i=0;i<len;i++)
      //     {
      //         const search_name=jflist[Object.keys(jflist)[i]].admin;
      //         cy.get('.ant-input').type(search_name)
      //         cy.get('div.ant-select-item[aria-selected="true"]').contains(search_name,{matchCase:true}).click()
      //         var countJF=jflist.reduce((count,jfobject)=>{
      //             if(jfobject.admin.includes(search_name)) 
      //             {
      //                 console.log(search_name+jfobject.admin+ count)
                      
      //                 count++;
      //             }
      //             if(count>10) count=10;
      //             return count;
      //         },0)
      //         cy.get('.ant-table-row').should('have.length',countJF)
  
      //         cy.get('.ant-input').clear()
      //     }
          
      // })
  
      it('Admin type Search',()=>{
          var len=jflist.length;
          if(jflist.length>10) len=10;
          for(var i=0;i<len;i++)
          {
              const search_name=jflist[Object.keys(jflist)[i]].admin;
              cy.get('.ant-input').type(search_name+'{enter}')
              var countJF=jflist.reduce((count,jfobject)=>{
                  if(jfobject.admin.includes(search_name)) 
                  {
                      console.log(search_name+jfobject.admin+ count)
                      count++;
                  }
                  if(count>10) count=10;
                  return count;
              },0)
              cy.get('.ant-table-row').should('have.length',countJF)
  
              cy.get('.ant-input').clear()
          }
          
      })
      
  
      
  })