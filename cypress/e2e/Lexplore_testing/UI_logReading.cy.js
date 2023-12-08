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
      myReading.fillAddBook({ success: true });
    });

    it.only("Happy flow with new log reading activity", () => {
      myReading.newLogReadingActivity({
        timeSpent: activity.minuteSpent,
        endPage: activity.five_page,
        successfull: true,
      });
    });

    it.skip("Calendar", () => {
      myReading.logReadingBtn.click({ force: true });
      myReading.dateOfReading.click({ force: true });
      myReading.calendar.should("be.visible");
      myReading.calendarBackBtn.click({ force: true });
      myReading.selectDate(12);
    });
  });

  // negativni case, ne zaboraviti na error message da assertujem
  context("Bad cases", () => {
    beforeEach(() => {
      myReading.fillAddBook({});
    });

    it("End page is 0", () => {
      myReading.newLogReadingActivity({
        timeSpent: activity.minuteSpent,
        endPage: activity.backspace,
        successfull: false,
      });
    });

    it("End page > number of pages", () => {
      myReading.newLogReadingActivity({
        timeSpent: activity.minuteSpent,
        endPage: 300,
        successfull: false,
        errorMessage: activity.errorMessages.endPageBiggerThanTotalPages,
      });
    });

    it("Time spent is 0", () => {
      myReading.newLogReadingActivity({
        timeSpent: activity.zero_page,
        endPage: activity.five_page,
        successfull: false,
      });
    });

    it("Start page is 0", () => {
      myReading.newLogReadingActivity({
        startPage: activity.zero_page,
        endPage: activity.five_page,
        timeSpent: activity.minuteSpent,
        errorMessage: activity.errorMessages.startPage,
        successfull: false,
      });
    });

    // ok works
    it("Empty time spent", () => {
      myReading.newLogReadingActivity({
        timeSpent: activity.zero_page,
        endPage: activity.five_page,
        errorMessage: activity.errorMessages.timeSpent,
        successfull: false,
      });
    });

    // ok
    it("Time spent is random string", () => {
      myReading.newLogReadingActivity({
        timeSpent: activity.random_text,
        endPage: activity.five_page,
        errorMessage: activity.errorMessages.timeSpent,
        successfull: false,
      });
    });

    it("Start page > end Page", () => {
      myReading.newLogReadingActivity({
        timeSpent: activity.minuteSpent,
        startPage: activity.five_page,
        endPage: activity.page_one,
        successfull: false,
      });
    });

    it("End page 101 pages ahead of start page", () => {
      myReading.newLogReadingActivity({
        timeSpent: activity.minuteSpent,
        endPage: activity.page101,
        successfull: false,
        errorMessage: activity.errorMessages.endPage101Ahead,
      });
    });

    it("Start page is 0 or empty string", () => {
      myReading.newLogReadingActivity({
        startPage: 0,
        endPage: 1,
        timeSpent: 1,
        successfull: false,
      });
    });

    afterEach(() => {
      bookApi.getAllBooks().then((books) => {
        books.forEach((book) => {
          bookApi.deleteBook({ bookId: book.bookId });
        });
      });
    });
  });

  // after everything not working if doing only negative cases because
  // there is nothing to delete... (make it better IF or something)
  afterEach(() => {
    bookApi.getAllBooks().then((books) => {
      books.forEach((book) => {
        bookApi.deleteBook({ bookId: book.bookId });
      });
    });
  });
});
