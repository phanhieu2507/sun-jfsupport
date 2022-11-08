describe('Companies slider test',()=>{
      var jflist;
      before(() => {
          cy.request('GET', '/api/jf-list').then((response) => {
              console.log(response.body)
              jflist = response.body;
  
          })
          cy.visit('/jobfairs')
          cy.wait(3000)
      })
  
      it('Companies slider display', () => {
          cy.get('.ant-slider-handle').eq(2).should('have.attr','style','left:0%;right:auto;transform:translateX(-50%)')
          cy.get('.ant-slider-handle').eq(3).should('have.attr','style','left:100%;right:auto;transform:translateX(-50%)')
      })
  
      it('Companies slider', () => {
          for(var i=0;i<5;i++) {
            var index = Math.floor((Math.random() * 150) % 50)
              const slider_atribute = 'left: ' + index + '%; right: auto; transform: translateX(-50%);';
              cy.get('.ant-slider-handle').eq(2)
                  .invoke('attr', 'style', slider_atribute).invoke('attr', 'aria-valuenow', index).click()
              var countJF = jflist.reduce((count, jfobject) => {
                  if (jfobject.number_of_companies >= index) count++;
                  if (count > 10) count = 10;
                  return count;
              }, 0)
              
              cy.get('.ant-table-row').should('have.length', countJF)
              if(countJF==0) cy.get('.ant-empty-description').should('contain','該当結果が見つかりませんでした')
          }
          cy.get('.ant-slider-handle').eq(2)
              .invoke('attr', 'aria-valuenow', index).click()
      })
  })