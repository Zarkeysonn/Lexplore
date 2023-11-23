import { navigation } from "../../pageObjectModel/navigation";
import book from "../../fixtures/data.json";
import bookApi from "../../api/books.js";
let devSessionId;
let bookId;

// const login = (cookie) => {
//   cy.session(cookie, () => {
//     cy.intercept(`**/lastPerBook`) //ovako uvek da radimo sa interceptovima
//       //cy.intercept(Cypress.env('interceptUrl'))
//       .as("interceptLogin");
//     cy.visit("");
//     cy.wait("@interceptLogin").then((response) => {
//       cookie = response.request.headers.cookie;
//     });
//     return cookie;
//   });
// };

describe("Valid process of adding new book", () => {
  //cy.fixture('data').as('dataJson') //fixture usage
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
    //cy.bookApi.postBook();
    //ne resolvuje promise dok se ne zavrsi IT
    bookApi.postBook({ cookie: devSessionId }).then((book) => {
      bookId = book;
      // bookApi.postActivity({bookId : book.bookId}).then((activity) => {
      //     console.log(activity)
      // })
    });
  });

  //   it.only("Ovde mogu testirati log activity", () => {
  //     bookApi.postActivity({ cookie: devSessionId, bookId: bookId.bookId });
  //   });

  //da li je ovako okej za import podataka? Mica je za pozitivan test inicijalizovao sve dobro vrednosti u commands
  // inicijalizaciji i onda samo ovde prosledim neku pogresnu vrednost... obavezan je onaj cookie
  it("Add Valid book with valid title", () => {
    cy.addBook({ cookie: devSessionId, title: "mica car" });
  });
  // it('Add Valid book', () => {
  //     cy.addBook(devSessionId, title : [])
  // })
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
    // dohvatanje apija koji dohvati sve knjige .. then
    // sa forEach proci kroz sve knjige i dobaviti sve id-jeve od knjiga .. then
    // obrisati svaku pojedinacnu knjigu
    bookApi.getAllBooks().then((books) => {
      books.forEach((book) => {
        bookApi.deleteBook({ devSessionId: devSessionId, bookId: book.bookId });
      });
    });
  });
});
