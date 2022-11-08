const validPassword = '12345678'; // TODO: change your password in db
const existValidEmail = 'AnAdmin@sun-asterisk.com'; // TODO: change your email in db

describe('Check file', () => {
    const id = 1
    it('Visit file', () => {
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
        cy.visit(`/file/${id}`)
        
    })
})

describe('Check display', () => {
    it('Check Display', () => {
        cy.get('h1').contains('ファイル')
        cy.get('.navbar').should('be.visible')
    
    })

    it('Check file', () => {
        cy.get('table').find('div').contains('名前')
        cy.get('table').find('th').contains('更新者')
        cy.get('table').find('th').contains('更新時間')
        

        if(!cy.get('tbody.ant-table-tbody > tr.ant-table-placeholder').should('not.exist')){
            cy.get('div').contains('このフォルダは空です。')
        }else{

                cy.get('tbody.ant-table-tbody > tr').its('length').then((len)=>{
                cy.get('tbody > tr > td ').find('.ant-checkbox-input').should('have.length', len-1)
                cy.get('tbody > tr > td > div').find('span').invoke('attr', 'style', 'max-width: 20ch').should('have.attr', 'style', 'max-width: 20ch')
                cy.get('tbody > tr > td > div').find('.text-sm').each(($s)=>{
                        if($s.text().length > 20){
                            $s.trigger('mouseover')
                        }
                    })
                  
                cy.get('button').should('be.disabled').find('span').contains('編 集')
                cy.get('button').should('be.disabled').find('span').contains('削 除')
                cy.get('.table-top').find('.ant-checkbox-wrapper > .ant-checkbox:nth-child(1)').click()
                cy.get('td').find('.ant-checkbox-checked').should('have.length', len-1)
                cy.get('.table-top').find('.ant-checkbox-wrapper > .ant-checkbox:nth-child(1)').click()

                cy.get('tbody').find('tr:nth-child(2)').find('.ant-checkbox').click()
                cy.get('button').find('span').contains('削 除').click()
                //Check modal delete
                cy.get('.ant-modal-content').find('.ant-modal-body > p').contains('削除してもよろしいですか？')
                cy.get('.ant-modal-content').find('.ant-modal-footer > button > span').contains('いいえ')
                cy.get('.ant-modal-content').find('.ant-modal-footer > button > span').contains('いいえ').click()
                //Check modal edit
                
            
            })
           
        }

    })
})
describe('Check button add file', () => {
    it('Check modal add file display', () => {
        cy.get('.ant-btn').find('span').should('be.visible').contains('新しいファイル')
        cy.get('.ant-btn').find('span').contains('新しいファイル').click({force: true})
        cy.get('.ant-modal-content').should('be.visible')
        cy.get('.ant-modal-title').should('contain', '新しいファイル')
        cy.get('.ant-modal-close-x').should('be.visible')
        cy.get('[for="basic_name_file"]').should('be.visible').contains('名前')
        cy.get('[for="basic_link"]').should('be.visible').contains('リンク')
        cy.get('#basic_name_file').should('be.empty')
        cy.get('#basic_link').should('be.empty')
        cy.get('.ant-modal-footer').within(() => {
            cy.get('.ant-btn').contains('保 存')
            cy.get('.ant-btn').contains('キャンセル')
              .click({ force: true })
        })
    })

    it('Check input active', () => {
        cy.get('.ant-btn').find('span').contains('新しいファイル').click({ force: true })
            cy.get('input[placeholder*="新しいファイル名"]').type('hello').should('have.value', 'hello').clear()
            cy.get('.ant-form-item-explain-error').then((message) => {
              cy.wrap(message).should('contain', 'この項目は必須です。')
            })
            // cy.get('.ant-btn').find('span').contains('保 存').should('be.disable') :))
            cy.get('input[placeholder*="グーグルドライブリンク"]').type('hello').should('have.value', 'hello').clear()
            cy.get('.ant-form-item-explain-error').then((message) => {
              cy.wrap(message).should('contain', 'この項目は必須です。')
            
            cy.get('.ant-btn').should('contain', '保 存').should('be.disabled')
        })
        cy.get('.ant-modal-footer').within(() => {
            cy.get('.ant-btn').contains('キャンセル').click({ force: true })
        })
    })

    it('Check data existed', () => {
        let initialData = 'jobfair'   
        cy.get('.ant-btn').find('span').contains('新しいファイル').click({ force: true })
        cy.get('input[placeholder*="新しいファイル名"]').type(initialData)
        cy.get('input[placeholder*="グーグルドライブリンク"]').type('test.com')
        // cy.get('.ant-modal-footer').find('button:nth-child(2)').click()
        // cy.get('.ant-notification-notice-message > role').should('be.visible').should('contain', 'このファイル名は既に使用されています。')
        // cy.get('.ant-btn').contains('保 存').should('be.disable')
        
        cy.get('.ant-modal-footer').within(() => {
            cy.get('.ant-btn').contains('キャンセル').click({ force: true })
        })
    })

    it('Check true active', () => {
        cy.get('.ant-btn').find('span').contains('新しいファイル').click({ force: true })
        cy.get('input[placeholder*="新しいファイル名"]').type('HelloWorld111')
        cy.get('input[placeholder*="グーグルドライブリンク"]').type('asdf')
        // cy.get('.ant-modal-footer').within(() => {
        //     cy.get('.ant-btn').last().click({ force: true }).wait(1000)
        // })
        // cy.get('.ant-notification-notice-message').should('be.visible').should('contain', '新しいファイルを追加しました。')
        // cy.get('.ant-modal-content').should('not.visible')
        // cy.get('list-file').contains('HelloWorld111').should('be.visible')
        cy.get('.ant-modal-footer').within(() => {
            cy.get('.ant-btn').contains('キャンセル').click({ force: true })
        })
    })
})
describe('Check Search file', () => {
    it('Check display',() => {
        cy.get('h2').contains('ファイルを検索').should('be.visible')
        cy.get('.ant-form>.ant-row:nth-child(1) label').should('be.visible').contains('名前')
        // cy.get('.ant-form>.ant-row:nth-child(1) input').should('be.visible').should('empty')
        cy.get('.ant-form>.ant-row:nth-child(2) label').should('be.visible').contains('更新日')
        cy.get('.ant-form>.ant-row:nth-child(2) label').should('be.visible').contains('更新日')
        // cy.get('.ant-form>.ant-row:nth-child(2) input').should('be.visible').should('empty')
        cy.get('.ant-form>.ant-row:nth-child(3) label').should('be.visible')
        // cy.get('.ant-form>.ant-row:nth-child(3) input').should('be.visible').should('empty')
        cy.get('.ant-form>.ant-row:nth-child(4) label').should('be.visible').contains('更新者')
        cy.get('.ant-form>.ant-row:nth-child(4) .FileSelectBox').should('be.visible')
        // cy.get('.ant-form>.ant-row:nth-child(5 button').contains('検索').should('be.visible')   
    })

    it('Check modal', () => {
        cy.get('div.search > form > div:nth-child(1)').find('input').type('jobfair')
        cy.get('.FileButton').should('be.visible').find('span').contains('検 索').click()
        cy.get('.ant-modal-body > button').should('be.visible').contains('閉じる')
        cy.get('.ant-modal-body .ant-table-tbody > tr:nth-child(2)').then(($tr)=>{
            if($tr.hasClass('data-row-key')){

                cy.get('.ant-modal-body .ant-table-tbody > tr:nth-child(2) > td:nth-child(2)').contains('jobfair').should('be.visible')
            }else{
                // cy.get('div.ant-empty-description').contains('満足しているファイルはありません。')
            }
            cy.get('.ant-btn').contains('閉じる')
              .click({ force: true })
        })
    })
})
describe('Check button add folder', () => {
    it('Check modal add folder display', () => {
        cy.get('button').find('span').should('be.visible').contains('新しいフォルダ')
        cy.get('button').find('span').contains('新しいフォルダ').click({force: true})
        cy.get('.ant-modal-content').should('be.visible')
        cy.get('.ant-modal-title').should('contain', '新しいフォルダ')
        cy.get('.ant-modal-close-x').should('be.visible')
        cy.get('[for="basic_name_folder"]').should('be.visible').contains('名前')
        cy.get('#basic_name_folder').should('be.empty')
        cy.get('.ant-modal-footer').within(() => {
            cy.get('.ant-btn').contains('保 存')
            cy.get('.ant-btn').contains('キャンセル')
              .click({ force: true })
        })
    })

    it('Check input active', () => {
        cy.get('.ant-btn').find('span').contains('新しいフォルダ').click({force: true})
            cy.get('input[placeholder*="新しいフォルダ名"]').type('hello').should('have.value', 'hello').clear()
            cy.get('.ant-form-item-explain-error').then((message) => {
            cy.wrap(message).should('contain', 'この項目は必須です。')
            cy.get('.ant-btn').should('contain', '保 存').should('be.disabled')
        })
        cy.get('.ant-modal-footer').within(() => {
            cy.get('.ant-btn').first().click({ force: true }).wait(1000)
        })
       
    })
    

    it('Check data existed', () => {
        let initialData = 'jobfair'
        cy.get('button').find('span').contains('新しいフォルダ').click({force: true})
        cy.get('input[placeholder*="新しいフォルダ名"]').type(initialData)
        // cy.get('.ant-modal-footer').within(() => {
        //     cy.get('.ant-btn').last().click({ force: true })
        // })
        // cy.get('.ant-notification-notice-message').should('contain', 'このファイル名は既に使用されています。')
        // cy.get('.ant-btn').contains('保 存').should('be.disabled')        
        cy.get('.ant-modal-footer').within(() => {
            cy.get('.ant-btn').first().click({ force: true }).wait(1000)
        })
       
    })

    it('Check true active', () => {
        cy.get('button').find('span').contains('新しいフォルダ').click({ force: true })
        cy.get('input[placeholder*="新しいフォルダ名"]').type('Hello')
        cy.get('.ant-modal-footer').within(() => {
            cy.get('.ant-btn').first().click({ force: true }).wait(1000)
        })
        // cy.get('button').find('span').contains('新しいフォルダ').click({ force: true })
        // cy.get('.ant-notification-notice-message').should('be.visible').should('contain', '新しいファイルを追加しました。')
        // cy.get('.ant-modal-content').should('not.visible')
        // cy.get('list-folder').contains('HelloWorld111').should('be.visible')
    })

    
})







