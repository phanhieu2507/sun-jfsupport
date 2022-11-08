import 'cypress-localstorage-commands'
describe("check all case local storage", () => {
    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.visit('/member')
    })
    
    afterEach(() => {
        cy.saveLocalStorage();
    })
    
    it("first time page is visited", () => {
        cy.getLocalStorage("pagination").should("contain", "pageSize").then(ele => {
            const data = JSON.parse(ele)
            expect(data.pageSize).to.equal(10)
        });
    });

    it("after clicking select", () => {
        cy.get('.ant-select').click().get('.ant-select-item-option:nth-child(2)').click()
        cy.getLocalStorage("pagination").should("contain", "pageSize").then(ele => {
            const data = JSON.parse(ele)
            expect(data.pageSize).to.equal(25)
        });
    });

    it("after reloading", () => {
        cy.getLocalStorage("pagination").should("contain", "pageSize").then(ele => {
            const data = JSON.parse(ele)
            expect(data.pageSize).to.equal(25)
        });
    });
})