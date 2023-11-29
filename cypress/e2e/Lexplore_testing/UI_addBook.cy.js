import { navigation } from "../../pageObjectModel/navigation";
import loginStudent from "../../fixtures/login.json";
import bookApi from "../../api/books";
import login from "../../api/auth.js";
import { myReading } from "../../pageObjectModel/myReading";
import bookData from "../../fixtures/addNewBook.json";

//exportovao sam iz myReading klasu, mogu koristiti ovde
//posto radim proces dodavanja knjiga, razmisliti o before i afterEachu
describe("Add book proccess with UI testing", () => {
  beforeEach(() => {
    cy.visit(loginStudent.student1);
  });
  context("Positive scenario for adding book", () => {
    it("Login, go to My Reading and add valid book", () => {
      navigation.clickMyReading();
      cy.url().should("include", "/student/diary");
      myReading.fillAddBook({
        inputBook: bookData.inputBook,
        bookType: bookData.bookTypeDigital,
        success: true,
      });
    });
  });

  context("Negative scenarios for adding book", () => {
    it("Delete book title and try to save", () => {
      navigation.clickMyReading();
      cy.url().should("include", "/student/diary");
      myReading.fillAddBook({
        inputBook: bookData.inputBook,
        bookType: bookData.bookTypeDigital,
      });
      //myReading.modalInputBook.clear();
      myReading.getSearchForBook.eq(0).clear({ force: true });
      myReading.getSaveBtn.should("be.disabled");
      //myReading.getSaveBtn.click({ force: true });
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
