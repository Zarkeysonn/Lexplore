/// <reference types="cypress" />

import data from "../fixtures/data.json";
import bookData from "../fixtures/addNewBook.json";

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
    return cy.get('[id="number.of.pages"]');
  }

  get getSearchForBook() {
    return cy.get("#book-name");
  }

  get getFirstOption() {
    return cy.get("#react-select-2-option-0");
  }

  desiredOption(number) {
    return cy.get(`#react-select-2-option-${number}`);
  }

  get bookAddedNotification() {
    return cy.get('[role="alert"] [type="success"]');
  }

  get getSaveBtn() {
    return cy.get('button[data-cy="proceed.modal"]');
  }

  get getModalDialog() {
    return cy.get('[aria-modal="true"][aria-label="Add new book"]');
  }

  get modalInputBook() {
    return cy.get(
      ".AddBookDialog__BookSearch-sc-3je7o8-3 > .ReactSelectStyles-sc-1j7jq0w-0 > .react-select__control > .react-select__value-container > .react-select__input-container"
    );
  }

  get erroMessage() {
    return cy.get(
      ".FormErrorMessage__StyledFormErrorMessage-sc-1dlt5p8-0 > span"
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

  get typeOfBook() {
    return cy.get('[name="format"]');
  }
  get deleteBookTitleBtn() {
    return cy.get('div[name="error.title"] svg').eq(0);
  }

  //getuj readingType
  get readingType() {
    return cy.get('input[name="reading.type"][type="radio"]');
  }
  //book in list asertacija nakon dodavanja da se i pojavila u nasoj user listi!
  get listOfBooks() {
    return cy.get('[data-cy="book-link"]');
  }

  get errorMssgNumOfPages1500() {
    return cy.get(
      ".FormErrorMessage__StyledFormErrorMessage-sc-1dlt5p8-0 > span"
    );
  }

  findBookText(text) {
    return cy
      .get('div[aria-label="Add new book"]')
      .find(`img[alt*="${text}"]`)
      .next();
  }

  fillAddBook({
    bookName = bookData.bookName,
    bookNumber = 1,
    typeOfBook = bookData.bookTypePaper,
    numberOfPages = bookData.null,
    success = true,
    readingType = bookData.empty_string,
    errorMessage = bookData.empty_string,
  }) {
    cy.intercept("**/track").as("interceptShowModal");
    this.getSearchForBook.type(bookName);
    cy.wait("@interceptShowModal").then(() => {
      this.desiredOption(bookNumber).click({ force: true });
      this.getModalDialog.should("be.visible");
      if (success) {
        // if (readingType !== data.empty_string) {
        //   this.readingType.check(readingType, { force: true });
        // }
        if (typeOfBook !== bookData.empty_string) {
          this.typeOfBook.check(typeOfBook, { force: true });
        }
        if (numberOfPages !== bookData.null) {
          this.getNumberOfPages.clear().type(numberOfPages);
        }
        myReading.findBookText(bookData.bookName).then((text) => {
          expect(text).to.have.text("The Hobbit");
          this.getSaveBtn.click();
          this.bookAddedNotification
            .should("be.visible")
            .and("have.text", "Book added");
          this.listOfBooks.should("be.visible").and("contain", bookName);
        });
      } else {
        if (bookName !== bookData.bookName) {
          this.deleteBookTitleBtn.click();
          this.getModalDialog.click("right", { force: true });
          this.getModalDialog.should(
            "contain.text",
            bookData.errorMessage.noTitle
          );
        }
        this.getNumberOfPages.clear().type(numberOfPages);
        this.getModalDialog.should("contain.text", errorMessage);
        this.getSaveBtn.should("be.disabled");
        this.errorMssgNumOfPages1500.should("contain", errorMessage);
      }
    });
  }
}

export const myReading = new MyReading();
