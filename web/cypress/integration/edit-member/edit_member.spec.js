const id = 3
const expectTextColor = 'rgb(45, 51, 74)' // #2d334a
const labelForm = ['フルネーム', 'メールアドレス', 'カテゴリ']
const buttonForm = ['キャンセル', '保 存']

describe('Edit Member Test', () => {
    context('Index Page', () => {
        it('visit', () => {
            cy.visit(`/member/${id}/edit`)
        })

        it.skip('check title', () => {
            cy.get('.title').contains('メンバ編集')
        })

        it.skip('check title form', () => {
            cy.get('.ant-form-item-label').each((ele, index) => {
                expect(ele.text()).to.equal(labelForm[index])
            })
        })

        it.skip('check button title', () => {
            cy.get('.ant-btn').each((ele, index) => {
                expect(ele.text()).to.equal(buttonForm[index])
                cy.get(ele).should('not.be.disabled')
            })
        })

        it.skip('check email name and categories show', () => {
            cy.request(`/api/member/${id}`).then(ele => {
                cy.get('input[id=name]').invoke('val').then(name => {
                    expect(name).to.equal(ele.body.user.name)
                })
                cy.get('input[id=email]').invoke('val').then(email => {
                    expect(email).to.equal(ele.body.user.email)
                })
                cy.get('.ant-select-selection-item-content').each(item => {
                    ele.body.user.categories.map(category => {
                        expect(category.category_name).to.equal(item.text())
                    })
                })
            })
        })

        // Check action
    
        it.skip('check input type edit mail', () => {
            // check input email is false and must has error
            cy.get('input[id=email]').clear()
            cy.get('input[id=email]').type('hello@sun').should('have.value', 'hello@sun')
            cy.get('.ant-form-item-explain-error').should('be.visible').contains('メールアドレス有効なメールではありません!')
            
            // check input email is true and not have error
            cy.get('input[id=email]').clear()
            cy.get('input[id=email]').type('hello@sun-asterisk.com').should('have.value', 'hello@sun-asterisk.com')
            cy.get('.ant-form-item-explain-error').should('not.exist')
        })

        it.skip('select multiple category', () => {
            cy.get('.ant-select-show-search').click()
            cy.get('.ant-select-open').should('be.visible')
            // ...
        })

        it.skip('empty input', () => {
            cy.get('input[id=email]').clear()
            cy.get('input[id=name]').clear()
            cy.get('.ant-form-item-explain-error').should('exist')
        })
    })
})