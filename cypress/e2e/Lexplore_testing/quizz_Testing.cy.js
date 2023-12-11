import data from "../../fixtures/data.json";
import { navigation } from "../../pageObjectModel/navigation";
import { quizz } from "../../pageObjectModel/quizz";
import { library } from "../../pageObjectModel/libraryReading";
import login from "../../api/auth";

describe("Quizz teesting", () => {
  before(() => {
    //
  });

  beforeEach(() => {
    login.login({});
  });

  it("search for specific book and start quizz", () => {
    //quizz.readBookToEnd({ bookId: data.newBookForReadingID });
    quizz.clickOnWantedBookQuizz({
      bookName: data.gulhojBook,
      answers: data.positiveAnswers,
      score: data["80percent"],
    });
  });
});
