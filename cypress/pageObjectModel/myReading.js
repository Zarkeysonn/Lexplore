class MyReading {
  get getAddBookBtn() {
    return cy.get("button").contains("Add Book");
  }
}
