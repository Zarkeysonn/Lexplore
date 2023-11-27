class Navigation {
  get getHomeBtn() {
    return cy.get('xmlns="http://www.w3.org/2000/svg"');
  }

  get getMyReading() {
    //return cy.get('data-cy="nav.my.books.tab"')
    return cy.get('[data-cy="nav.my.books.tab"] > span');
  }

  get getHomePageAddBook() {
    return cy.get(".jMuduO > span");
  }

  clickAddBook() {
    this.getHomePageAddBook.click({ force: true });
  }

  clickHomeBtn() {
    this.getHomeBtn.click({ force: true });
  }

  clickMyReading() {
    this.getMyReading.click({ force: true });
  }

  toMyReadingPage() {
    this.clickHomeBtn(); //ovo je mozda i visak?
    this.clickMyReading();
  }
}

export const navigation = new Navigation();
