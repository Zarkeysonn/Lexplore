import data from "../../fixtures/data.json";
import { navigation } from "../../pageObjectModel/navigation";
import { quizz } from "../../pageObjectModel/quizz";
import login from "../../api/auth";

describe("Quizz teesting", () => {
  before(() => {
    //
  });

  beforeEach(() => {
    login.login({});
  });

  it("search for specific book and start quizz", () => {
    quizz.clickOnWantedBookQuizz({
      bookName: data.quizzBook,
      answers: data.positiveAnswers,
      score: data["60percent"],
    });
  });
});
