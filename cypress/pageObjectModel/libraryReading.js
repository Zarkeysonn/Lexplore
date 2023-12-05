/// <reference types="cypress" />

class Library {
  get firstBook() {
    return cy.get(
      ':nth-child(1) > .BookCard__Card-sc-1ptoufd-0 > [data-cy="book-link"]'
    );
  }

  get gullhoiNavigateRight() {
    return cy.get('div[data-cy="navigate.right"] img');
  }

  get backBtn() {
    return cy.get('div[data-cy="back.btn"]');
  }

  bookReadingBtn(num) {
    return cy.get("button[data-cy='bookCard.primaryAction']").eq(`${num}`);
  }

  clickOnWantedBook(num) {
    return cy.get(
      `:nth-child(${num}) > .BookCard__Card-sc-1ptoufd-0 > [data-cy="book-link"]`
    );
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

  readingProgress(
    {
      // params
    }
  ) {
    // body
  }
}

export const library = new Library();
