/// <reference types="cypress" />

describe("My first e2e testing", () => {
  beforeEach(() => {
    cy.intercept(
      "https://readingservicesdev.lexplore.com/activities/lastPerBook"
    ).as("interceptLogin");
    cy.visit("https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg");
    cy.wait("@interceptLogin");
  });
  it("Test valid add of book ", () => {
    const cookie1 = cy.getCookie("devSessionId").should("exist");
    const cookie2 = cy.getCookie("devSysApi").should("exist");
    cy.setCookie(`devSessionId`, `${cookie1}`).should("exist");
    cy.setCookie("devSysApi", `${cookie2}`).should("exist");
    cy.request({
      method: "PUT",
      failOnStatusCode: false,
      url: `${Cypress.config("addBookUrl")}/books`,
      headers: {
        Cookie: `${cookie1.name}=${cookie1.value}; ${cookie2.name}=${cookie2.value}`,
      },
      body: {
        authors: ["George R. R. Martin"],
        coverUrl:
          "https://books.google.com/books/content?id=bIZiAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        description: "Fantasy-roman.",
        format: "paper",
        genres: ["Fiction"],
        isbn: "",
        numberOfPages: 876,
        publisher: "Bantam",
        title: "A Game of Thrones",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.status));
      //console.log(response)
      expect(response.status).to.eql(200);
    });
  });
});
