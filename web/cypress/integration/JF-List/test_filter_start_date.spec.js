describe('Start date test',()=>{
    var jflist;
    beforeEach(()=>{
        cy.request('GET','/api/jf-list').then((response)=>{
            console.log(response.body)
            jflist=response.body;

        })
        cy.visit('/jobfairs')
        cy.wait(3000)
    })
    it('Calendar filter pick exist day test', () => {
        var len=jflist.length;
        if(jflist.length>10) len=10;
        for(var i=0;i<len;i++) 
        {

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
            cy.get('.ant-picker-input > input:nth-child(1)').clear({ force: true })
        }
    })
    it('Calendar filter pick notexist day test', () => {

        cy.get('.ant-picker-input > input:nth-child(1)')
        .type('3000/10/10'+'{enter}', { force: true })
        cy.get('.ant-table-row').should('have.length', 0)
        cy.get('.ant-empty-description').should('contain','該当結果が見つかりませんでした')

        
    })
}
)