import { authStudents } from "../../api/auth";
//import addBook from "./validAddBook.cy";
import loginStudent from "../../fixtures/login.json";
import bookApi from "../../api/books.js";

describe("Testing reading acitivity update on added books", () => {
  //moram dobaviti odredjenu knjigu koju dodam i na njoj uraditi post activity
  it("Valid log activity of reading a book", () => {
    let bookId;
    let readingSessionId = "";
    readingSessionId = bookApi.generateString(8);
    console.log(readingSessionId, "READING SESSION ID ");
    authStudents(loginStudent.student1);
    bookApi
      .postBook({
        title: "My new book ZVONCE",
        url: `${Cypress.env("apiOrigin")}/books`, //https://readingservicesdev.lexplore.com/books`,
        statusCode: 200,
      })
      .then((book) => {
        console.log(book, "hello book");
        bookApi.postActivity({
          bookId: book.bookId,
          comment: "",
          date: "2023-11-27T12:56:28.556Z",
          difficultWords: [],
          endPage: 27,
          interestingWords: [],
          minutesSpent: 27,
          numberOfPages: 69,
          readingCompanion: "none",
          readingSessionId: readingSessionId,
          startPage: 1,
        });
      });
  });

  after(() => {
    bookApi.getAllBooks().then((books) => {
      console.log(books);
      books.forEach((book) => {
        bookApi.deleteBook({ bookId: book.bookId });
      });
    });
  });
});
