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
    coverUrl = data.coverUrl,
    description = data.description,
    format = data.format, //obavezan parametar izgleda...
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

  // try {
  //   const response = await fetch('http://localhost:3001/api/', options)
  //   return await response.json()
  // }catch(error){
  //   console.error(error)
  // }

  //user/readProgress
  postActivity({
    //cookie,
    bookId = activity.readingActivityData.bookId,
    method = activity.readingActivityData.method,
    comment = activity.readingActivityData.comment,
    date = activity.readingActivityData.date,
    difficultWords = activity.readingActivityData.difficultWords,
    endPage = activity.readingActivityData.endPage,
    interestingWords = activity.readingActivityData.interestingWords,
    minutesSpent = activity.readingActivityData.minuteSpent,
    numberOfPages = activity.numberOfPages,
    readingCompanion = activity.readingActivityData.readingCompanion,
    readingSessionId = activity.readingActivityData.readingSessionId,
    startPage = activity.readingActivityData.startPage,
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
      headers: {
        //Cookie: cookie,
      },
    }).then((response) => {
      console.log(response);
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
