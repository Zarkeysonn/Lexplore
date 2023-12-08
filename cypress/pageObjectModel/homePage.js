class HomePage {
  get username() {
    return cy.get('[data-cy="user.nick"]');
  }
}

export const homePage = new HomePage();
