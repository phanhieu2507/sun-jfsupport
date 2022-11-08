import Color from 'color'
describe('Edit Milestone Test', () => {
  const expectTextColor = Color('#272343').string() 
    it('Visits Jobfair Support Edit Milestone', () => {
      cy.visit('http://jobfair.local:8000/milestones/add')
    })

    it('Check title', () => {
      cy.get('.title').contains('マイルストーン追加').should('have.css', 'color')
      .and('eq', expectTextColor)
    })

    it('Check label', () => {
      
      cy.get('form label p').contains('マイルストーン名').should('have.css', 'color')
      .and('eq', expectTextColor)
      cy.get('form label').should('have.attr', 'class', 'ant-form-item-required')
      cy.get('form label p').contains('期日').should('have.css', 'color')
      .and('eq', expectTextColor)
    })

    it('Check input ', () => {
      cy.get('input[id=addMilestone_name]').type('３４').should('have.value', '34')
      cy.get('input[id=addMilestone_name]').clear().then(() => {
        cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('この項目は必須です。')
      })
      cy.get('input[id=addMilestone_name]').type('text ').invoke('val').then((val) => {
        if(val.includes('　')){
          cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('マイルストーン名はスペースが含まれていません。')

        }
        if(val.includes(' ')){
          cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('マイルストーン名はスペースが含まれていません。')

        }
      })
      cy.get('input[id=addMilestone_time]').type('３４').should('have.value', '34')
      cy.get('input[id=addMilestone_time]').clear().then(() => {
        cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('この項目は必須です。')
      })
      cy.get('input[id=addMilestone_time]').type('-5text ').invoke('val').then((val) => {
        var regExp = /[a-zA-Z !,?._'@]/g;
        if(val.includes('　')){
          cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('マイルストーン名はスペースが含まれていません。')

        }
        if(val.includes(' ')){
          cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('０以上の半角の整数で入力してください')

        }
        if(regExp.test(val)){
          cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('０以上の半角の整数で入力してください')
        } 
      })
      
    })
  })