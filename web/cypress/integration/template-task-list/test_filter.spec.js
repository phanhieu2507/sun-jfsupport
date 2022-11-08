import Color from 'color'

// const yellow = Color('#ffd803').toString()
const notFoundTemplateSearchName = 'asgytdfagargdfgagareghzfdgbSfawgdfgbzdfgragfga'
const notFoundTestCategory=4-1
const foundTestMilestone=1-1+4
const notFoundTestMilestone=7-1+4



describe('JF-Toppage Test', () => {
  var templateTaskList;
  beforeEach(() => {
    cy.request('GET', 'http://jobfair.local:8000/api/template-tasks').then((response) => {
      templateTaskList = response.body;
    })
  })
  it('1 Can visit JF-Toppage', () => {
    const link='http://jobfair.local:8000/template-tasks/'
    cy.visit(link)
    cy.wait(500)

  })
  it('6.1 Test Search Box Found Value ', () => {
    var index = Math.floor((Math.random() * 15) % 10)
    if (templateTaskList.length < 10) {
      index = Math.floor((Math.random() * 15) % templateTaskList.length)
    }
    const foundTemplateSearchName=templateTaskList[index].name
    cy.get('span[class^="ant-input-affix-wrapper"]').should('exist')
      .get('input[class^="ant-input"]').invoke('attr', 'placeholder','JF名, 管理者')
      .type(foundTemplateSearchName)
    cy.get('tr[class^="ant-table-row"]').get('td').get('a').invoke('text').should('include',foundTemplateSearchName)
    cy.get('span[class^="ant-input-affix-wrapper"]').should('exist')
      .get('input[class^="ant-input"]').invoke('attr', 'placeholder','JF名, 管理者')
      .clear()

  })
  it('6.2 Test Search Box Not Found ', () => {
    cy.get('span[class^="ant-input-affix-wrapper"]').should('exist')
      .get('input[class^="ant-input"]').invoke('attr', 'placeholder','JF名, 管理者')
      .type(notFoundTemplateSearchName)
    cy.get('div[class^="ant-empty-description"]').should('exist').invoke('text').should('be.eq','該当結果が見つかりませんでした')
    cy.get('span[class^="ant-input-affix-wrapper"]').should('exist')
      .get('input[class^="ant-input"]').invoke('attr', 'placeholder','JF名, 管理者')
      .clear()

  })
  it('7.1 Category Select Box Display', () => {
    cy.get('span[class^="ant-select-selection-search"]').should('exist')
      .get('span[class^="ant-select-selection-placeholder"]').contains('カテゴリ').click({force:true})
    cy.get('div[class^="ant-select-item-option-content"]').eq(0).invoke('text').should('include','1次面接練習')
    cy.get('div[class^="ant-select-item-option-content"]').eq(1).invoke('text').should('include','TC業務')
    cy.get('div[class^="ant-select-item-option-content"]').eq(2).invoke('text').should('include','企業担当')
    cy.get('div[class^="ant-select-item-option-content"]').eq(3).invoke('text').should('include','管理者')

  })
  it('7.2 Category Select Box Function Found', () => {
    let foundcate=0
    let catecount1=0
    let catecount2=0
    let catecount3=0
    let catecount4=0
    let catecount5=0
    let catecount6=0
    let catecount7=0
    for(let i=0;i<templateTaskList.length;i++){
      if(templateTaskList[i].categories[0].id==1) catecount1++;
      else if(templateTaskList[i].categories[0].id==2) catecount2++;
      else if(templateTaskList[i].categories[0].id==3) catecount3++;
      else if(templateTaskList[i].categories[0].id==4) catecount4++;
      else if(templateTaskList[i].categories[0].id==5) catecount5++;
      else if(templateTaskList[i].categories[0].id==6) catecount6++;
      else if(templateTaskList[i].categories[0].id==7) catecount7++;

    }
    for(let i=0;i<4;i++){
      if(catecount1>0) {foundcate=1;break;}
      else if(catecount2>0) {foundcate=2;break;}
      else if(catecount3>0) {foundcate=3;break;}
      else if(catecount4>0) {foundcate=4;break;}
      else if(catecount5>0) {foundcate=5;break;}
      else if(catecount6>0) {foundcate=6;break;}
      else if(catecount7>0) {foundcate=7;break;}
    }
    if(foundcate>0){
      cy.get('span[class^="ant-select-selection-search"]').should('exist')
        .get('span[class^="ant-select-selection-placeholder"]').contains('カテゴリ').click({force:true})
      cy.get('div[class^="ant-select-item-option-content"]').eq(foundcate).click({force:true})
      cy.get('tr[class^="ant-table-row"]').get('td').should('exist')

      cy.get('span[class^="ant-select-clear"]').click()
    }else{
      expect(true).to.equal(true)
    }
  })
  it('7.3 Category Select Box Function Not Found', () => {
    let notfoundcate=0
    let catecount1=0
    let catecount2=0
    let catecount3=0
    let catecount4=0
    let catecount5=0
    let catecount6=0
    let catecount7=0
    for(let i=0;i<templateTaskList.length;i++){
      if(templateTaskList[i].categories[0].id==1) catecount1++;
      else if(templateTaskList[i].categories[0].id==2) catecount2++;
      else if(templateTaskList[i].categories[0].id==3) catecount3++;
      else if(templateTaskList[i].categories[0].id==4) catecount4++;
      else if(templateTaskList[i].categories[0].id==5) catecount5++;
      else if(templateTaskList[i].categories[0].id==6) catecount6++;
      else if(templateTaskList[i].categories[0].id==7) catecount7++;

    }
    for(let i=0;i<4;i++){
      if(catecount1=0) {notfoundcate=1;break;}
      else if(catecount2=0) {notfoundcate=2;break;}
      else if(catecount3=0) {notfoundcate=3;break;}
      else if(catecount4=0) {notfoundcate=4;break;}
      else if(catecount5=0) {notfoundcate=5;break;}
      else if(catecount6=0) {notfoundcate=6;break;}
      else if(catecount7=0) {notfoundcate=7;break;}
    }
    if(notfoundcate!=0){
      cy.get('span[class^="ant-select-selection-search"]').should('exist')
        .get('span[class^="ant-select-selection-placeholder"]').contains('カテゴリ').click({force:true})
      cy.get('div[class^="ant-select-item-option-content"]').eq(notfoundcate).click({force:true})
      cy.get('tr[class^="ant-table-row"]').should('not.exist')
      cy.get('div[class^="ant-empty-description"]').should('exist').invoke('text').should('be.eq','該当結果が見つかりませんでした')

      cy.get('span[class^="ant-select-clear"]').click()
    }else{
      expect(true).to.equal(true)
    }
  })
  it('8.1 Milestone Select Box Display', () => {
    cy.get('span[class^="ant-select-selection-search"]').should('exist')
      .get('span[class^="ant-select-selection-placeholder"]').contains('マイルストーン').click({force:true})
    cy.get('div[class^="ant-select-item-option-content"]').eq(4).invoke('text').should('include','会社紹介')
    cy.get('div[class^="ant-select-item-option-content"]').eq(5).invoke('text').should('include','オープンSCP')
    cy.get('div[class^="ant-select-item-option-content"]').eq(6).invoke('text').should('include','プロファイル選択ラウンドの結果')
    cy.get('div[class^="ant-select-item-option-content"]').eq(7).invoke('text').should('include','1回目の面接')
    cy.get('div[class^="ant-select-item-option-content"]').eq(8).invoke('text').should('include','1回目の面接結果')
    cy.get('div[class^="ant-select-item-option-content"]').eq(9).invoke('text').should('include','2回目の面接')
    cy.get('div[class^="ant-select-item-option-content"]').eq(10).invoke('text').should('include','2回目の面接結果')
  })
  it('8.2 Milestone Select Box Found', () => {
    let foundmile=0
    let milecount1=0
    let milecount2=0
    let milecount3=0
    let milecount4=0
    for(let i=0;i<templateTaskList.length;i++){
      if(templateTaskList[i].milestone_id==1) milecount1++;
      else if(templateTaskList[i].milestone_id==2) milecount2++;
      else if(templateTaskList[i].milestone_id==3) milecount3++;
      else if(templateTaskList[i].milestone_id==4) milecount4++;
    }
    for(let i=0;i<4;i++){
      if(milecount1>0) {foundmile=1;break;}
      else if(milecount2>0) {foundmile=2;break;}
      else if(milecount3>0) {foundmile=3;break;}
      else if(milecount4>0) {foundmile=4;break;}
    }
    if(foundmile>0){
      cy.get('span[class^="ant-select-selection-search"]').should('exist')
        .get('span[class^="ant-select-selection-placeholder"]').contains('マイルストーン').click({force:true})
      cy.get('div[class^="ant-select-item-option-content"]').eq(foundmile).click({force:true})
      cy.get('tr[class^="ant-table-row"]').get('td').should('exist')
      cy.get('span[class^="ant-select-clear"]').click()
    }else{
      expect(true).to.equal(true)
    }
  })
  it('8.3 Milestone Select Box Not Found', () => {
    let notfoundmile=0
    let milecount1=0
    let milecount2=0
    let milecount3=0
    let milecount4=0
    for(let i=0;i<templateTaskList.length;i++){
      if(templateTaskList[i].milestone_id==1) milecount1++;
      else if(templateTaskList[i].milestone_id==2) milecount2++;
      else if(templateTaskList[i].milestone_id==3) milecount3++;
      else if(templateTaskList[i].milestone_id==4) milecount4++;
    }
    for(let i=0;i<4;i++){
      if(milecount1=0) {notfoundmile=1;break;}
      else if(milecount2=0) {notfoundmile=2;break;}
      else if(milecount3=0) {notfoundmile=3;break;}
      else if(milecount4=0) {notfoundmile=4;break;}
    }
    if(notfoundmile!=0){
      cy.get('span[class^="ant-select-selection-search"]').should('exist')
        .get('span[class^="ant-select-selection-placeholder"]').contains('マイルストーン').click({force:true})
      cy.get('div[class^="ant-select-item-option-content"]').eq(notfoundmile).click({force:true})
      cy.get('tr[class^="ant-table-row"]').should('not.exist')
      cy.get('div[class^="ant-empty-description"]').should('exist').invoke('text').should('be.eq','該当結果が見つかりませんでした')
      cy.get('span[class^="ant-select-clear"]').click()
    }else{
      expect(true).to.equal(true)
    }
  })
  // it('8.3 Milestone Select Box Not Found', () => {
  //   cy.get('span[class^="ant-select-selection-search"]').should('exist')
  //     .get('span[class^="ant-select-selection-placeholder"]').contains('カテゴリ').click({force:true})
  //   cy.get('div[class^="ant-select-item-option-content"]').eq(notFoundTestCategory).click({force:true})
  //   cy.get('tr[class^="ant-table-row"]').should('not.exist')
  //   cy.get('div[class^="ant-empty-description"]').should('exist').invoke('text').should('be.eq','該当結果が見つかりませんでした')
  //   cy.get('span[class^="ant-select-clear"]').click()
  // })
  it('9.1 Milestone And Category Found', () => {
    let foundcate=0
    let catecount1=0
    let catecount2=0
    let catecount3=0
    let catecount4=0
    let catecount5=0
    let catecount6=0
    let catecount7=0
    for(let i=0;i<templateTaskList.length;i++){
      if(templateTaskList[i].categories[0].id==1) catecount1++;
      else if(templateTaskList[i].categories[0].id==2) catecount2++;
      else if(templateTaskList[i].categories[0].id==3) catecount3++;
      else if(templateTaskList[i].categories[0].id==4) catecount4++;
      else if(templateTaskList[i].categories[0].id==5) catecount5++;
      else if(templateTaskList[i].categories[0].id==6) catecount6++;
      else if(templateTaskList[i].categories[0].id==7) catecount7++;

    }
    for(let i=0;i<4;i++){
      if(catecount1>0) {foundcate=1;break;}
      else if(catecount2>0) {foundcate=2;break;}
      else if(catecount3>0) {foundcate=3;break;}
      else if(catecount4>0) {foundcate=4;break;}
      else if(catecount5>0) {foundcate=5;break;}
      else if(catecount6>0) {foundcate=6;break;}
      else if(catecount7>0) {foundcate=7;break;}
    }
    let foundmile=0
    let milecount1=0
    let milecount2=0
    let milecount3=0
    let milecount4=0
    for(let i=0;i<templateTaskList.length;i++){
      if(templateTaskList[i].milestone_id==1) milecount1++;
      else if(templateTaskList[i].milestone_id==2) milecount2++;
      else if(templateTaskList[i].milestone_id==3) milecount3++;
      else if(templateTaskList[i].milestone_id==4) milecount4++;
    }
    for(let i=0;i<4;i++){
      if(milecount1>0) {foundmile=1;break;}
      else if(milecount2>0) {foundmile=2;break;}
      else if(milecount3>0) {foundmile=3;break;}
      else if(milecount4>0) {foundmile=4;break;}
    }
    if(foundmile>0 && foundcate>0){
      cy.get('span[class^="ant-select-selection-search"]').should('exist')
        .get('span[class^="ant-select-selection-placeholder"]').contains('カテゴリ').click({force:true})
      cy.get('div[class^="ant-select-item-option-content"]').eq(foundcate).click({force:true})
      cy.get('span[class^="ant-select-selection-search"]').should('exist')
        .get('span[class^="ant-select-selection-placeholder"]').contains('マイルストーン').click({force:true})
      cy.get('div[class^="ant-select-item-option-content"]').eq(foundmile).click({force:true})
      cy.get('tr[class^="ant-table-row"]').get('td').should('exist')
      cy.get('span[class^="ant-select-clear"]').click({multiple:true})
    } else{
      expect(true).to.equal(true)
    }
  })
  it('9.2 Milestone And Category Not Found', () => {
    let notfoundcate=0
    let catecount1=0
    let catecount2=0
    let catecount3=0
    let catecount4=0
    let catecount5=0
    let catecount6=0
    let catecount7=0
    for(let i=0;i<templateTaskList.length;i++){
      if(templateTaskList[i].categories[0].id==1) catecount1++;
      else if(templateTaskList[i].categories[0].id==2) catecount2++;
      else if(templateTaskList[i].categories[0].id==3) catecount3++;
      else if(templateTaskList[i].categories[0].id==4) catecount4++;
      else if(templateTaskList[i].categories[0].id==5) catecount5++;
      else if(templateTaskList[i].categories[0].id==6) catecount6++;
      else if(templateTaskList[i].categories[0].id==7) catecount7++;

    }
    for(let i=0;i<4;i++){
      if(catecount1=0) {notfoundcate=1;break;}
      else if(catecount2=0) {notfoundcate=2;break;}
      else if(catecount3=0) {notfoundcate=3;break;}
      else if(catecount4=0) {notfoundcate=4;break;}
      else if(catecount5=0) {notfoundcate=5;break;}
      else if(catecount6=0) {notfoundcate=6;break;}
      else if(catecount7=0) {notfoundcate=7;break;}
    }
    let notfoundmile=0
    let milecount1=0
    let milecount2=0
    let milecount3=0
    let milecount4=0
    for(let i=0;i<templateTaskList.length;i++){
      if(templateTaskList[i].milestone_id==1) milecount1++;
      else if(templateTaskList[i].milestone_id==2) milecount2++;
      else if(templateTaskList[i].milestone_id==3) milecount3++;
      else if(templateTaskList[i].milestone_id==4) milecount4++;
    }
    for(let i=0;i<4;i++){
      if(milecount1=0) {notfoundmile=1;break;}
      else if(milecount2=0) {notfoundmile=2;break;}
      else if(milecount3=0) {notfoundmile=3;break;}
      else if(milecount4=0) {notfoundmile=4;break;}
    }
    if(notfoundcate!=0 || notfoundmile!=0){
      cy.get('span[class^="ant-select-selection-search"]').should('exist')
        .get('span[class^="ant-select-selection-placeholder"]').contains('カテゴリ').click({force:true})
      cy.get('div[class^="ant-select-item-option-content"]').eq(notfoundcate).click({force:true})
      cy.get('span[class^="ant-select-selection-search"]').should('exist')
        .get('span[class^="ant-select-selection-placeholder"]').contains('マイルストーン').click({force:true})
      cy.get('div[class^="ant-select-item-option-content"]').eq(notfoundmile).click({force:true})
      cy.get('tr[class^="ant-table-row"]').should('not.exist')
      cy.get('div[class^="ant-empty-description"]').should('exist').invoke('text').should('be.eq','該当結果が見つかりませんでした')
      cy.get('span[class^="ant-select-clear"]').click({multiple:true})
    } else{
      expect(true).to.equal(true)
    }
    })
})