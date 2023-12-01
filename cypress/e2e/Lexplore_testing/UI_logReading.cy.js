import activity from "../../fixtures/activity_data.json";
import { myReading } from "../../pageObjectModel/myReading";
import login from "../../api/auth.js";
import loginStudent from "../../fixtures/login.json";
import data from "../../fixtures/data.json";
import { navigation } from "../../pageObjectModel/navigation";
import bookApi from "../../api/books";

describe("Log reading processes", () => {
  beforeEach(() => {
    login.login({});
    cy.url().should("eq", loginStudent.homePageUrl);
    navigation.navigateTo(data.navigateTo.myReading);
  });

  context("Good Log reading process", () => {
    beforeEach(() => {
      //navigation.navigateTo(data.navigateTo.myReading);
      //
      myReading.fillAddBook({});
    });
    it("Happy flow HARDCODED", () => {
      myReading.logReadingBtn.click({ force: true });
      myReading.logReadingModal.should("be.visible");
      myReading.dateOfReading.should("have.value", "today");
      myReading.dateOfReading.click();
      myReading.calendar.should("be.visible");
      myReading.timeSpent.type(3);
      myReading.timeSpent.should("have.value", 3);
      myReading.endPage.type(1);
      myReading.endPage.should("have.value", 1);
      myReading.saveLogReadingBtn.click({ force: true });
      //treba mi neki intercept koji ce mi proveriti da li se ovo desilo nakon
      //klika na save dugme
      myReading.bookAddedNotification.should("be.visible");
    });
    // radi kada je okej
    it("Happy flow with FUNCTION", () => {
      myReading.logReadingActivity({});
    });
  });
  // negativni case
  context.only("Bad cases", () => {
    beforeEach(() => {
      myReading.fillAddBook({});
    });

    //error messages?
    it("Empty endPage", () => {
      myReading.logReadingActivity({
        endPage: activity.zero_page,
        successfull: false,
      });
    });

    it("Empty timeSpent", () => {
      myReading.logReadingActivity({
        timeSpent: activity.zero_page,
        errorMessages: activity.errorMessages.timeSpent,
        successfull: false,
      });
    });

    it("Time spent random string", () => {
      myReading.logReadingActivity({
        timeSpent: activity.random_text,
        successfull: false,
      });
    });

    // case when start page > end page value
    it.only("Start page bigger than end page", () => {
      //nije mi okej funkcija za ovaj slucaj jer je ovo prvobitno ok
      //zato sto save nije odmah disableovan
      myReading.startPage;
      myReading.getSaveBtn.should("be.disabled");
      myReading.logReadingModal.should(
        "contain.text",
        activity.errorMessages.laterStartPage
      );
    });

    //probati ovde sa after each delete da nije problem tu
    afterEach(() => {
      bookApi.getAllBooks().then((books) => {
        books.forEach((book) => {
          bookApi.deleteBook({ bookId: book.bookId });
        });
      });
    });
  });
  //after ludace
  after(() => {
    bookApi.getAllBooks().then((books) => {
      books.forEach((book) => {
        bookApi.deleteBook({ bookId: book.bookId });
      });
    });
  });
});
