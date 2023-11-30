/// <reference types="cypress" />
import bookApi from "../../api/books";
import login from "../../api/auth";

describe("Test scenario for invalid log of activity", () => {
  beforeEach(() => {
    login.auth();
    bookApi.postBook({});
  });

  context("bookId parameter", () => {
    it("string of numbers", () => {
      bookApi.postActivity({
        bookId: "1209320",
        statusCode: 422,
      });
      console.log(Response);
    });

    it("numbers", () => {
      bookApi.postActivity({
        bookId: 9320,
        statusCode: 422,
      });
    });

    it("array of strings", () => {
      bookApi.postActivity({
        bookId: ["Nesto", "da popunim"],
        statusCode: 422,
      });
    });

    it("null", () => {
      bookApi.postActivity({
        bookId: null,
        statusCode: 403,
      });
    });

    it("empty object", () => {
      bookApi.postActivity({
        bookId: {},
        statusCode: 500,
      });
    });

    it("bad object", () => {
      bookApi.postActivity({
        bookId: { bookId: "someId" },
        statusCode: 422,
      });
    });

    it("undefined", () => {
      bookApi.postActivity({
        bookId: undefined,
        statusCode: 422,
      });
    });
    //CONTEXT RAZRADITI

    it("array of string", () => {
      bookApi.postActivity({
        bookId: ["klasdfjfew", "jsdffo2", "sjkf29"],
        statusCode: 500,
      });
    });

    it("empty array", () => {
      bookApi.postActivity({
        bookId: [],
        statusCode: 422,
      });
    });
  });

  context("Method parameter", () => {
    it("wrong method", () => {
      bookApi.postActivity({
        method: "GET",
        statusCode: 404,
      });
    });

    it("number", () => {
      bookApi.postActivity({
        method: 238,
        statusCode: 404,
      });
    });

    it("empty object", () => {
      bookApi.postActivity({
        method: {},
        statusCode: 404,
      });
    });
  });

  context("Date parameter", () => {
    it("random string date", () => {
      bookApi.postActivity({
        date: "Zarko je datum.",
        statusCode: 422,
      });
    });

    it("null", () => {
      bookApi.postActivity({
        date: null,
        statusCode: 422,
      });
    });

    it("undefined", () => {
      bookApi.postActivity({
        date: undefined,
        statusCode: 422,
      });
    });

    it("boolean", () => {
      bookApi.postActivity({
        date: true,
        statusCode: 422,
      });
    });

    it("valid date but spaces before 1st letter", () => {
      bookApi.postActivity({
        date: "     2023-11-22T08:29:43.311Z",
        statusCode: 422,
      });
    });

    it("string number date", () => {
      bookApi.postActivity({
        date: "27.06.98",
        statusCode: 422,
      });
    });

    it("number date", () => {
      bookApi.postActivity({
        date: 270698,
        statusCode: 422,
      });
    });

    it("empty object", () => {
      bookApi.postActivity({
        date: {},
        statusCode: 422,
      });
    });

    it("wrong object value", () => {
      bookApi.postActivity({
        date: { date: "some date" },
        statusCode: 422,
      });
    });

    it("string with only space", () => {
      bookApi.postActivity({
        date: "      ",
        statusCode: 422,
      });
    });

    it("symbols", () => {
      bookApi.postActivity({
        date: ">,./!!@#$I,/.1",
        statusCode: 422,
      });
    });

    it("array of dates", () => {
      bookApi.postActivity({
        date: [
          "Wed Mar 01 2023 00:00:00 GMT-0800 (Pacific Standard Time)",
          "Thu Mar 02 2023 00:00:00 GMT-0800 (Pacific Standard Time)",
          "Fri Mar 03 2023 00:00:00 GMT-0800 (Pacific Standard Time)",
          "Sat Mar 04 2023 00:00:00 GMT-0800 (Pacific Standard Time)",
          "Sun Mar 05 2023 00:00:00 GMT-0800 (Pacific Standard Time)",
        ],
        statusCode: 422,
      });
    });
  });

  it("Log activity when difficult words are numbers", () => {
    bookApi.postActivity({
      difficultyWords: [12, 123, 123],
      statusCode: 403,
    });
  });

  it("Log activity when difficulty words are special symbols", () => {
    bookApi.postActivity({
      difficultyWords: ["!@#", ")(#@!)%$*", "%^&^#^&"],
      statusCode: 403,
    });
  });

  it("Log activity when endPage is 0", () => {
    bookApi.postActivity({
      endPage: 0,
      statusCode: 403,
    });
  });

  it("Log activity when endPage is 0", () => {
    bookApi.postActivity({
      endPage: 10,
      statusCode: 403,
    });
  });

  it("Log activity when endPage is negative", () => {
    bookApi.postActivity({
      endPage: -10,
      statusCode: 403,
    });
  });

  it("Log activity when endPage is bigger than startPage", () => {
    bookApi.postActivity({
      startPage: 27,
      endPage: 26,
      statusCode: 403,
    });
  });

  it("Log activity when minutes spend reading is 0", () => {
    bookApi.postActivity({
      minuteSpend: 0,
      statusCode: 403,
    });
  });

  it("Log activity when minutes spend reading is negative", () => {
    bookApi.postActivity({
      minuteSpend: -20,
      statusCode: 403,
    });
  });

  it("Log activity when minutes spend reading is string", () => {
    bookApi.postActivity({
      minuteSpend: "Mica je citao",
      statusCode: 403,
    });
  });

  it("Log activity when reading companion is random string", () => {
    bookApi.postActivity({
      readingCompanion: "Micaner",
      statusCode: 403,
    });
  });

  it("Log activity when endPage-startPage difference is bigger than 100", () => {
    bookApi.postActivity({
      startPage: 1,
      endPage: 102,
      statusCode: 403,
    });
  });

  it("Log activity when endPage-startPage difference is 100", () => {
    bookApi.postActivity({
      startPage: 1,
      endPage: 101,
      statusCode: 403,
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
