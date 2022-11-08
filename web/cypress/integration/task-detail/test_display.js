///  <reference types="Cypress" />
const index = 1
const link = "http://jobfair.local:8000/task-detail/" + `${index}`

describe("Task detail test", () => {
  it("Visit task-detail", () => {
    cy.visit(link)
    cy.wait(500)
  })

  it("Test display header", () => {
    cy.get(".title").should("contain", "タスク詳細")
  })

  it("Test back button display", () => {
    cy.get(".ant-btn").contains("戻る").should("be.visible")
  })

  it("Test JFF display", () => {
    cy.get(".title > span").invoke("text").should("not.be.eq", "")
  })

  it("Click on back button", () => {
    cy.get(".ant-btn > span").click()
    cy.url().should("include", "tasks/" + `${index}`)
    cy.visit(link)
  })

  it("Test task name display", () => {
    cy.get(":nth-child(1) > .grid > .layber > p")
      .invoke("text")
      .should("not.be.eq", "")
  })

  it("Test category display", () => {
    cy.get(":nth-child(2) > .grid > .layber > p")
      .invoke("text")
      .should("not.be.eq", "")
  })

  it("Test milestone display", () => {
    cy.get(":nth-child(3) > .grid > .layber > p")
      .invoke("text")
      .should("not.be.eq", "")
  })
  
  it("Test effort display", () => {
    cy.get(":nth-child(4) > .grid > .layber > p")
      .invoke("text")
      .should("not.be.eq", "")
  })

  it("Test detail display", () => {
    cy.get(":nth-child(3) > .mx-8")
      .should("be.visible")
  })

  it("Test manager display", () => {
    cy.get(":nth-child(5) > .grid > .layber > p")
      .invoke("text")
      .should("not.be.eq", "")
  })

  it("Test start date display", () => {
    cy.get(":nth-child(7) > .grid > .layber > p")
      .invoke("text")
      .should("not.be.eq", "")
  })

  it("Test end date display", () => {
    cy.get(":nth-child(8) > .grid > .layber > p")
      .invoke("text")
      .should("not.be.eq", "")
  })

  it("Test status display", () => {
    cy.get(":nth-child(6) > .grid > .layber > p")
      .invoke("text")
      .should("not.be.eq", "")
  })
})