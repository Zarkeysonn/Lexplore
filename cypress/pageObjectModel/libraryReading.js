/// <reference types="cypress" />
import bookApi from "../api/books";
//import bookApi from "../api/books.js";
import login from "../api/auth";
//import login from "../../api/auth.js";
import { navigation } from "./navigation";
import data from "../fixtures/data.json";
//import { data } from "cypress/types/jquery/index.js";

class Library {
  get firstBook() {
    return cy.get(
      ':nth-child(1) > .BookCard__Card-sc-1ptoufd-0 > [data-cy="book-link"]'
    );
  }

  get nextPageBtn() {
    return cy.get("");
  }

  get gullhoiNavigateRight() {
    return cy.get('[data-cy="navigate.right"]');
  }

  get testNavigeRightBtn() {
    return cy.get(
      '[data-cy="navigate.right"] > .Button__ButtonIcon-sc-19a8nvk-0'
    );
  }

  get epubProgressBtn() {
    return cy.get('[data-cy="menu.btn"]');
  }

  get showProgressBtn() {
    return cy.get('[data-cy="show.progress"]');
  }

  get backBtn() {
    return cy.get('div[data-cy="back.btn"]');
  }

  // nisam uspeo da asertujem da se ovo pojavilol i da se vidi na kraju
  get epubInfo() {
    return cy.get(".Toastify__toast-container").scrollIntoView();
  }

  get btnStartReading() {
    return cy.get('[data-cy="start.read.book"]');
  }

  get bookProgressPercentage() {
    return cy.get('[data-cy="book.progress"]');
  }

  get epubBookProgress() {
    return cy.get('[data-cy="book.precentage"]');
  }

  get tbaNavigateRight() {
    return cy.get('[data-cy="navigate.right"]');
  }

  get tbaProgressBtn() {
    return cy.get('[data-cy="menu.btn"]');
  }

  get tbaReturnBtn() {
    return cy.get('[data-cy="back.btn"]');
  }

  get bookInputField() {
    return cy.get('[data-cy="search.book.input"]');
  }
  bookReadingBtn(num) {
    return cy.get("button[data-cy='bookCard.primaryAction']").eq(`${num}`);
  }

  clickOnWantedBook(num) {
    return cy.get(
      `:nth-child(${num}) > .BookCard__Card-sc-1ptoufd-0 > [data-cy="book-link"]`
    );
  }

  // micino
  unreadBook({ books = data.emptyArray /*, option = 1 */ }) {
    cy.intercept("**/details").as("getBookId");
    cy.intercept("**").as("displayBooks");
    books.forEach((bookName) => {
      login.login({}); // sta je meni login? -//- NADJENO
      navigation.navigateTo(data.navigateTo.library);
      this.bookInputField.clear({ force: true }).type(bookName);
      cy.wait("@displayBooks").then(() => {
        this.clickOnWantedBook(1).click({ force: true });
        //cy.get(`li:nth-of-type(${option}) img`).click({ force: true });
      });
      cy.wait("@getBookId").then((response) => {
        console.log(response);
        let book_ID = response.response.body.bookId;
        //let bookId = response.response.body.bookId;
        cy.log(book_ID, "BOOKIC ID");
        this.restartReadPages({ bookId: book_ID });
      });
    });
  }

  restartReadPages({
    method = "POST",
    url = `${Cypress.env("apiOrigin")}/user/readProgress`,
    bookId = "",
    resumeInformation = { lastReadPage: 0 },
    //readingSessionId,
    userId = 257919,
  }) {
    const dataS = `${this.generateString(9)}`;
    return cy
      .request({
        method: method,
        url: url,
        failOnStatusCode: false,
        body: {
          readingActivityData: {
            bookId: bookId,
            pages: [{ pageIndex: 0, duration: 1400, timeStamp: 1701865159 }],
            resumeInformation: resumeInformation,
            readingSessionId: dataS,
            userId: userId,
          },
        },
      })
      .then((response) => {
        expect(response.status).eq(200);
      });
  }

