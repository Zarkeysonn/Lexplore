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

  toMyReadingPage() {
    this.clickHomeBtn(); //ovo je mozda i visak?
    this.clickMyReading();
  }

  navigateTo(option) {
    switch (option) {
      case "myReading":
        this.getMyReading.click({ force: true });
        cy.url().should("contain", "student/diary");
        break;
    }
  }
}

export const navigation = new Navigation();
