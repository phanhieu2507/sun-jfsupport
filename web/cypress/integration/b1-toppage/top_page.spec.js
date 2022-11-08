const titleList = ['JF一覧', 'メンバ一覧', 'JFスケジュール一覧', 'テンプレートタスク詳細', 'マスク一覧']

const columns = ['Name', 'Time', 'Name', 'Name', 'Name', 'Category', 'Milestone', 'Name', 'Type', 'Time']

describe('Top Page Test', () => {
    context('Top Page', () => {
        it('visit', () => {
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
                        email: 'jobfair@sun-asterisk.com',
                        password: '12345678',
                    },
                })
            })
            cy.visit('/top-page')
        })

        // Check title of top page show
        it.skip('check top page title show', () => {
            cy.get('p').each((item, index) => {
                expect(item.text()).to.equal(titleList[index])
            })
        })

        // Check table
        it.skip('check table has column in jf', () => {
            cy.get('.ant-table-wrapper').get('th').each((ele, index) => {
                expect(ele.text()).to.equal(columns[index])
            })
        })

        // Check default num of data
        it.skip('check data in jf', () => {
            cy.get('.ant-table-wrapper').each(ele => {
                cy.get(ele).each(item => {
                    cy.get(item).find('tr.ant-table-row').as('pages')
                    cy.get('@pages').its('length').should('be.lte', 5)
                })
            })
        })

        // Check time of JF
        it.skip('check time of jf', () => {
            cy.request('/api/top-page/jobfairs').then(response => {
                const eles = response.body;
                return !!eles.reduce((n, item) => n !== false && item >= n && item)
            })
        })

        // Check icon
        it.skip('check icon search list', () => {
            cy.get('.anticon-search').then(ele => {
                cy.get(ele).first().click()
            })
            cy.get('.ant-input').first().should('exist').as('search-input')
            cy.get('@search-input').invoke('attr', 'placeholder').should('eq', 'Enter Name')
            cy.get('@search-input').type('b').then(() => {
                cy.wait(1000)
                cy.get('.ant-table-row').contains('b', { matchCase: false })
                cy.get('.ant-empty-description').should('contain', 'No Data')
            })
            cy.get('@search-input').clear()
            cy.get('@search-input').type('Emelie Stokes').then(() => {
                cy.get('.ant-table-row').contains('Emelie Stokes', { matchCase: false })
            })
            cy.get('@search-input').clear()
        })
        it.skip('check icon add', () => {
            cy.get('.anticon-plus-circle').first().should('exist').click()
            cy.url().should('include', '/jobfair/add')
            cy.go('back')
        })

        it.skip('click row', () => {
            cy.get('.ant-table-wrapper').then((ele, index) => {
                cy.get(ele[0]).get('tr.ant-table-row').then(item => {
                    cy.get(item[0]).click()
                    cy.url().should('include', 'jobfair/1')
                    cy.go('back')
                })
            })
        })

        // Check date
        it.skip('select date', () => {
            cy.get('.ant-picker-input').first().click()
            cy.get('.ant-picker-cell-in-view').last().click()
            cy.get('.ant-empty-description').should('contain', 'No Data')
        })

        //Member

        it.skip('check icon add member', () => {
            cy.get('.anticon-plus-circle').then(ele => {
                cy.get(ele[1]).click()
            })
            cy.url().should('include', '/member-invite')
            cy.go('back')
        })

        it.skip('check icon search member list', () => {
            cy.get('.anticon-search').then(ele => {
                cy.get(ele[1]).click()
            })
            cy.get('.ant-input').then(res => {
                cy.get(res[0]).should('exist').as('input-member')
                cy.get('@input-member').type('bdasdasdadsa').then(() => {
                    cy.wait(1000)
                    cy.get('.ant-empty-description').should('contain', 'No Data')
                })
                cy.get('@input-member').clear()
                cy.get('@input-member').type('Dr. Gus Walsh Jr.').then(() => {
                    cy.get('.ant-table-row').contains('Dr. Gus Walsh Jr.', { matchCase: false })
                })
                cy.get('@input-member').clear()
            })
        })

        it.skip('click row', () => {
            cy.get('.ant-table-wrapper').then((ele, index) => {
                cy.get(ele[1]).get('tr.ant-table-row').then(item => {
                    cy.get(item[0]).click()
                    cy.url().should('include', 'member/1')
                    cy.go('back')
                })
            })
        })

        // Shedule
        it.skip('check icon add member', () => {
            cy.get('.anticon-plus-circle').then(ele => {
                cy.get(ele[2]).click()
            })
            cy.url().should('include', '/schedule/add')
            cy.go('back')
        })

        it.skip('check icon search schedule list', () => {
            cy.get('.anticon-search').then(ele => {
                cy.get(ele[2]).click()
            })
            cy.get('.ant-input').then(res => {
                cy.get(res[0]).should('exist').as('input-member')
                cy.get('@input-member').type('bdasdasdadsa').then(() => {
                    cy.wait(1000)
                    cy.get('.ant-empty-description').should('contain', 'No Data')
                })
                cy.get('@input-member').clear()
                cy.get('@input-member').type('Christelle Moore').then(() => {
                    cy.get('.ant-table-row').contains('Christelle Moore', { matchCase: false })
                })
                cy.get('@input-member').clear()
            })
        })

        it.skip('click row', () => {
            cy.get('.ant-table-wrapper').then((ele, index) => {
                cy.get(ele[2]).get('tr.ant-table-row').then(item => {
                    cy.get(item[0]).click()
                    cy.url().should('include', 'schedule/1')
                    cy.go('back')
                })
            })
        })

        // Template

        it.skip('check icon add member', () => {
            cy.get('.anticon-plus-circle').then(ele => {
                cy.get(ele[3]).click()
            })
            cy.url().should('include', '/template-task/add')
            cy.go('back')
        })

        it.skip('check icon search template list', () => {
            cy.get('.anticon-search').then(ele => {
                cy.get(ele[3]).click()
            })
            cy.get('.ant-input').then(res => {
                cy.get(res[0]).should('exist').as('input-member')
                cy.get('@input-member').type('bdasdasdadsa').then(() => {
                    cy.wait(1000)
                    cy.get('.ant-empty-description').should('contain', 'No Data')
                })
                cy.get('@input-member').clear()
                cy.get('@input-member').type('Maudie Monahan').then(() => {
                    cy.get('.ant-table-row').contains('Maudie Monahan', { matchCase: false })
                })
                cy.get('@input-member').clear()
            })
        })

        it.skip('click row', () => {
            cy.get('.ant-table-wrapper').then((ele, index) => {
                cy.get(ele[3]).get('tr.ant-table-row').then(item => {
                    cy.get(item[0]).click()
                    cy.url().should('include', 'template-task/1')
                    cy.go('back')
                })
            })
        })

        it.skip('search category', () => {
            cy.get('.ant-input').then(res => {
                cy.get(res[0]).should('exist').as('category-template')
                cy.get('@category-template').type('bdasdasdadsa').then(() => {
                    cy.wait(1000)
                    cy.get('.ant-empty-description').should('contain', 'No Data')
                })
                cy.get('@category-template').clear()
                cy.get('@category-template').type('1次面接練習').then(() => {
                    cy.get('.ant-table-row').contains('1次面接練習', { matchCase: false })
                })
                cy.get('@category-template').clear()
            })
        })

        it.skip('search milestone', () => {
            cy.get('.ant-input').then(res => {
                cy.get(res[1]).should('exist').as('category-template')
                cy.get('@category-template').type('bdasdasdadsa').then(() => {
                    cy.wait(1000)
                    cy.get('.ant-empty-description').should('contain', 'No Data')
                })
                cy.get('@category-template').clear()
                cy.get('@category-template').type('会社紹介').then(() => {
                    cy.get('.ant-table-row').contains('会社紹介', { matchCase: false })
                })
                cy.get('@category-template').clear()
            })
        })

        // Task

        it.skip('check icon add member', () => {
            cy.get('.anticon-plus-circle').then(ele => {
                cy.get(ele[4]).click()
            })
            cy.url().should('include', '/task/add')
            cy.go('back')
        })

        it.skip('check icon task template list', () => {
            cy.get('.anticon-search').then(ele => {
                cy.get(ele[4]).click()
            })
            cy.get('.ant-input').then(res => {
                cy.get(res[2]).should('exist').as('input-member')
                cy.get('@input-member').type('bdasdasdadsa').then(() => {
                    cy.wait(1000)
                    cy.get('.ant-empty-description').should('contain', 'No Data')
                })
                cy.get('@input-member').clear()
                cy.get('@input-member').type('Prof. Ivy Bailey').then(() => {
                    cy.get('.ant-table-row').contains('Prof. Ivy Bailey', { matchCase: false })
                })
                cy.get('@input-member').clear()
            })
        })

        it.skip('click row', () => {
            cy.get('.ant-table-wrapper').then((ele, index) => {
                cy.get(ele[3]).get('tr.ant-table-row').then(item => {
                    cy.get(item[0]).click()
                    cy.url().should('include', 'template-task/1')
                    cy.go('back')
                })
            })
        })

        it.skip('search time', () => {
            // Check date
            cy.get('.ant-picker-input').last().click()
            cy.get('.ant-picker-cell-in-view').last().click()
            cy.get('.ant-empty-description').should('contain', 'No Data')
        })

        it('search jobfair name', () => {
            cy.get('.ant-input').last().should('exist').as('input-jobfair')
            cy.get('@input-jobfair').type('bdasdasdadsa').then(() => {
                cy.wait(1000)
                cy.get('.ant-empty-description').should('contain', 'No Data')
            })
            cy.get('@input-jobfair').clear()
            cy.get('@input-jobfair').type('Prof. Ivy Bailey').then(() => {
                cy.get('.ant-table-row').contains('Prof. Ivy Bailey', { matchCase: false })
            })
            cy.get('@input-jobfair').clear()
        })
    })
})