// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//baseUrl apiURl
import data from "../fixtures/data.json";

Cypress.Commands.add("loginFromBackend", () => {
  let cookie;
  cy.intercept(`**/lastPerBook`) //ovako uvek da radimo sa interceptovima
    //cy.intercept(Cypress.env('interceptUrl'))
    .as("interceptLogin");
  cy.visit("");
  cy.wait("@interceptLogin").then((response) => {
    cookie = response.request.headers.cookie;
  });
  return cookie;
});

Cypress.Commands.add(
  "addBookWithHardCodeData",
  ({
    method = "",
    failOnStatusCode = false,
    url = "",
    authors = "",
    //authors = data.authors,
    coverUrl = "",
    cookie = "",
    description = "Hard coded desc",
    format = "paper", //obavezan parametar izgleda...
    genres = ["Fiction"],
    //genres = data.genres,
    isbn = "",
    numberOfPages = 123,
    publisher = "Vulkan",
    title = "Hard coded title",
  }) => {
    cy.request({
      method: "PUT",
      failOnStatusCode: failOnStatusCode,
      url: `${Cypress.env("apiOrigin")}/books`, //ovako
      body: {
        authors: ["Dzord Martinovic"],
        coverUrl:
          "https://books.google.com/books/content?id=bIZiAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        //coverUrl: coverUrl, ovaj link iznad staviti u fixtures
        description: "Hard coded desc", //"Fantasy-roman.",
        format: "paper", //"paper",
        genres: genres, //["Fiction"],
        isbn: isbn, //"",
        numberOfPages: numberOfPages, //876
        publisher: publisher, //"Bantam",
        title: title, //"A Game of Thrones",
      },
      headers: {
        Cookie: `${cookie.name}=${cookie.value}`,
      },
    }).then((response) => {
      console.log(response);
      //expect(response.status).to.eql(200);
    });
  }
);

Cypress.Commands.add(
  "addBook",
  ({
    method = data.method,
    failOnStatusCode = false,
    url = "",
    //authors = ['George R. R. Martin'],
    authors = data.authors,
    coverUrl = "",
    cookie = "",
    description = data.description,
    format = data.format, //obavezan parametar izgleda...
    //genres = ["Fiction"],
    genres = data.genres,
    isbn = data.isbn,
    numberOfPages = data.numberOfPages,
    publisher = data.publisher,
    title = data.title,
    statusCode = 200,
  }) => {
    cy.request({
      method: "PUT",
      failOnStatusCode: failOnStatusCode,
      url: `${Cypress.env("apiOrigin")}/books`, //ovako
      body: {
        authors: authors,
        //coverUrl: "https://books.google.com/books/content?id=bIZiAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        coverUrl: coverUrl,
        description: description, //"Fantasy-roman.",
        format: format, //"paper",
        genres: genres, //["Fiction"],
        isbn: isbn, //"",
        numberOfPages: numberOfPages, //876
        publisher: publisher, //"Bantam",
        title: title, //"A Game of Thrones",
      },
      headers: {
        Cookie: cookie,
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eql(statusCode);
    });
  }
);

Cypress.Commands.add(
  "addInvalidBook",
  ({
    method = data.method,
    failOnStatusCode = false,
    url = data.url,
    //authors = ['George R. R. Martin'],
    authors = data.authors,
    coverUrl = data.coverUrl,
    cookie = "",
    description = data.description,
    format = data.format, //obavezan parametar izgleda...
    //genres = ["Fiction"],
    genres = data.genres,
    isbn = data.isbn,
    numberOfPages = data.numberOfPages,
    publisher = data.publisher,
    title = data.title,
  }) => {
    cy.request({
      method: method,
      failOnStatusCode: failOnStatusCode,
      url: `${Cypress.env("apiOrigin")}/books`, //ovako
      body: {
        authors: authors,
        //coverUrl: "https://books.google.com/books/content?id=bIZiAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        coverUrl: coverUrl,
        description: description, //"Fantasy-roman.",
        format: format, //"paper",
        genres: genres, //["Fiction"],
        isbn: isbn, //"",
        numberOfPages: numberOfPages, //876
        publisher: publisher, //"Bantam",
        title: title, //"A Game of Thrones",
      },
      headers: {
        Cookie: `${cookie.name}=${cookie.value}`,
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eql(401);
    });
  }
);

//read PRogress
Cypress.Commands.add("readProgress", () => {
  //log za knjige
});
