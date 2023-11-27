import { navigation } from "../../pageObjectModel/navigation";
import loginStudent from "../../fixtures/login.json";
import bookApi from "../../api/books";

//posto radim proces dodavanja knjiga, razmisliti o before i afterEachu
describe("Add book proccess with UI testing", () => {
  // before?

  it("Login and click on some button", () => {
    cy.visit(loginStudent.student1, { timeout: 30000 });
    cy.url().should("eq", "https://appdev.lexplore.com/student/home");
    navigation.clickMyReading();
    cy.url().should("eq", "https://appdev.lexplore.com/student/diary");
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
