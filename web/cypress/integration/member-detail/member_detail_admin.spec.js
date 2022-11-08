describe("Check member detail - Admin Role", () => {
  const id = Math.floor(Math.random() * 10) + 1;

  before(() => {
    // Get user information
    cy.request("GET", `/api/members/${id}`).then((res) => {
      cy.wrap(res.body).as("user");
      cy.wrap(res.body.categories).as("categories");
      cy.wrap(res.body.jobfairs).as("jobfairs");
    });
  });

  beforeEach(() => {
    cy.loginAs("admin");
    cy.visit(`/member/${id}`);
    cy.get('.control_btn button[class*="ant-btn-primary"]').as(
      "controlButtons"
    );
  });

  it("Check display information", () => {
    cy.get(".member_table tr > td").as("infos");
    cy.wait(500);
    cy.get("@user")
      .its("name")
      .then((name) => cy.get("@infos").eq(0).should("contain", name));
    cy.get("@user")
      .its("email")
      .then((email) => cy.get("@infos").eq(1).should("contain", email));
    cy.get("@user")
      .its("chatwork_id")
      .then((id) => {
        cy.get("@infos")
          .eq(3)
          .find("a")
          .should("have.attr", "href")
          .and("include", id);
      });

    cy.get("@categories")
      .its("length")
      .then((length) => {
        if (length) {
          cy.get("@infos")
            .eq(2)
            .get(".category-name")
            .as("displayCategories")
            .should("have.length", length);
          cy.get("@categories").then((categories) => {
            categories.forEach((category, index) => {
              cy.get("@displayCategories").then((res) => {
                cy.wrap(res[index]).should(
                  "contain",
                  category["category_name"]
                );
              });
            });
          });
        }
      });

    cy.get("@jobfairs")
      .its("length")
      .then((length) => {
        if (length) {
          cy.get("@infos")
            .eq(4)
            .get(".assigned-jf")
            .as("displayJobfairs")
            .should("have.length", length);
          cy.get("@jobfairs").then((jobfairs) => {
            jobfairs.forEach((jobfair, index) => {
              cy.get("@displayJobfairs").then((res) => {
                cy.wrap(res[index]).should("contain", jobfair["name"]);
              });
            });
          });
        }
      });
  });

  it("Check screen name", () => {
    cy.get("#screen-name").should("be.visible").should("contain", "メンバ詳細");
  });

  it("Check navigation bar visible", () => {
    cy.get("header .navbar").should("be.visible");
  });

  it("Check avatar visible", () => {
    cy.get("#avatar").should("be.visible");
  });

  it("Check profile labels", () => {
    cy.get(".member_table tr > th").should("have.length", 5).as("labels");
    cy.get("@labels").eq(0).should("contain", "フルネーム：");
    cy.get("@labels").eq(1).should("contain", "メールアドレス：");
    cy.get("@labels").eq(2).should("contain", "カテゴリー：");
    cy.get("@labels").eq(3).should("contain", "チャットワークID：");
    cy.get("@labels").eq(4).should("contain", "アサインされたJF：");
  });

  it("Check button back", () => {
    cy.get("#btn-back").should("be.visible").find("a").as("backLink");
    cy.get("@backLink")
      .should("contain", "戻る")
      .should("have.attr", "href")
      .and("include", "member");
  });

  it("Check control buttons", () => {
    cy.get("@controlButtons").eq(1).find("a").as("taskListLink");
    cy.get("@taskListLink")
      .should("contain", "タスクー覧")
      .should("have.attr", "href")
      .and("include", "task-list");
    cy.get("@controlButtons").eq(2).find("a").as("ganttChartLink");
    cy.get("@ganttChartLink")
      .should("contain", "ガンチャート")
      .should("have.attr", "href")
      .and("include", "gantt-chart");
  });
});
