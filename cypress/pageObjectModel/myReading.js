/// <reference types="cypress" />

import data from "../fixtures/data.json";
import activity from "../fixtures/activity_data.json";
import bookData from "../fixtures/addNewBook.json";

class MyReading {
  get getAddBookBtn() {
    return cy.get("button").contains("Add Book");
  }

  clickAddBookBtn() {
    this.getAddBookBtn()
      .if("visible")
      .then(() => {
        click();
      });
  }
  get getPaperBook() {
    return cy.get('[role="dialog"] [value="paper"]');
  }
  //modal od citanja
  get logReadingModal() {
    return cy.get('div[aria-label="Log reading"]');
  }
  get dateOfReading() {
    return cy.get('div[id="dialogContent"] input[value="today"]');
  }
  //
  get logReadingBtn() {
    return cy.get('button[data-cy="bookCard.primaryAction"]');
  }

  get firstLogReadingBtn() {
    return cy.get('button[data-cy="bookCard.primaryAction"]').eq(0);
  }

  //notifikacija za uspesno log activity
  get successfulLogReadingNotification() {
    return cy.get('div button[aria-label="close"]');
  }

  get saveLogReadingBtn() {
    return cy.get('button[data-cy="proceed.modal"]');
  }

  get timeSpent() {
    return cy.get('input[id="minutes.spent"]');
  }

  get startPage() {
    return cy.get('input[id="start.page"]');
  }
  get endPage() {
    return cy.get('input[id="end.page"]');
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

  selectDate(date) {
    return cy.get(`[aria-label*="${date}"]`).click({ force: true });
  }

  clickBookDivElement(element) {
    return cy.get(`:nth-child(${element}}) > .BookCard__Card-sc-1ptoufd-0`);
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

  get notificationContainer() {
    return cy.get(".Toastify__toast-container");
  }

  get calendarBackBtn() {
    return cy.get(".DayPicker-NavButton--prev");
  }

  get searchForBookInput() {
    return cy.get('input[id="book-name"]');
  }

  get readingType() {
    return cy.get('input[name="reading.type"][type="radio"]');
  }

  get listOfBooks() {
    return cy.get('[data-cy="book-link"]');
  }

  get calendar() {
    return cy.get('div[role="grid"]');
  }

  get divEndPage() {
    // return
  }

  get errorStartPage() {
    return cy.get('div[name="error.start.page"]');
  }

  get errorLaterPage() {
    return cy.get('div[name="error.end.page"]');
  }

  get errorTimeSpentMessage() {
    return cy.get('div[name="error.minutes.spent"]');
  }

  findBookText(text) {
    return cy
      .get('div[aria-label="Add new book"]')
      .find(`img[alt*="${text}"]`)
      .next();
  }

  newLogReadingActivity({
    readDate = activity.date_today,
    startPage = 1,
    endPage = activity.null,
    timeSpent = activity.null,
    errorMessage = activity.emptyString,
    numberOfPages,
    successfull = true,
  }) {
    this.logReadingBtn.eq(0).click({ force: true }); // click on first element
    this.logReadingModal.should("be.visible");
    if (successfull) {
      this.timeSpent.clear().type(timeSpent);
      this.endPage.type(endPage);
      this.saveLogReadingBtn.should("not.be.disabled");
      cy.intercept("**/user/readProgress").as("interceptLog");
      this.saveLogReadingBtn.click({ force: true });
      cy.wait("@interceptLog").then(() => {
        this.notificationContainer.should(
          "contain.text",
          activity.successfullLogNotification
        );
      });
      return;
    } else {
      this.timeSpent.clear().type(timeSpent);
      this.startPage.clear().type(startPage);
      this.endPage.clear().type(endPage);

      if (startPage !== 1 && startPage !== data.null) {
        this.logReadingModal.should("contain", errorMessage);
      }

      if (endPage > 100) {
        this.startPage.click().type(`{backspace}`);
        this.logReadingModal.should("contain", errorMessage);
        //return;
      }

      if (timeSpent !== null) {
        this.logReadingModal.should("contain", errorMessage);
      }

      if (endPage < startPage) {
        this.saveLogReadingBtn.click();
        this.logReadingModal.should(
          "contain",
          activity.errorMessages.laterStartPage
          // "Please enter an end page that is later than the start page"
        );
        return;
      }
      this.saveLogReadingBtn.should("be.disabled");
    }
  }

  logReadingActivity({
    readDate,
    startPage, //1
    endPage,
    timeSpent,
    successfull = true,
    errorMessages = activity.emptyString,
  }) {
    cy.intercept("**/user/readProgress").as("interceptLog");
    this.logReadingBtn.click({ force: true });
    this.logReadingModal.should("be.visible");
    if (successfull) {
      this.timeSpent.type(timeSpent);
      this.endPage.clear().type(endPage);
      this.dateOfReading.should("have.value", readDate);
      this.startPage.clear().type(startPage);
      this.startPage.click().type(`{backspace}`);
      this.startPage.should("have.value", startPage);
      this.saveLogReadingBtn.should("not.be.disabled");
      this.saveLogReadingBtn.click({ force: true });
      cy.wait("@interceptLog").then(() => {
        this.notificationContainer.should(
          "contain.text",
          activity.successfullLogNotification
        );
      });
    } else {
      this.endPage.clear().type(endPage);
      this.startPage.clear().type(startPage);
      this.startPage.click().type(`{backspace}`);
      this.logReadingModal.click();
      this.startPage.should("have.value", startPage);
      this.logReadingModal.click("left");
      if (this.startPage !== startPage) {
        if (this.startPage > this.endPage) {
          this.logReadingModal.click("left");
          this.saveLogReadingBtn.click({ force: true });
          this.errorLaterPage.should(
            "contain.text",
            activity.errorMessages.laterStartPage
          );
        } else {
          this.saveLogReadingBtn.should("be.disabled");
          this.errorStartPage.should("be.visible");
        }
        this.saveLogReadingBtn.click({ force: true });
      }

      if (this.timeSpent !== timeSpent) {
        this.timeSpent.type(timeSpent);
        this.errorTimeSpentMessage.should(
          "contain.text",
          activity.errorMessages.timeSpent
        );
        this.saveLogReadingBtn.click({ force: true });
      }
      this.saveLogReadingBtn.should("be.disabled");
    }
  }

  fillAddBook({
    bookName = bookData.bookName,
    bookNumber = 1,
    typeOfBook = bookData.bookTypePaper,
    numberOfPages, //= bookData.null,
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
        if (typeOfBook !== bookData.empty_string) {
          this.typeOfBook.check(typeOfBook, { force: true });
        }
        // if (numberOfPages !== bookData.null) {
        //   this.getNumberOfPages.clear().type(numberOfPages);
        // }
        myReading.findBookText(bookData.bookName).then((text) => {
          expect(text).to.have.text("The Hobbit");
          //this.clickBookDivElement(1);
          this.getSaveBtn.click();
          this.bookAddedNotification
            .should("be.visible")
            .and("have.text", "Book added");
          this.listOfBooks.should("be.visible").and("contain", bookName);
        });
      } else {
        if (bookName === bookData.bookForDeletion) {
          this.getModalDialog.should("be.visible");
          this.deleteBookTitleBtn.click({ force: true });
          this.getModalDialog.click("right", { force: true });
          this.getModalDialog.should(
            "contain.text",
            bookData.errorMessage.noTitle
          );
        }
        // this was redudant code, i do this already in my if statement
        // this.getModalDialog.should("contain.text", errorMessage);
        this.getSaveBtn.should("be.disabled");
      }
    });
  }
}

export const myReading = new MyReading();
