class MyReading {
  get getAddBookBtn() {
    return cy.get("button").contains("Add Book");
  }

  get searchForBook() {
    return cy.get(".react-select__input-container");
  }

  click;
}
