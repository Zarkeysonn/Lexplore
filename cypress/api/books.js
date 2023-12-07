import data from "../fixtures/data.json";
import activity from "../fixtures/activity_data.json";

// program to generate random strings

// declare all characters
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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
          //expect(response.body).to.have.property("numberOfPages");
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

  restartReadPages({
    method = "POST",
    url = `${Cypress.env("apiOrigin")}/user/readProgress`,
    bookId,
    resumeInformation = { lastReadPage: 0 },
    //readingSessionId,
    userId = 257919,
  }) {
    const dataS = `${this.generateString(9)}`;
    return cy
      .request({
        method: method,
        url: url,
        failOnStatusCode: false,
        body: {
          readingActivityData: {
            bookId: bookId,
            pages: [],
            resumeInformation: resumeInformation,
            // readingSessionId missing
            readingSessionId: dataS,
            userId: userId,
          },
        },
      })
      .then((response) => {
        expect(response.status).eq(200);
      });
  },

  generateString(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
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
          date: date,
          comment: comment,
          difficultWords: difficultWords,
          interestingWords: interestingWords,
          readingCompanion: readingCompanion,
          endPage: endPage,
          minutesSpent: minutesSpent,
          startPage,
          numberOfPages,
          readingSessionId,
          startPage,
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(statusCode);
    });
  },

  generateString(length) {
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  getAllBooks() {
    return cy
      .request({
        method: "GET",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/books?libraryType=readingDiary`,
      })
      .then((response) => {
        //expect(response.body).to.have.length.greaterThan(0);
        expect(response.body[0]).to.have.property("bookId");
        //expect(response.body.length).to.have.lengthOf.above(0);
        console.log(response.body, "Response body for get all boooks");
        return response.body;
      });
  },

  deleteBook({ bookId = "" }) {
    return cy
      .request({
        method: "DELETE",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/books/${bookId}`, //https://readingservicesdev.lexplore.com/books/${bookId},
      })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  },
};
