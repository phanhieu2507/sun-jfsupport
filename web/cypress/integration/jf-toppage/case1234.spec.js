import Color from 'color'

const yellow = Color('#ffd803').toString()
const index = '1'

describe('JF-Toppage Test', () => {
  it('1 Can visit JF-Toppage', () => {
    const link='http://jobfair.local:8000/jf-toppage/'+`${index}`
    cy.visit(link)
    cy.wait(500)
  })
  it('2 Test display content', () => {
    ////////////////////////////////////////////////////////////////
  })
  it('2.1 Test display Jf Detail - Name', () => {
    cy.get('div[class^="Jf__header"]').find('h1').invoke('text').should('not.be.eq','')
  })
  it('2.1.1 Test display Jf Detail - Date', () => {
    cy.get('div[class^="admin__jf"]').find('h3').eq(0).invoke('text').should('not.be.eq','')
  })
  it('2.1.1 Test display Jf Detail - Admin', () => {
    cy.get('div[class^="admin__jf"]').find('h3').eq(1).invoke('text').should('not.be.eq','')
  })
  it('2.1.1 Test display Jf Detail - Company-number', () => {
    cy.get('div[class^="admin__jf"]').find('h3').eq(2).invoke('text').should('not.be.eq','')
  })
  it('2.1.1 Test display Jf Detail - Student-number', () => {
    cy.get('div[class^="admin__jf"]').find('h3').eq(3).invoke('text').should('not.be.eq','')
  })
  it('2.2.1 Test display Side-bar - Home', () => {
    cy.get('li[class^="ant-menu"]').find('a').eq(0).invoke('text').should('be.eq','ホーム')
  })
  it('2.2.2 Test display Side-bar - Task', () => {
    cy.get('li[class^="ant-menu"]').find('a').eq(1).invoke('text').should('be.eq','タスク')
  })
  it('2.2.3 Test display Side-bar - GantChart', () => {
    cy.get('li[class^="ant-menu"]').find('a').eq(2).invoke('text').should('be.eq','ガントチャート')
  })
  it('2.2.4 Test display Side-bar - KanBan', () => {
    cy.get('li[class^="ant-menu"]').find('a').eq(3).invoke('text').should('be.eq','カンバン')
  })
  it('2.2.5 Test display Side-bar - File', () => {
    cy.get('li[class^="ant-menu"]').find('a').eq(4).invoke('text').should('be.eq','ファイル')
  })
  it('2.3 Test display Search Box ', () => {
    cy.get('div[class^="search__task"]').should('exist')
    cy.get('input').invoke('attr', 'placeholder').should('contain', 'タスク名')
    cy.get('button').should('contain', '検索').should('have.css', 'background').and('contain', yellow)
  })
  it('2.4 Test display Task Table ', () => {
    cy.get('div[class^="item name"]').should('exist')
    cy.get('div[class^="item username"]').should('exist')
    cy.get('div[class^="item updated_at"]').should('exist')
  })
  it('2.5 Test display Task Table in order ', () => {
    cy.get('div[class^="item updated_at"]').find('time').then($datetime => {
      const datetime = [...$datetime].map(el => el.text)
      expect(datetime).to.deep.equal([...datetime].sort())
    });
  })
  it('2.6 Test display Status Erea ', () => {
    cy.get('div[class^="status__global"]').eq(0).find('h3').invoke('text').should('be.eq','ステータス')
  })
  it('2.7 Test display Milestone Erea ', () => {
    cy.get('div[class^="status__global"]').eq(1).find('h3').invoke('text').should('be.eq','マイルストーン')
  })
  it('2.8 Test Click to a task', () => {
    const detailTask='http://jobfair.local:8000/task-detai'
    cy.get('div[class^="item name"]').find('a').eq(0).should('exist').click({ force: true })
    cy.location('href').should('contain', detailTask);
    cy.go('back')
  })

  it('3 Test "Show more" and "Hide" button', () => {
    ///////////////////////////////////////////////////////////////////
    let over = false
    const timeout = 100
    for(let i = 0; i<100 && !over;i++){
      cy.get('div[class^="flex justify-center my-4"]').then((buttonContainer)=>{
        if(buttonContainer.text().includes('もっと見る')){
          cy.get('button').contains('もっと見る').click()
        }else{
          over=true
        }
      })
    }
  })
  // it('3.1 Show more button - only visible when more than 5 tasks', () => {
  //   cy.get('div[href*="task-list"]').then(($div)=> {
  //     if($div.length<5){
  //       cy.get('button').contains('もっと見る').should('have.length', 0)
  //       cy.get('button').contains('表示数を戻す').should('have.length', 0)
  //     } else{
  //       cy.get('button').contains('もっと見る').should('not.be.disabled')
  //       cy.get('button').contains('表示数を戻す').should('have.length', 0)
  //     } 
  //   })
  // })
  // it('3.2.1 "Show more" button - when more than 5 task', () => {
  //   cy.get('div[href*="task-list"]').then(($div)=> {
  //     if($div.length<5){
  //       cy.get('button').contains('もっと見る').should('have.length', 0)
  //       cy.get('button').contains('表示数を戻す').should('have.length', 0)
  //     } else{
  //       cy.get('button').contains('もっと見る').should('have.length', 1)
  //       cy.get('div[href*="task-list"]').should('have.length', 5)
  //     } 
  //   })
  // })
  // it('3.2.1 "Show more" button - after click "もっと見る"(10', () => {
  //   cy.get('div[href*="task-list"]').then(($div)=> {
  //     if($div.length<5){
  //       cy.get('button').contains('もっと見る').should('have.length', 0)
  //       cy.get('button').contains('表示数を戻す').should('have.length', 0)
  //     } else{
  //       cy.get('button').contains('もっと見る').click()
  //       cy.get('button').contains('表示数を戻す').should('have.length', 1)
  //       cy.get('div[href*="task-list"]').should('have.length', 10)
  //     } 
  //   })
  // })
  // it('3.2.2 "Show more" button - after click "もっと見る"(15)', () => {
  //   cy.get('div[href*="task-list"]').then(($div)=> {
  //     if($div.length<5){
  //       cy.get('button').contains('もっと見る').should('have.length', 0)
  //       cy.get('button').contains('表示数を戻す').should('have.length', 0)
  //     } else{
  //       cy.get('button').contains('もっと見る').click()
  //       cy.get('button').contains('表示数を戻す').should('have.length', 1)
  //       cy.get('div[href*="task-list"]').should('have.length', 15)
  //     } 
  //   })
  // })
  // it('3.2.3 "Show more" button - after click "もっと見る"(20)', () => {
  //   cy.get('div[href*="task-list"]').then(($div)=> {
  //     if($div.length<5){
  //       cy.get('button').contains('もっと見る').should('have.length', 0)
  //       cy.get('button').contains('表示数を戻す').should('have.length', 0)
  //     } else{
  //       cy.get('button').contains('もっと見る').click()
  //       cy.get('button').contains('表示数を戻す').should('have.length', 1)
  //       cy.get('div[href*="task-list"]').should('have.length', 20)
  //     } 
  //   })
  // })
  // it('3.2.4 "Show more" button - after click "もっと見る"(25)', () => {
  //   cy.get('div[href*="task-list"]').then(($div)=> {
  //     if($div.length<5){
  //       cy.get('button').contains('もっと見る').should('have.length', 0)
  //       cy.get('button').contains('表示数を戻す').should('have.length', 0)
  //     } else{
  //       cy.get('button').contains('もっと見る').click()
  //       cy.get('button').contains('表示数を戻す').should('have.length', 1)
  //       cy.get('div[href*="task-list"]').should('have.length', 25)
  //     } 
  //   })
  // })
  it('3.2.5 "Check if it less than 30 task', () => {
    cy.get('div[href*="task-list"]').then(($div)=> {
      if($div.length<=30){
        expect(true).to.equal(true)
      } else{
        expect(true).to.equal(false)
      } 
    })
  })
  it('3.3 Hide button - after click "表示数を戻す"', () => {
    cy.get('div[href*="task-list"]').then(($div)=> {
      if($div.length<5){
        cy.get('button').contains('もっと見る').should('have.length', 0)
        cy.get('button').contains('表示数を戻す').should('have.length', 0)
      } else{
        cy.get('button').contains('表示数を戻す').click()
        cy.get('button').contains('もっと見る').should('have.length', 1)
        cy.get('button').contains('表示数を戻す').should('have.length', 0)
        cy.get('div[href*="task-list"]').should('have.length', 5)
      } 
    })
  })
})

//