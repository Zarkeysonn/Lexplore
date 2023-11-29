class MyReading {
  get getAddBookBtn() {
    return cy.get("button").contains("Add Book");
  }

  clickAddBookBtn() {
    this.getAddBookBtn()
      .if("visible")
      .then(() => {
        click(); //da li ce ovo raditi
      });
    //click();
  }
  get getPaperBook() {
    return cy.get('[role="dialog"] [value="paper"]');
  }

  get getDigitalBook() {
    return cy.get('[role="dialog"] [value="digital"]');
  }

  get getNumberOfPages() {
    return cy.get('[data-cy="number.of.pages"]');
  }

  get getSearchForBook() {
    return cy.get("#book-name");
  }

  get getFirstOption() {
    return cy.get("#react-select-2-option-0");
  }

  get getSaveBtn() {
    return cy.get('button[data-cy="proceed.modal"]');
  }

  get getModalDialog() {
    return cy.get(
      ".AddBookDialog__BookSearch-sc-3je7o8-3 > .ReactSelectStyles-sc-1j7jq0w-0 > .react-select__control > .react-select__value-container"
    );
  }

  get modalInputBook() {
    return cy.get(
      ".AddBookDialog__BookSearch-sc-3je7o8-3 > .ReactSelectStyles-sc-1j7jq0w-0 > .react-select__control > .react-select__value-container > .react-select__input-container"
    );
  }

  get getTitleErrorMessage() {
    return cy
      .get('[name="error.title"] [for="book-name"]')
      .should(
        "contain.text",
        "Please search for a book and choose one in the list"
      );
  }

  //importuj json fajl sa podacima
  fillAddBook({ inputBook, bookType, success = true }) {
    cy.intercept("**/track").as("interceptShowModal");
    this.getSearchForBook.type(`${inputBook}`);
    cy.wait("@interceptShowModal").then((response) => {
      this.getFirstOption.click({ force: true });
      if (bookType == "paper") {
        this.getPaperBook.click({ force: true }).should("be.checked");
      } else this.getDigitalBook.click({ force: true }).should("be.checked");
      if (success) {
        this.getSaveBtn.should("not.be.disabled");
      } else {
        this.getSaveBtn.should("be.disabled");
      }
    });
  }
}

export const myReading = new MyReading();
