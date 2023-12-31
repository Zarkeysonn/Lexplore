/// <reference types="cypress" />
import bookApi from "../api/books";
import login from "../api/auth";
import { navigation } from "./navigation";
import data from "../fixtures/data.json";
import helper from "../helper/helper";
class Quizz {
  get retryQuizz() {
    return cy.get('[data-cy="retry.quiz"]');
  }

  get searchInputField() {
    return cy.get('[placeholder="Search..."]');
  }

  get quizTitle() {
    return cy.get(".QuizEngineHeader__HeaderName-sc-fvo5kw-2");
  }

  get positiveAnswer() {
    return cy.get('[data-cy="0.single.answer"]');
  }

  get negativeAnswer() {
    return cy.get('[data-cy="1.single.answer"]');
  }

  get currentPage() {
    return cy.get('div[data-cy="]');
  }

  get submitQuiz() {
    return cy.get('button[data-cy="submit.quiz"]');
  }

  get quizScore() {
    return cy.get('[data-cy="quiz.score"] div');
  }

  get quizIsOver() {
    return cy.get('[data-cy="quiz.score"]');
  }

  get correctAnswer() {
    return cy.get(
      'img[src="/student/static/media/correctAnswer.3a0ced5c.svg"]'
    );
  }

  get scorePercentage() {
    return cy.get(".QuizRow__QuizScore-sc-9s0nld-3");
  }

  get backToDashboard() {
    return cy.get('[data-cy="go.to.dashboard"]');
  }

  get skor() {
    return cy.get(
      ".QuizEngineResponseLayout__ResponseLayoutSuccessPercentage-sc-1lm9agf-5"
    );
  }

  takeBookQuizz({ bookName, answers = [], score }) {
    cy.intercept("**/quizzes/available").as("availableQuizz");
    navigation.navigateTo(data.navigateTo.quizz);
    cy.wait("@availableQuizz").then((response) => {
      var oldScore = response.response.body;
      let specificQuiz = oldScore.filter(
        (quiz) => quiz.title == data.gulhojBook
      );
      let resultBeforeQuiz = specificQuiz[0].score;
      this.searchInputField.clear().type(bookName);
      this.retryQuizz.click({ force: true });
      this.quizTitle.should("be.visible").and("contain.text", "Quiz");
      for (let i = 1; i <= answers.length; i++) {
        this.answerQuestion(i, answers[i - 1]);
      }
      cy.intercept("**/result").as("resultScore");
      cy.intercept("**/available").as("availableAfterQuiz");
      this.submitQuiz.click();
      this.skor.should("be.visible").and("have.text", score);
      cy.wait("@resultScore").then((responseResult) => {
        let score = responseResult.response.body.score;
        score = score.substring(0, score.length - 1);
        cy.wait("@availableAfterQuiz").then((responseAfterAvailable) => {
          let newResponse = responseAfterAvailable.response.body;
          let newScore = newResponse.filter(
            (newState) => newState.title == data.gulhojBook
          );
          this.backToDashboard.click();
          this.retryQuizz.should("be.visible").and("not.be.disabled");
          if (newScore[0].score >= Number(score)) {
            this.scorePercentage.should("contain.text", newScore[0].score);
          } else {
            this.scorePercentage.should("contain.text", score);
          }
        });
      });
    });
  }

  answerPositiveQuestion(number) {
    cy.get(
      `div[data-cy="${number}.question"] [data-cy="0.single.answer"]`
    ).click({ force: true });
  }

  answerQuestion(pageNum, answer) {
    cy.get(
      `div[data-cy="${pageNum}.question"] [data-cy="${answer}.single.answer"]`
    ).click({ force: true });
  }

  answerNegativeQuestion(number) {
    cy.get(
      `div[data-cy="${number}.question"] [data-cy="1.single.answer"]`
    ).click({ force: true });
  }

  getQuizResult() {
    cy.intercept("**/result").as("resultScore");
    this.submitQuiz.click();
    cy.wait("@resultScore").then((response) => {
      let score = response.response.body.score;
      score = score.slice(0, -1);
      //cy.log(score, "HELOO");
      return Number(score);
    });
  }

  sendAnswers() {
    cy.intercept("**/result").as("result");
    let oldScore = this.getAvailableQuizzBook;
    this.getAvailableQuizzBooks();
    let myAnswers = [];
    this.submitQuiz.click();
    cy.wait("@result").then(() => {
      return myAnswers;
    });
  }
}

export const quizz = new Quizz();
