const email = 'bergstrom.toney@example.com'
const password = '12345678'
const id = 6
const options = ["10","25","50"]

describe('Member list task test', () => {
    context('Member list task test', () => {
        it('visit', () => {
            cy.visit('/member/tasks')
            cy.request('GET', '/api/web-init').then((response) => {
                const str = response.headers['set-cookie'][0]
                const token = `${str.replace('XSRF-TOKEN=', '').replace(/%3[Dd].*/g, '')}==`
                cy.request({
                    method: 'POST',
                    url: '/api/login',
                    headers: {
                        'X-XSRF-TOKEN': token,
                    },
                    body: {
                        email: email,
                        password: password,
                    },
                })
            })
            cy.visit('/member/tasks')
        })
        it.skip('check title', () => {
            cy.get('.my-4').should('contain', "メンバ詳細（タスク一覧）")
        })
        it.skip('check button modoru', () => {
            cy.get('button').first().click()
            cy.url().should('include', `/member/${id}`)
            cy.go('back')
        })
        it.skip('check status', () => {
            cy.get('button').should('contain', 'すべて')
            cy.get('button').should('contain', '未着手')
            cy.get('button').should('contain', '進行中')
            cy.get('button').should('contain', '完 了')
            cy.get('button').should('contain', '中 断')
            cy.get('button').should('contain', '未完了')
            cy.get('.title').should('contain', 'ステータス')
        })
        it.skip('check search', () => {
            cy.get('.ant-input').first().should('exist').as('search-input')
            cy.get('@search-input').invoke('attr', 'placeholder').should('eq', 'タスク名')
            cy.get('#start_date').should('exist').invoke('attr', 'placeholder').should('eq', 'YYYY/MM/DD')
        })
        it.skip('check page', () => {
            cy.get('span').should('contain', '表示件数:')
        })
        it.skip('check action', () => {
            cy.get('input[placeholder*="タスク名"]').type('mafafaqeqwe').should('have.value', 'mafafaqeqwe')
            cy.get('.ant-empty-description').should('contain', '該当結果が見つかりませんでした')
            cy.get('input[placeholder*="タスク名"]').clear()
            cy.get('input[placeholder*="YYYY/MM/DD"]').type('2018/07/23', {force: true}).should('have.value', '2018/07/23').type('{enter}')
            cy.get('.ant-table-container').contains('td.ant-table-cell', 'Stephany King')
            cy.get('input[placeholder*="YYYY/MM/DD"]').clear()
        })
        
        // Check select
        it.skip('click select', () => {
            cy.get('.ant-select').click()
            cy.get('.ant-select-selector').should('be.visible')
            cy.get('.ant-select').click().get('.ant-select-item-option').each((ele, index) => {
                expect(ele.text()).to.equal(options[index])
            })
        })

        it.skip('click row', () => {
            cy.get('tr.ant-table-row').first().click()
            cy.url().should('include', 'tasks/2')
            cy.go('back')
        })

        it('click status', () => {
            cy.get('button').each((res) => {
                if(res.text() == '未着手') {
                    cy.get(res).click()
                    cy.get('tr.ant-table-row').each(res => {
                        cy.get(res).should('contain', '未着手')
                    })
                }
            })
        })
    })
})