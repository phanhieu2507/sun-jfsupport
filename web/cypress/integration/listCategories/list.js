/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Color from 'color'

describe('check website', () => {
  it('Visits Category', () => {
    cy.visit('http://jobfair.local:8000/Category')
  })

  it('check title', () => {
    cy.get('h1')
      .contains('カテゴリー覧')
      .should('have.css', 'color', 'rgba(0, 0, 0, 0.85)')
  })
})

describe('check search box', () => {
  it('check default', () => {
    cy.get('input[placeholder*="カテゴリを検索"]')
    cy.get('.anticon-search').should('be.visible')
  })
  it('check search process', () => {
    // search real-time
    cy.get('input[placeholder*="カテゴリを検索"]').type('D').should('have.value', 'D')
    cy.get('.ant-table-container').contains('td.ant-table-cell', 'D')
    cy.get('input[placeholder*="カテゴリを検索"]').type('r').should('have.value', 'Dr')
    cy.get('.ant-table-container').contains('td.ant-table-cell', 'Dr')
    cy.get('input[placeholder*="カテゴリを検索"]').clear()
    // search no data
    cy.get('input[placeholder*="カテゴリを検索"]').type('aaaaaaaaaaaaa').should('have.value', 'aaaaaaaaaaaaa')
    cy.get('.ant-empty-description').should('contain', 'No Data')
    cy.get('.ant-pagination').should('not.exist')
    cy.get('input[placeholder*="カテゴリを検索"]').clear()
    // return default
    cy.get('.ant-pagination').should('exist')
  })
})

describe('check list', () => {
  it('check drop down label', () => {
    cy.get('p').contains('表示件数:')
  })
  it('check drop down default', () => {
    // コンボボックスのデフォルト値を確認
    cy.get('.ant-select-selection-item').should('contain', '10').first().click()
    cy.get('.ant-select-item-option-content').should('be.visible')
  })
  it('check number of record', () => {
    cy.get('.ant-select-item-option-content').eq(0).first().click()
    cy.get('.ant-select-selection-item').should('contain', '10')
    cy.get('.ant-table-tbody').find('tr').should('have.length', 11)
    cy.get('.ant-select-selection-item').first().click()
    cy.get('.ant-select-item-option-content').eq(1).first().click()
    cy.get('.ant-select-selection-item').should('contain', '25')
    cy.get('.ant-table-tbody').find('tr').should('have.length', 26)
    cy.get('.ant-select-selection-item').first().click()
    cy.get('.ant-select-item-option-content').eq(2).first().click({ force: true })
    cy.get('.ant-select-selection-item').should('contain', '50')
    cy.get('.ant-table-tbody').find('tr').should('have.length', 51)
  })
  // it('check table header color', () => {
  //   cy.get('.ant-table-thead').should('have.css', 'background-color', 'rgb(186, 232, 232)')
  // })
})

describe('check edit button', () => {
  let initialData = ''
  it('check button existed', () => {
    cy.get('.anticon.anticon-edit').should('be.visible')
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('td:nth-child(2)').then(($span) => {
        initialData = $span.text()
      })
    })
  })

  it('check edit modal', () => {
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('.anticon.anticon-edit').click()
    })
    cy.get('.ant-modal-content').should('be.visible')
    cy.get('.ant-modal-title').should('contain', '編集カテゴリ')
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').should('have.value', initialData)
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().should('be.visible').contains('保 存')
      cy.get('.ant-btn').first().should('be.visible').contains('キャンセル')
        .click({ force: true })
    })
    cy.get('.ant-modal-content').should('not.visible')
  })

  it('check invalid input', () => {
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('.anticon.anticon-edit').click()
    })
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').clear().type('a d c_./ad123+*')
    })
    cy.get('.ant-form-item-explain-error').then((message) => {
      cy.wrap(message).should('contain', 'カテゴリ名はスペースが含まれていません。')
    })
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[value*="a d c_./ad123+*"]').clear()
      cy.get('.ant-form-item-explain-error').then((message) => {
        cy.wrap(message).should('contain', 'この項目は必須です。')
      })
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().click({ force: true })
    })
  })

  it('check duplicate edit process', () => {
    cy.contains('td', '2').parent().within((tr) => {
      cy.get('td:nth-child(2)').then(($span) => {
        initialData = $span.text()
      })
    })
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('.anticon.anticon-edit').click()
    })
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').type(initialData)
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().click({ force: true }).wait(500)
    })
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', 'このカテゴリ名は存在しています')
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().click({ force: true })
    })
  })

  it('check normal edit process', () => {
    cy.reload()
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('.anticon.anticon-edit').click()
    })
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').clear().type('a_b+c123@d')
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().click({ force: true })
    })
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', '変更は正常に保存されました。')
    cy.get('.ant-modal-content').should('not.visible')
    cy.get('.ant-table-container').contains('td.ant-table-cell', 'a_b+c123@d')
    // set default for another test
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('.anticon.anticon-edit').click()
    })
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').clear().type('default')
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().click({ force: true })
    })
  })
})

