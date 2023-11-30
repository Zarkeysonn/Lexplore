/// <reference types="cypress" />
import bookApi from "../../api/books";
import login from "../../api/auth.js";
import errorMessage from "../../fixtures/data.json";

// nakon dodavanja session i pozivanja te commande u before each nije mi potrebno vise da saljem
// cookie u svakom parametru? pitati Andriju da mi pojasni i da prodiskutujemo to

describe("Negative tests for adding proccess", () => {
  beforeEach(() => {
    login.authStudents(login.st);
  });

  context("Method parameter", () => {
    it("PUT", () => {
      bookApi.postBook({
        method: "DELETE",
        statusCode: 404,
      });
    });

    // pitati Andriju da li je ovo legit test ili ne bas
    // it("number", () => {
    //   bookApi.postBook({
    //     method: "123",
    //     statusCode: 404,
    //   });
    // });
  });

  context("Url parameter", () => {
    it("bad value", () => {
      bookApi.postBook({
        title: "Invalidna url knjiga",
        url: `${Cypress.env("apiOrigin")}/testic`,
        statusCode: 404,
      });
    });

    //positive
    it("http", () => {
      bookApi.postBook({
        url: "http://readingservicesdev.lexplore.com/books",
        statusCode: 500,
      });
    });
  });

  //authors doraditi ovo
  context("Authors parameter", () => {
    it("number", () => {
      bookApi.postBook({
        authors: 123,
        statusCode: 422,
      });
    });

    it("empty string", () => {
      bookApi.postBook({
        authors: "",
        statusCode: 422,
        errorMessage: errorMessage.errorMessage.invalidAuthors,
      });
    });

    it("empty object", () => {
      bookApi.postBook({
        authors: {},
        statusCode: 422,
      });
    });

    it("object with invalid value", () => {
      bookApi.postBook({
        authors: { authors: 123 },
        statusCode: 422,
      });
    });

    it("numbers in string", () => {
      bookApi.postBook({
        authors: "123",
        statusCode: 422,
      });
    });

    it("array of objects string", () => {
      bookApi.postBook({
        authors: [{ authors: "Neki1" }, { authors: "Neki2" }],
        statusCode: 422,
      });
    });

    //pozitivan test
    it("empty array", () => {
      bookApi.postBook({
        authors: [],
        statusCode: 200,
      });
    });

    it("boolean", () => {
      bookApi.postBook({
        authors: true,
        statusCode: 422,
      });
    });

    it("array of string and booleans", () => {
      bookApi.postBook({
        authors: ["Mica", "Marina", "Andrija", true],
        statusCode: 422,
      });
    });

    it("array strings and numbers", () => {
      bookApi.postBook({
        authors: ["Mica", "Marina", "Andrija", 1, 2, 3],
        statusCode: 422,
      });
    });

    it("array of numbers", () => {
      bookApi.postBook({
        authors: [38312903, 1231, 1313, 13],
        statusCode: 422,
      });
    });

    it("array of empty string", () => {
      bookApi.postBook({
        authors: ["", "", ""],
        statusCode: 422,
      });
    });

    it("array of strings with spaces only", () => {
      bookApi.postBook({
        authors: ["   ", "  ", "        "],
        statusCode: 422,
      });
    });
  });

  //title
  context.only("Title parameter", () => {
    it("empty string", () => {
      bookApi.postBook({
        title: "",
        statusCode: 422,
        errorMessage: errorMessage.errorMessage.title,
      });
    });

    it("array of string", () => {
      bookApi.postBook({
        title: ["testic", "testiiic"],
        statusCode: 422,
      });
    });

    it("empty object", () => {
      bookApi.postBook({
        title: {},
        statusCode: 422,
      });
    });

    it("string in object", () => {
      bookApi.postBook({
        title: { title: "String in object" },
        statusCode: 422,
      });
    });

    it("array of numbers", () => {
      bookApi.postBook({
        title: [1, 2, 3, 4],
        statusCode: 422,
      });
    });

    it("number", () => {
      bookApi.postBook({
        title: 123,
        statusCode: 422,
      });
    });

    it("null", () => {
      bookApi.postBook({
        title: null,
        statusCode: 422,
      });
    });

    it("array of string objects", () => {
      bookApi.postBook({
        title: [{ title: "neki" }, { title: "string" }],
        statusCode: 422,
      });
    });

    //positive test
    it("starting with number", () => {
      bookApi.postBook({
        title: "123Invalidna url knjiga",
        statusCode: 200,
      });
    });

    it("boolean", () => {
      bookApi.postBook({
        title: true,
        statusCode: 422,
      });
    });
  });

  //format
  context("Format parameter", () => {
    it("random string value", () => {
      bookApi.postBook({
        format: "cloud",
        statusCode: 422,
      });
    });

    it("number", () => {
      bookApi.postBook({
        format: 123,
        statusCode: 422,
      });
    });

    it("empty string", () => {
      bookApi.postBook({
        format: "",
        statusCode: 422,
      });
    });

    it("array of random string", () => {
      bookApi.postBook({
        format: ["asdl", "dsaf", "adfs"],
        statusCode: 422,
      });
    });

    it("array of good values", () => {
      bookApi.postBook({
        format: ["paper", "digital"],
        statusCode: 422,
      });
    });

    it("empty object", () => {
      bookApi.postBook({
        format: {},
        statusCode: 422,
      });
    });

    it("object with random string", () => {
      bookApi.postBook({
        format: { format: "dsds" },
        statusCode: 422,
      });
    });

    it("object with valid value", () => {
      bookApi.postBook({
        format: { format: "digital" },
        statusCode: 422,
      });
    });

    it("boolean", () => {
      bookApi.postBook({
        format: true,
        statusCode: 422,
      });
    });

    it("string with spaces", () => {
      bookApi.postBook({
        format: "   ",
        statusCode: 422,
      });
    });

    it("valid string with spaces", () => {
      bookApi.postBook({
        format: " paper ",
        statusCode: 422,
      });
    });
  });

  //genre
  context("Genre parameter", () => {
    it("number", () => {
      bookApi.postBook({
        genres: 1998,
        statusCode: 422,
      });
    });

    it("empty string", () => {
      bookApi.postBook({
        genres: "",
        statusCode: 422,
      });
    });

    //positive
    it("array empty string", () => {
      bookApi.postBook({
        genres: ["", "", "", ""],
        statusCode: 422,
      });
    });

    it("array of numbers", () => {
      bookApi.postBook({
        genres: [1, 2, 3, 4, 5],
        statusCode: 422,
      });
    });

    it("empty object", () => {
      bookApi.postBook({
        genres: {},
        statusCode: 422,
      });
    });

    it("object with random string value", () => {
      bookApi.postBook({
        genres: { genres: "test" },
        statusCode: 422,
      });
    });

    it("object with valid string value", () => {
      bookApi.postBook({
        genres: { genres: "Drama" },
        statusCode: 422,
      });
    });

    it("string with space before text", () => {
      bookApi.postBook({
        genres: "   drama",
        statusCode: 422,
      });
    });

    it("boolean", () => {
      bookApi.postBook({
        genres: true,
        statusCode: 422,
      });
    });

    it("array of string objects", () => {
      bookApi.postBook({
        genres: [{ genres: "drama" }, { genres: "sci-fi" }],
        statusCode: 422,
      });
    });

    //positive
    it("empty array", () => {
      bookApi.postBook({
        genres: [],
        statusCode: 200,
      });
    });

    it("empty string", () => {
      bookApi.postBook({
        genres: "",
        statusCode: 422,
      });
    });

    it("null", () => {
      bookApi.postBook({
        genres: null,
        statusCode: 422,
      });
    });

    it("string with spaces", () => {
      bookApi.postBook({
        genres: "      ",
        statusCode: 422,
      });
    });
  });

  // isbn
  context("ISBN parameter", () => {
    it("Number", () => {
      bookApi.postBook({
        isbn: 123,
        statusCode: 422,
      });
    });

    it("string", () => {
      bookApi.postBook({
        isbn: "my isbn",
        statusCode: 422,
      });
    });

    it("boolean", () => {
      bookApi.postBook({
        isbn: true,
        statusCode: 422,
      });
    });

    it("string with space only ", () => {
      bookApi.postBook({
        isbn: "    ",
        statusCode: 422,
      });
    });

    it("string with numbers and letters", () => {
      bookApi.postBook({
        isbn: "121212 gfg",
        statusCode: 422,
      });
    });

    it("empty string in object", () => {
      bookApi.postBook({
        isbn: { isbn: "" },
        statusCode: 422,
      });
    });

    it("number of numbers less than 13", () => {
      bookApi.postBook({
        isbn: 123456789012,
        statusCode: 422,
      });
    });

    it("number of numbers more than 13", () => {
      bookApi.postBook({
        isbn: 12345678901234,
        statusCode: 422,
      });
    });

    it("number of numbers is 13 with one letter", () => {
      bookApi.postBook({
        isbn: "123456789a012",
        statusCode: 422,
      });
    });

    //positive, expected...
    it("number of numbers is 13 as string", () => {
      bookApi.postBook({
        isbn: "1234567890123",
        statusCode: 422,
      });
    });

    // turns out its positive, is null === ""
    it("null", () => {
      bookApi.postBook({
        isbn: null,
        statusCode: 200,
      });
    });

    it("empty object", () => {
      bookApi.postBook({
        isbn: {},
        statusCode: 422,
      });
    });

    it("array of string", () => {
      bookApi.postBook({
        isbn: ["", "", ""],
        statusCode: 422,
      });
    });
  });

  // coverUrl
  //turns out positive
  context("CoverUrl parameter", () => {
    it("empty string", () => {
      bookApi.postBook({
        coverUrl: "",
        statusCode: 422,
      });
    });

    it("space before string", () => {
      bookApi.postBook({
        coverUrl: " somepicture",
        statusCode: 422,
      });
    });

    // turns out positive
    it("random website url", () => {
      bookApi.postBook({
        coverUrl: "https://github.com/cypress-io/cypress/issues/2996",
        statusCode: 422,
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