  generateString(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  // dobro ok, sada mi radi, switch za te 3 opcije
  readingProgress({ bookName, option }) {
    cy.intercept("**/details").as("interceptDetails");
    this.bookInputField.clear().type(bookName);
    this.clickOnWantedBook(option).click();
    cy.wait("@interceptDetails").then((response) => {
      console.log(response, "MY RESPONSE"); //ok dosao je do ovde i tu mu je ceo body
      let type = response.response.body.type; //da li mi je type ok?
      console.log(type);
      let numberOfPages = response.response.body.numberOfPages;
      console.log(numberOfPages, "NUMBER OF PAGES"); // dobar broj stranica
      this.btnStartReading.click(); // da li ga klikne? SADA DA

      switch (type) {
        case "GULHOJ":
          console.log(" u gulhoju sam");
          for (let i = 1; i < numberOfPages; i++) {
            //cy.wait(4001);
            //cy.wait(1000);
            this.gullhoiNavigateRight.should("be.visible");
            this.gullhoiNavigateRight.click();
          }
          this.showProgressBtn.should("be.visible").click();
          this.bookProgressPercentage.should("have.text", "100%");
          break;
        case "EPUB":
          // ovde imam i notification well done
          cy.wait(2000);
          console.log("u epubu sam");
          cy.intercept("**/read/page").as("interceptSessionId");
          for (let i = 1; i <= numberOfPages; i++) {
            //cy.wait(4001);
            cy.wait(1000);
            this.testNavigeRightBtn.should("be.visible");
            this.testNavigeRightBtn.click({ force: true });
          }
          this.epubProgressBtn.should("be.visible").click();
          this.epubBookProgress.should("have.text", "98% ");
          break;
        case "TBA":
          // dokle god nije disableovan nije stigao do kraja
          console.log("u tba sam");
          for (let i = 1; i <= numberOfPages; i++) {
            //cy.wait(4001);
            cy.wait(1000);
            this.tbaNavigateRight.should("be.visible");
            this.tbaNavigateRight.click({ force: true });
          }

          this.tbaNavigateRight.should("not.be.enabled");
          this.tbaProgressBtn.should("be.visible").click();
          // this.tbaReturnBtn.click();
          // procita do kraja, jos asertovati da je npr za ovaj primer 8 / 8 procitano?
          break;
      }
    });
  }

  // importujem ovaj fajl u cy.js i onda pozovem ovu funkciju u beforeu i
  // uzmem bookId i prosledim ga u klik na neku zeljenu knjigu
  // zatim u details prosledim isti taj bookID apiu
  getAllBooksFromLibrary() {
    return cy
      .request({
        method: "GET",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/books?libraryType=eLibrary`,
      })
      .then((response) => {
        console.log(response, "All books");
        return response.body;
      });
  }

  getBookID(option) {
    cy.intercept("**/details").as("interceptDetails");
    this.clickOnWantedBook(option).click();
    cy.wait("@interceptDetails").then((response) => {
      //console.log(response, "Response body for book details");
      return response.body;
    });
  }

  resetReadingBook() {
    this.getAllBooksFromLibrary().then((books) => {
      books.forEach((book) => {
        //ne treba mi ovaj forEach jer tacno znam koje knjige citam
        let bookId = book.intBookId;
        bookApi.restartReadPages({ bookId: bookId });
      });
    });
  }

  clickButton(num) {
    for (let i = 0; i < num; i++) {
      cy.intercept("**/model.json").as("modelJson");

      this.bookReadingBtn(0).click({ force: true });
      cy.wait("@modelJson").then(() => {
        cy.url().should("contain", "/read");
        cy.intercept("**/sounds").as("readPage");
        cy.wait(2000);
        this.gullhoiNavigateRight.click({ force: true });
        cy.wait("@readPage");
      });
    }
    this.backBtn.click();
  }
}

export const library = new Library();
