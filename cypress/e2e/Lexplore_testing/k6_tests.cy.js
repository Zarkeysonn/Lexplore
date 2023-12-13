import login from "../../api/auth";
import loginData from "../../fixtures/login.json";

describe("Getting cookies from request", () => {
  let users = [loginData.student1, loginData.student2, loginData.student7];

  before(() => {
    // cy.writeFile("cypress/fixtures/cookies.json", ""); // clears the file before each tests
  });
  let cookies = [];

  users.forEach((element) => {
    it("Send request and get cookie", () => {
      let kukie;
      cy.intercept("**/lastPerBook").as("interceptLogin");
      cy.visit(element);
      cy.wait("@interceptLogin").then(() => {
        cy.getCookie("devSessionId").then((cookie) => {
          let cookieObjValue = { devSessionId: cookie.value };
          cookies.push(cookieObjValue);
        });
      });
      console.log(cookies, "KUKIJI ALO BATO");
    });
  });

  it("Upisivanje u JSON fajl", () => {
    cy.writeFile("cypress/fixtures/cookies.json", cookies);
    // });
  });
});
