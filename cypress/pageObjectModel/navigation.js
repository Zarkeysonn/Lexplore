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

  get library() {
    return cy.get("a[href='/student/library'][type='button']");
  }

  get quizz() {
    return cy.get("a[href='/student/quizzes'][type='button']");
  }

  navigateTo(option) {
    switch (option) {
      case "myReading":
        this.getMyReading.click({ force: true });
        cy.url().should("contain", "student/diary");
        break;

      case "library":
        this.library.click({ force: true });
        cy.url().should("contain", "/library");
        break;

      case "quizz":
        this.quizz.click({ force: true });
        cy.url().should("contain", "/quizzes");
        break;
    }
  }
}

export const navigation = new Navigation();
