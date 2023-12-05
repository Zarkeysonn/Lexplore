import data from "../fixtures/data.json";
import activity from "../fixtures/activity_data.json";

module.exports = {
  postBook({
    method = data.method,
    failOnStatusCode = false,
    url = `${Cypress.env("apiOrigin")}/books`, //ovako,
    authors = data.authors,
    coverUrl = "",
    description = data.description,
    format = data.format,
    genres = data.genres,
    isbn = data.isbn,
    numberOfPages = data.numberOfPages,
    publisher = data.publisher,
    title = data.title,
    statusCode = 200,
    errorMessage,
  }) {
    return cy
      .request({
        method,
        failOnStatusCode,
        url,
        body: {
          authors: authors,
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
          //Cookie: cookie,
        },
      })
      .then((response) => {
        expect(response.status).to.eql(statusCode);
        if (statusCode === 200) {
          console.log(response.body);
          expect(response.body).to.have.property("bookId");
          //return response.body;
        }
        if (statusCode !== 200 && statusCode !== 404) {
          expect(`${response.body.errors[0].message.text}`).to.eql(
            errorMessage
          );
        }
        return response.body;
      });
  },

  // importujem ovaj fajl u cy.js i onda pozovem ovu funkciju u beforeu i
  // uzmem bookId i prosledim ga u klik na neku zeljenu knjigu
  // zatim u details prosledim isti taj bookID apiu
  getAllBooksFromLibrary() {
    return cy
      .request({
        method: "GET",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/books?libraryType=eLibrary`,
      })
      .then((response) => {
        return response.body;
      });
  },

  /*
  Ovaj api mi treba za dobavljanje odredjene knjige
  Treba da mi vrati numberOfPages i lastReadPage
  */
  getBookDetails(
    {
      //
    }
  ) {
    // return response.body
  },

  postActivity({
    bookId = activity.bookId,
    method = activity.method,
    comment = activity.comment,
    date = activity.date,
    difficultWords = activity.difficultWords,
    endPage = activity.endPage,
    interestingWords = activity.interestingWords,
    minutesSpent = activity.minuteSpent,
    //numberOfPages = activity.numberOfPages,
    readingCompanion = activity.readingCompanion,
    readingSessionId = activity.readingSessionId,
    startPage = activity.startPage,
    statusCode = 200,
  }) {
    cy.request({
      method: method,
      failOnStatusCode: false,
      url: `${Cypress.env("apiOrigin")}/user/readProgress`,
      body: {
        readingActivityData: {
          bookId: bookId,
          date: "2023-11-20T12:34:23.894Z",
          comment: "My comment helooouu",
          difficultWords: [],
          interestingWords: [],
          readingCompanion: "none",
          endPage: 27,
          minutesSpent: 27,
          startPage: 1,
          numberOfPages: 69,
          readingSessionId: "spsdw46x7",
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(statusCode);
    });
  },

  getAllBooks() {
    return cy
      .request({
        method: "GET",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/books?libraryType=readingDiary`,
      })
      .then((response) => {
        console.log(response.body, "Response body for get all boooks");
        return response.body;
      });
  },

  deleteBook({ bookId = "" }) {
    return cy
      .request({
        method: "DELETE",
        failOnStatusCode: false,
        url: `https://readingservicesdev.lexplore.com/books/${bookId}`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  },
};
