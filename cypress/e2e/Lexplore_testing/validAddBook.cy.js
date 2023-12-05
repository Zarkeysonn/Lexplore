import { navigation } from "../../pageObjectModel/navigation";
import book from "../../fixtures/data.json";
import bookApi from "../../api/books.js";
let devSessionId;
let bookId;

describe("Valid process of adding new book", () => {
  beforeEach(() => {
    devSessionId = cy.loginFromBackendWithSession();
  });

  it("Add book with hard coded data", () => {
    cy.addBook({ cookie: devSessionId });
  });

  it("Add Valid book with only cookie", () => {
    cy.addBook({ cookie: devSessionId });
  });

  it("Add book with module postBook", () => {
    bookApi.postBook({ cookie: devSessionId }).then((book) => {
      bookId = book;
    });
  });

  it("Add Valid book with valid title", () => {
    cy.addBook({ cookie: devSessionId, title: "mica car" });
  });

  it("Add Valid book when isbn is a string", () => {
    cy.addBook({
      cookie: devSessionId,
      isbn: "will this work",
      statusCode: 422,
    });
  });

  //pokusao iz fixturea
  it("Add book with author from fixtures", () => {
    cy.addBook({ cookie: devSessionId, author: book.authors });
  });

  it("Add book without cookie in parameters", () => {
    cy.addBook({ author: book.authors });
  });

  after(() => {
    bookApi.getAllBooks().then((books) => {
      books.forEach((book) => {
        bookApi.deleteBook({ devSessionId: devSessionId, bookId: book.bookId });
      });
    });
  });
});
