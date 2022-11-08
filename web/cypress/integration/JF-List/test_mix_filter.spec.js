describe('Mixed Filter and hide button test', () => {
      var jflist;
      beforeEach(() => {
            cy.request('GET', '/api/jf-list').then((response) => {
                  console.log(response.body)
                  jflist = response.body;

            })
            cy.visit('/jobfairs')
            cy.wait(3000)
      })
      it('Mixed filter test', () => {
            var len = jflist.length;
            if (jflist.length > 10) len = 10;
            for (var i = 0; i < len; i++) {

                  const firstday = jflist[Object.keys(jflist)[i]].start_date;
                  const formatted_day = firstday.split("-");

                  cy.get('.ant-picker-input > input:nth-child(1)')
                        .type(formatted_day[0] + '/' + formatted_day[1] + '/' + formatted_day[2] + '{enter}', { force: true })
                  var countJF = jflist.reduce((count, jfobject) => {
                        if (jfobject.start_date === firstday) {
                              count++;
                              //cy.get('.ant-table-row').should('contain',jfobject.name)
                        }
                        if (count > 10) count = 10;
                        return count;
                  }, 0)
                  cy.get('.ant-table-row').should('have.length', countJF)
                  cy.get('button.ant-btn:nth-child(2)').click()
                  cy.wait(1000)
                  cy.get('.ant-table-row').should('have.length', countJF)
                  cy.get('button.ant-btn:nth-child(3)').click()
                  cy.wait(1000)

                  const minStudents = jflist.reduce((min, jfobject) => {
                        if (min > jfobject.number_of_students && jfobject.start_date === firstday) min = jfobject.number_of_students;
                        return min
                  }, 100)
                  var slider_atribute = 'left: ' + minStudents + '%; right: auto; transform: translateX(-50%);';
                  var bar_attribute = 'left: ' + minStudents + '%; right: auto; width: ' + 100 - minStudents + '%;';

                  if (minStudents > 50) {
                        cy.get('.ant-slider-handle').eq(0)
                              .invoke('attr', 'style', 'left: 50%; right: auto; transform: translateX(-50%);')
                              .invoke('attr', 'aria-valuenow', '50').click()
                  }

                  if (minStudents > 75) {
                        cy.get('.ant-slider-handle').eq(0)
                              .invoke('attr', 'style', 'left: 75%; right: auto; transform: translateX(-50%);')
                              .invoke('attr', 'aria-valuenow', '75').click()
                  }

                  if (minStudents > 87) {
                        cy.get('.ant-slider-handle').eq(0)
                              .invoke('attr', 'style', 'left: 87%; right: auto; transform: translateX(-50%);')
                              .invoke('attr', 'aria-valuenow', '87').click()
                  }
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', slider_atribute).invoke('attr', 'aria-valuenow', minStudents).click()

                  cy.get('.ant-table-row').should('have.length', countJF)
                  cy.get('button.ant-btn:nth-child(2)').click()
                  cy.wait(1000)
                  cy.get('.ant-table-row').should('have.length', countJF)
                  cy.get('button.ant-btn:nth-child(3)').click()
                  cy.wait(1000)

                  const maxStudents = jflist.reduce((max, jfobject) => {
                        if (max < jfobject.number_of_students && jfobject.start_date === firstday) max = jfobject.number_of_students;
                        if (max > 90) return 90;
                        return max
                  }, 0)

                  slider_atribute = 'left: ' + maxStudents + '%; right: auto; transform: translateX(-50%);';
                  bar_attribute = 'left: ' + maxStudents + '%; right: auto; width: ' + 100 - maxStudents + '%;';

                  if (maxStudents > 50) {
                        cy.get('.ant-slider-handle').eq(0)
                              .invoke('attr', 'style', 'left: 50%; right: auto; transform: translateX(-50%);')
                              .invoke('attr', 'aria-valuenow', '50').click()
                  }

                  if (maxStudents > 75) {
                        cy.get('.ant-slider-handle').eq(0)
                              .invoke('attr', 'style', 'left: 75%; right: auto; transform: translateX(-50%);')
                              .invoke('attr', 'aria-valuenow', '75').click()
                  }
                  if (maxStudents > 87) {
                        cy.get('div.space-y-2:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(4)')
                              .invoke('attr', 'style', 'left: 87%; right: auto; transform: translateX(-50%);')
                              .invoke('attr', 'aria-valuenow', '87').click()
                  }
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', slider_atribute).invoke('attr', 'aria-valuenow', maxStudents).click()

                  countJF = jflist.reduce((count, jfobject) => {
                        if (jfobject.start_date === firstday && jfobject.number_of_students >= maxStudents) {
                              count++;
                              //cy.get('.ant-table-row').should('contain',jfobject.name)
                        }
                        if (count > 10) count = 10;
                        return count;
                  }, 0)

                  cy.get('.ant-table-row').should('have.length', countJF)
                  cy.get('button.ant-btn:nth-child(2)').click()
                  cy.wait(1000)
                  cy.get('.ant-table-row').should('have.length', countJF)
                  cy.get('button.ant-btn:nth-child(3)').click()
                  cy.wait(1000)
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', 'left: 0%; right: auto; transform: translateX(-50%);').click()
                  cy.get('.ant-picker-input > input:nth-child(1)').clear({ force: true })
            }
      })
      it('Mixed filter if there no jf pass test', () => {
            var len = jflist.length;
            if (jflist.length > 10) len = 10;
            const minStudents = jflist.reduce((min, jfobject) => {
                  if (min > jfobject.number_of_students) min = jfobject.number_of_students;
                  return min
            }, 100)
            var slider_atribute = 'left: ' + minStudents + '%; right: auto; transform: translateX(-50%);';
            var bar_attribute = 'left: ' + minStudents + '%; right: auto; width: ' + 100 - minStudents + '%;';

            if (minStudents > 50) {
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', 'left: 50%; right: auto; transform: translateX(-50%);')
                        .invoke('attr', 'aria-valuenow', '50').click()
            }

            if (minStudents > 75) {
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', 'left: 75%; right: auto; transform: translateX(-50%);')
                        .invoke('attr', 'aria-valuenow', '75').click()
            }

            if (minStudents > 87) {
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', 'left: 87%; right: auto; transform: translateX(-50%);')
                        .invoke('attr', 'aria-valuenow', '87').click()
            }
            cy.get('.ant-slider-handle').eq(0)
                  .invoke('attr', 'style', slider_atribute).invoke('attr', 'aria-valuenow', minStudents).click()
            var countJF = jflist.reduce((count, jfobject) => {
                  if (jfobject.number_of_students >= minStudents) {
                        count++;
                        //cy.get('.ant-table-row').should('contain',jfobject.name)
                  }
                  if (count > 10) count = 10;
                  return count;
            }, 0)
            cy.get('.ant-table-row').should('have.length', countJF)
            cy.get('button.ant-btn:nth-child(2)').click()
            cy.wait(1000)
            cy.get('.ant-table-row').should('have.length', countJF)
            cy.get('button.ant-btn:nth-child(3)').click()
            cy.wait(1000)

            cy.get('.ant-picker-input > input:nth-child(1)')
                  .type('3000/10/10' + '{enter}', { force: true })
            cy.get('.ant-table-row').should('have.length', 0)
            cy.get('.ant-empty-description').should('contain', '該当結果が見つかりませんでした')
            cy.get('.ant-picker-input > input:nth-child(1)').click()
            cy.get('.ant-picker-clear').click()


            const maxStudents = jflist.reduce((max, jfobject) => {
                  if (max < jfobject.number_of_students) max = jfobject.number_of_students;
                  if (max > 90) return 90;
                  return max
            }, 0)


            slider_atribute = 'left: ' + maxStudents + '%; right: auto; transform: translateX(-50%);';
            bar_attribute = 'left: ' + maxStudents + '%; right: auto; width: ' + 100 - maxStudents + '%;';

            if (maxStudents > 50) {
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', 'left: 50%; right: auto; transform: translateX(-50%);')
                        .invoke('attr', 'aria-valuenow', '50').click()
            }

            if (maxStudents > 75) {
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', 'left: 75%; right: auto; transform: translateX(-50%);')
                        .invoke('attr', 'aria-valuenow', '75').click()
            }

            if (maxStudents > 87) {
                  cy.get('.ant-slider-handle').eq(0)
                        .invoke('attr', 'style', 'left: 87%; right: auto; transform: translateX(-50%);')
                        .invoke('attr', 'aria-valuenow', '87').click()
            }
            cy.get('.ant-slider-handle').eq(0)
                  .invoke('attr', 'style', slider_atribute).invoke('attr', 'aria-valuenow', maxStudents).click()

            countJF = jflist.reduce((count, jfobject) => {
                  if (jfobject.number_of_students >= maxStudents) {
                        count++;
                        //cy.get('.ant-table-row').should('contain',jfobject.name)
                  }
                  if (count > 10) count = 10;
                  return count;
            }, 0)

            cy.get('.ant-table-row').should('have.length', countJF)
            cy.get('button.ant-btn:nth-child(2)').click()
            cy.wait(1000)
            cy.get('.ant-table-row').should('have.length', countJF)
            cy.get('button.ant-btn:nth-child(3)').click()
            cy.wait(1000)
            cy.get('.ant-picker-input > input:nth-child(1)')
                  .type('3000/10/10' + '{enter}', { force: true })
            cy.get('.ant-table-row').should('have.length', 0)
            cy.get('.ant-empty-description').should('contain', '該当結果が見つかりませんでした')
            cy.get('.ant-picker-input > input:nth-child(1)').click()
            cy.get('.ant-picker-clear').click()
            cy.get('.ant-slider-handle').eq(0)
                  .invoke('attr', 'style', 'left: 0%; right: auto; transform: translateX(-50%);').click()



      })

})