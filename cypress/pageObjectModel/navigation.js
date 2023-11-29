class Navigation {
  get getHomeBtn() {
    return cy.get('xmlns="http://www.w3.org/2000/svg"');
  }

  get getMyReading() {
    return cy.get("a[href='/student/diary'][type='button']");
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

  navigateTo(option) {
    switch (option) {
      case myReading:
        this.getMyReading
          .click({ force: true })
          .url()
          .should("contain", "student/diary");
      case homePage:
        this.getHomeBtn.click().url().should("contain", "home");
    }
  }
}

export const navigation = new Navigation();