describe('check pagination', () => {
  it('check no data', () => {
    cy.get('input[placeholder*="カテゴリを検索"]').type('aaaaa', { force: true })
    cy.get('.ant-pagination').should('not.exist')
    cy.get('input[placeholder*="カテゴリを検索"]').clear().wait(500)
  })
  it('check next button', () => {
    cy.get('.ant-pagination-item').last().click()
    cy.get('.ant-pagination-next .ant-pagination-item-link').should('be.disabled')
  })
  it('check previous button', () => {
    cy.get('.ant-pagination-item').first().click()
    cy.get('.ant-pagination-prev .ant-pagination-item-link').should('be.disabled')
  })
  it('click prev and next page', () => {
    cy.get('.ant-pagination-next .ant-pagination-item-link').should('not.disabled').click()
      .then((result) => {
        cy.get('tr > td:nth-child(1)').as('rows')
        cy.get('@rows').last().then((len) => {
          expect(len.text()).to.equal('20')
        })

        cy.get('@rows').eq(1).then((len) => {
          expect(len.text()).to.equal('11')
        })
      })

    cy.get('.ant-pagination-prev .ant-pagination-item-link').should('not.disabled').click()
      .then((result) => {
        cy.get('tr > td:nth-child(1)').as('rows')
        cy.get('@rows').last().then((len) => {
          expect(len.text()).to.equal('10')
        })

        cy.get('@rows').eq(1).then((len) => {
          expect(len.text()).to.equal('1')
        })
      })
  })
})

describe('check add button', () => {
  it('check if button exited', () => {
    cy.reload()
    cy.get('[type="button"]').should('be.visible').contains('追 加')
  })

  it('check modal add', () => {
    cy.get('[type="button"]').first().click()
    cy.get('.ant-modal-content').should('be.visible')
    cy.get('.ant-modal-title').should('contain', '追加カテゴリ')
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]')
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().should('be.visible').contains('登 録')
      cy.get('.ant-btn').first().should('be.visible').contains('キャンセル')
        .click({ force: true })
    })
  })

  it('check invalid input', () => {
    cy.get('[type="button"]').first().click()
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').clear().type('a d c_./ad123+*')
    })
    cy.get('.ant-form-item-explain-error').then((message) => {
      cy.wrap(message).should('contain', 'カテゴリ名はスペースが含まれていません。')
    })
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[value*="a d c_./ad123+*"]').clear()
      cy.get('.ant-form-item-explain-error').then((message) => {
        cy.wrap(message).should('contain', 'この項目は必須です。')
      })
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().click({ force: true })
    })
  })

  it('check duplicate add process', () => {
    let initialData = ''
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('td:nth-child(2)').then(($span) => {
        initialData = $span.text()
      })
    })
    cy.get('[type="button"]').first().click()
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').clear().type(initialData)
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().click({ force: true })
    })
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', 'このカテゴリ名は存在しています')
    cy.get('.ant-form-item-explain-error').then((message) => {
      cy.wrap(message).should('contain', 'このカテゴリ名は存在しています')
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().click({ force: true })
    })
  })

  it('check normal add process', () => {
    cy.get('[type="button"]').first().click()
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').clear().type(categoryName())
    })
    function categoryName() {
      let text = 'newAdd+-*@._'
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'
      for (let i = 0; i < 10; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length))
      return text
    }
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().click({ force: true }).wait(1000)
    })
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', '変更は正常に保存されました。')
    cy.get('.ant-modal-content').should('not.visible')
    cy.get('.ant-table-container').contains('td.ant-table-cell', 'newAdd+-*@._')
  })
})

describe('check delete button', () => {
  it('check button existed', () => {
    cy.reload()
    cy.get('.anticon.anticon-delete').should('be.visible')
  })
  it('check delete modal', () => {
    cy.get('.ant-table-row').last().within((tr) => {
      cy.get('.anticon.anticon-delete').click()
    })
    cy.get('.ant-modal-confirm-title').should('contain', '削除カテゴリ')
    cy.get('.ant-modal-confirm-content').contains('このカテゴリを削除してもよろしいですか？')
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().should('be.visible').contains('キャンセル')
      cy.get('.ant-btn').last().should('be.visible').contains('保 存')
      cy.get('.ant-btn').first().click({ force: true })
    })
  })
  it('check delete process', () => {
    cy.get('.ant-table-row').last().within((tr) => {
      cy.get('.anticon.anticon-delete').click().wait(1000)
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().click({ force: true })
    })
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', '変更は正常に保存されました。').wait(1000)
    cy.get('.ant-table-row').last().should('not.contain', 'newAdd+-*/@._')
  })
})
