/// <reference types="cypress" />

import { navigation } from "../../pageObjectModel/navigation";
import { homePage } from "../../pageObjectModel/homePage";
import loginStudent from "../../fixtures/login.json";
import bookApi from "../../api/books";
import activity from "../../fixtures/activity_data.json";
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
    navigation.navigateTo(data.navigateTo.myReading);
  });

  context("Happy", () => {
    it("Happy flow", () => {
      myReading.fillAddBook({});
    });
  });

  context("Negative scenarios for adding book", () => {
    it("Number of pages is clear", () => {
      myReading.fillAddBook({
        numberOfPages: 0,
        success: false,
        errorMessage: bookData.errorMessage.numberOfPages,
      });
    });

    it("Number of pages is empty array", () => {
      myReading.fillAddBook({
        numberOfPages: `${bookData.empty_array}`,
        success: false,
      });
    });

    it("Title is empty", () => {
      myReading.fillAddBook({
        bookName: bookData.bookForDeletion,
        success: false,
      });
    });
  });

  after(() => {
    bookApi.getAllBooks().then((books) => {
      books.forEach((book) => {
        bookApi.deleteBook({ bookId: book.bookId });
      });
    });
  });
});
