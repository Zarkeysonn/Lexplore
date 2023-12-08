import data from "../../fixtures/data.json";
import login from "../../api/auth";
import loginData from "../../fixtures/login.json";
import { navigation } from "../../pageObjectModel/navigation";
import { library } from "../../pageObjectModel/libraryReading";
import bookApi from "../../api/books.js";

describe("Reading book", () => {
  before(() => {
    library.unreadBook({
      books: [data.gulhojBook, data.epubBook, data.tbaBook], //lerke mi ne vrati na 0
    });
    cy.viewport(1280, 720);
  });
  beforeEach(() => {
    login.login({});
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

    it.only("Read tba book", () => {
      library.readingProgress({ bookName: data.tbaBook, option: 1 });
    });
  });

  // 8523 knjiga / Moley and the fox - Moley 1

  after(() => {
    library.unreadBook({
      books: [data.gulhojBook, data.epubBook, data.tbaBook],
    });
  });
});
