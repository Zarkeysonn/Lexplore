/// <reference types="cypress" />
import bookData from "../../fixtures/data.json";
import login from "../../fixtures/login.json";

describe("My first e2e testing", () => {
  beforeEach(() => {
    cy.intercept(`${Cypress.env("interceptUrl")}`).as("interceptLogin");
    cy.request({
      url: `${Cypress.env("loginStudent1")}`,
      failOnStatusCode: false,
    });
    cy.visit(login.student1);
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
      url: `${Cypress.env("apiOrigin")}/books`,
      //statusCode: bookData.statusCode404,
      headers: {
        Cookie: `${cookie1.name}=${cookie1.value}; ${cookie2.name}=${cookie2.value}`,
      },
      body: {
        authors: bookData.authors, //["George R. R. Martin"],
        coverUrl: bookData.coverUrl, // "https://books.google.com/books/content?id=bIZiAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api", //ovo staviti u fixtures i onda izvuci odatle
        description: bookData.description, // "Fantasy-roman.",
        format: bookData.format, //"paper",
        genres: bookData.genres, //["Fiction"],
        isbn: "",
        numberOfPages: bookData.numberOfPages,
        publisher: bookData.publisher, //  "Bantam",
        title: bookData.title, //"A Game of Thrones",
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.status));
      console.log(response);
      expect(response.status).to.eql(200);
    });
  });
});
