module.exports = {
  auth() {
    cy.session("cookie", () => {
      cy.intercept(`**/lastPerBook`) //ovako uvek da radimo sa interceptovima
        .as("interceptLogin");
      cy.visit(``);
      //cy.visit(`${Cypress.env("loginStudent1")}`, { failOnStatusCode: false });
      cy.wait("@interceptLogin");
    });
  },

  authStudents(url = "") {
    cy.session(`cookie.${url}`, () => {
      cy.intercept(`**/lastPerBook`) //ovako uvek da radimo sa interceptovima
        .as("interceptLogin");
      cy.visit(url);
      cy.wait("@interceptLogin");
    });
  },
};
