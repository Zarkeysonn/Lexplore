import loginData from "../fixtures/login.json";
import { homePage } from "../pageObjectModel/homePage";

module.exports = {
  auth() {
    cy.session("cookie", () => {
      cy.intercept(`**/lastPerBook`).as("interceptLogin");
      cy.visit(``);
      cy.wait("@interceptLogin");
    });
  },

  authStudents(url = "") {
    cy.session(`cookie.${url}`, () => {
      cy.intercept(`**/lastPerBook`).as("interceptLogin");
      cy.visit(url);
      cy.url().should("eq", `${Cypress.env("homePageUrl")}`);
      cy.wait("@interceptLogin");
    });
  },

  login({ userUrl = loginData.student1, homeUrl = loginData.homePageUrl }) {
    cy.intercept("**/lastPerBook").as("interceptLogin");
    cy.visit(userUrl);
    cy.wait(3000);
    cy.url().should("eq", homeUrl);
    cy.wait("@interceptLogin").then(() => {
      homePage.username.should("have.text", loginData.student1_name);
    });
  },
};
