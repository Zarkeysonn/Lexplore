/// <reference types="cypress" />

import { navigation } from "../../pageObjectModel/navigation";
import { homePage } from "../../pageObjectModel/homePage";
import loginStudent from "../../fixtures/login.json";
import bookApi from "../../api/books";
import { myReading } from "../../pageObjectModel/myReading";
import bookData from "../../fixtures/addNewBook.json";
import data from "../../fixtures/data.json";
import login from "../../api/auth";

//exportovao sam iz myReading klasu, mogu koristiti ovde
//posto radim proces dodavanja knjiga, razmisliti o before i afterEachu
describe("Add book proccess with UI testing", () => {
  beforeEach(() => {
    login.login({});
    cy.url().should("eq", loginStudent.homePageUrl);
  });

  context("Happy", () => {
    it("Happy flow", () => {
      navigation.navigateTo(data.navigateTo.myReading);
      cy.url().should("include", "/student/diary");
      myReading.fillAddBook({});
    });
  });

  context.skip("Positive scenario for adding book", () => {
    it("Login, go to My Reading and add valid book", () => {
      navigation.navigateTo(data.navigateTo.myReading); //this should work
      cy.url().should("include", "/student/diary");
      myReading.fillAddBook({
        inputBook: bookData.inputBook,
        bookNumber: 1,
        bookType: bookData.bookTypeDigital,
        success: true,
      });
      myReading.getSaveBtn.click();
      myReading.bookAddedNotification.should("have.text", "Book added");
    });
  });

  context("Negative scenarios for adding book", () => {
    it("Number of pages is clear", () => {
      navigation.navigateTo(data.navigateTo.myReading); //will this work?
      myReading.fillAddBook({
        numberOfPages: 0,
        success: false,
        errorMessage: bookData.errorMessage.numberOfPages,
      });
    });

    it("Number of pages is empty array", () => {
      navigation.navigateTo(data.navigateTo.myReading);
      cy.url().should("include", "/student/diary");
      myReading.fillAddBook({
        numberOfPages: `${bookData.empty_array}`,
        success: false,
      });
    });

    it("Title is empty", () => {
      navigation.navigateTo(data.navigateTo.myReading);
      myReading.getSearchForBook.type(bookData.bookName);
      myReading.desiredOption(1).click({ force: true });
      myReading.getModalDialog.should("be.visible");
      myReading.deleteBookTitleBtn.click();
      myReading.getModalDialog.click("right", { force: true });
      myReading.getModalDialog.should(
        "contain.text",
        bookData.errorMessage.noTitle
      );
    });
  });

  after(() => {
    bookApi.getAllBooks().then((books) => {
      console.log(books);
      books.forEach((book) => {
        bookApi.deleteBook({ bookId: book.bookId });
      });
    });
  });
});
