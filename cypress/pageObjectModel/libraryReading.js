/// <reference types="cypress" />
import bookApi from "../api/books";

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

  get showProgressBtn() {
    return cy.get('[data-cy="show.progress"]');
  }

  get backBtn() {
    return cy.get('div[data-cy="back.btn"]');
  }

  get btnStartReading() {
    return cy.get('[data-cy="start.read.book"]');
  }

  get bookProgressPercentage() {
    return cy.get('[data-cy="book.progress"]');
  }

  bookReadingBtn(num) {
    return cy.get("button[data-cy='bookCard.primaryAction']").eq(`${num}`);
  }

  clickOnWantedBook(num) {
    return cy.get(
      `:nth-child(${num}) > .BookCard__Card-sc-1ptoufd-0 > [data-cy="book-link"]`
    );
  }

  // dobro ok, sada mi radi, switch za te 3 opcije
  readingProgress({ option }) {
    cy.intercept("**/details").as("interceptDetails");
    this.clickOnWantedBook(option).click();
    cy.wait("@interceptDetails").then((response) => {
      console.log(response, "MY RESPONSE"); //ok dosao je do ovde i tu mu je ceo body
      let type = response.response.body.type;
      console.log(type);
      let numberOfPages = response.response.body.numberOfPages;
      console.log(numberOfPages, "NUMBER OF PAGES"); // dobar broj stranica
      this.btnStartReading.click(); // da li ga klikne? SADA DA

      switch (type) {
        case "GULHOJ":
          console.log(" u gulhoju sam");
          for (let i = 1; i < numberOfPages; i++) {
            this.gullhoiNavigateRight.should("be.visible");
            this.gullhoiNavigateRight.click();
          }
        case "EPUB":
          console.log("u epubu sam");
          for (let i = 1; i < numberOfPages; i++) {
            this.gullhoiNavigateRight.should("be.visible");
            this.gullhoiNavigateRight.click();
          }
        case "":
      }
    });
    // });
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
      console.log(response, "Response body for book details");
      //return response.body;
    });
  }
  /*
Api read/page koji je POST i on nam sluzi za evidentiranje citanja stranice
evidentiracu to tako sto cu cekati intercept nakon klika na ono dugmence
*/

  /*
  resetovanje stanja na pocetno za sve knjige
*/
  resetReadingBook() {
    this.getAllBooksFromLibrary().then((books) => {
      // books.forEach(book.)
    });
  }

  //obican klik sa interceptom
  // sacekaj da se modeljson ocita onda klikni na dugme onoliko puta koliko zelis counter?
  // 2 intercepta i 1 for i to bi trebalo da bude to
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
