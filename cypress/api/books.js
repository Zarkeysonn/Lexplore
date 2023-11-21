import data from "../fixtures/data.json";
import activity from "../fixtures/activity_data.json";

module.exports = {
  postBook({
    method = data.method,
    failOnStatusCode = false,
    url = "",
    authors = data.authors,
    coverUrl = "",
    cookie = "",
    description = data.description,
    format = data.format, //obavezan parametar izgleda...
    genres = data.genres,
    isbn = data.isbn,
    numberOfPages = data.numberOfPages,
    publisher = data.publisher,
    title = data.title,
    statusCode = 200,
  }) {
    return cy
      .request({
        method: method,
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/books`, //ovako
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
          Cookie: cookie,
        },
      })
      .then((response) => {
        expect(response.status).to.eql(statusCode);
        return response.body;
      });
  },

  //user/readProgress
  postActivity({
    cookie,
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
      headers: {
        Cookie: cookie,
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eq(statusCode);
    });
  },

  getAllBooks() {
    return cy.request({
        method: "GET",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/books?libraryType=readingDiary`,
    }).then((response) => {
        console.log(response.body, 'Response body for get all boooks')
        return response.body;
    })
  },
  
  deleteBook({
    devSessionId = "",
    bookId = ""
    }) 
        {
            return cy.request({
                method: "DELETE",
                failOnStatusCode: false,
                url: `https://readingservicesdev.lexplore.com/books/${bookId}`
            })
            .then((response) => {
                expect(response.status).to.eq(200)
            })
        }
};


