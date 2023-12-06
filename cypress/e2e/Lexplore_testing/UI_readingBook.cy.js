import data from "../../fixtures/data.json";
import login from "../../api/auth";
import loginData from "../../fixtures/login.json";
import { navigation } from "../../pageObjectModel/navigation";
import { library } from "../../pageObjectModel/libraryReading";
import bookApi from "../../api/books.js";

describe("Reading book", () => {
  beforeEach(() => {
    library.unreadBook({
      books: [data.gulhojBook, data.epubBook, data.tbaBook],
    });
    cy.viewport(1280, 720);
    login.login({});

    //cy.url().should("eq", loginData.homePageUrl);
    navigation.navigateTo(data.navigateTo.library);
    library.restartReadPages({ bookId: data.whalesBookID });
  });
  context("Read book to the end", () => {
    it("Read gulhoj book to the end", () => {
      library.readingProgress({ bookName: data.gulhojBook, option: 1 });
      //bookApi.restartReadPages({ bookId: data.whalesBookID });
    });

    it("Read EPUB book", () => {
      library.readingProgress({ bookName: data.epubBook, option: 1 });
    });

    it("Read tba book", () => {
      library.readingProgress({ bookName: data.tbaBook, option: 1 });
    });
  });

  afterEach(() => {
    //
    // bookApi.restartReadPages({
    //   bookId:
    // })
  });
});
