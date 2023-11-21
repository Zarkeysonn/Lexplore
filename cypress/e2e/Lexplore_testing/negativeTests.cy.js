/// <reference types="cypress" />
import bookApi from "../../api/books";

let devSessionId;

describe("Negative tests for whole proccess", () => {
  beforeEach(() => {
    devSessionId = cy.loginFromBackend();
  });

  it("Add book when authors is not array of objects", () => {
    bookApi.postBook({
      cookie: devSessionId,
      authors: "Mica Pita",
      statusCode: 422,
    });
  });

  it("Add book when author name is number", () => {
    bookApi.postBook({
      cookie: devSessionId,
      authors: 38312903,
      statusCode: 422,
    });
  });

  // after(() => {
  //   bookApi.getAllBooks().then((books) => {
  //     books.forEach((book) => {
  //       bookApi.deleteBook({ devSessionId: devSessionId, bookId: book.bookId });
  //     });
  //   });
  // });
});
