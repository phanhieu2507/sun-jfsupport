describe('Check JFschedule Detail', () => {
  const id = Math.floor(Math.random() * 5) + 1
  var total = 0
  var milestone = []
  before(() => {
    // Get user information
    cy.request('GET', `api/milestones/${id}/list`).then((res) => {
      cy.wrap(res.body).as('data')
      cy.get('@data').then((data) => {
        total = data.length
        milestone = data
      })
    })
  })
  beforeEach(() => {
    cy.loginAs('superadmin')
    cy.visit(`/schedule/${id}`)
  })
  it('Check Display', () => {
    cy.get('.navbar').should('be.visible')
    cy.get('#back_btn').should('contain', '戻る')
    cy.get('.gantt-chart_btn').as('chart-btn')
    cy.get('#swiper').should('have.class', 'swiper-container')
    cy.get('#title').should('contain', 'JFスケジュール詳細')
    cy.get('#total').should('contain', 'トタル')
  })
  it('Check control button back', () => {
    cy.get('#back_btn').should('be.visible').click()
    cy.url().should('contain', '/schedule')
  })
  it('Check control button Gantt chart', () => {
    cy.get('.gantt-chart_btn').should('be.visible').click()
    cy.url().should('contain', `/schedule/gantt-chart/${id}`)
  })
  it('Check display Swiper', () => {
    if (total <= 4) {
      cy.get('#swiper .swiper-button-next').should('have.class', 'swiper-button-disabled')
      cy.get('#swiper .swiper-button-next').should('have.class', 'swiper-button-disabled')
    } else if (total >= 4) {
      cy.get('#swiper .swiper-button-next').should('have.attr', 'tabindex', '0')
    }
  })
  it('Check Display Milestone', () => {
    cy.get('.milestone-name')
      .its('length')
      .then((length) => {
        var displayMilestoneName = milestone.map((milestone) => milestone.name)
        if (length) {
          cy.get('.milestone-name').then((milestoneName) => {
            milestoneName = milestoneName.toArray().map((ele) => {
              if (ele.innerText.includes('...'))
                return ele.firstChild.firstChild.data + ele.innerHTML.split('"')[1]
              return ele.firstChild.data
            })

            expect(displayMilestoneName.join()).to.equal(milestoneName.join())
          })
        }
      })
  })
  it('Check Display Task', () => {
    cy.get('.task-name')
      .its('length')
      .then((length) => {
        if (length) {
          var displayTaskName = milestone.map((milestone) =>
            milestone.tasks.map((task) => task.name)
          )

          cy.get('.task-name').then((taskName) => {
            console.log(taskName)
            taskName = taskName.toArray().map((ele) => {
              if (ele.innerText.includes('...'))
                return ele.firstChild.firstChild.data + ele.innerHTML.split('"')[1]
              return ele.firstChild.data
            })

            expect(displayTaskName.join()).to.equal(taskName.join())
          })
        }
      })
    cy.get('.detail')
      .its('length')
      .then((length) => {
        if (length) {
          var displayDetail = milestone.map((milestone) =>
            milestone.tasks.map((task) => task.description_of_detail)
          )

          cy.get('.detail').then((detail) => {
            detail = detail.toArray().map((ele) => {
              if (ele.innerText.includes('...'))
                return ele.firstChild.firstChild.data + ele.innerHTML.split('"')[1]
              return ele.firstChild.data
            })

            expect(displayDetail.join()).to.equal(detail.join())
          })
        }
      })
    cy.get('.effort')
      .its('length')
      .then((length) => {
        if (length) {
          var displayEffort = milestone.map((milestone) =>
            milestone.tasks.map((task) => task.effort)
          )

          cy.get('.effort').then((effort) => {
            effort = effort.toArray().map((ele) => {
              return ele.firstChild.data
            })

            expect(displayEffort.join().replaceAll('.0', 'h')).to.equal(effort.join())
          })
        }
      })
    cy.get('.category-name')
      .its('length')
      .then((length) => {
        if (length) {
          var displayCategoryName = milestone.map((milestone) =>
            milestone.tasks.map((task) => task.categories.map((category) => category.category_name))
          )

          cy.get('.category-name').then((categoryName) => {
            categoryName = categoryName.toArray().map((ele) => {
              return ele.firstChild.data
            })

            expect(displayCategoryName.join()).to.equal(categoryName.join())
          })
        }
      })
    cy.get('#total').then(() => {
      var displayTotal = total
      console.log(displayTotal)
      cy.get('#total').then((totalEle) => {
        console.log(totalEle[0])
        expect(`トタル: ${displayTotal}`).to.equal(totalEle[0].innerText)
      })
    })
  })
  it('Check Task Operation', () => {
    cy.get('.task-link').should('have.attr', 'href')
  })
})
