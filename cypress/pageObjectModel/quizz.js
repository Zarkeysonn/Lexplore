/// <reference types="cypress" />
import bookApi from "../api/books";
//import bookApi from "../api/books.js";
import login from "../api/auth";
//import login from "../../api/auth.js";
import { navigation } from "./navigation";
import data from "../fixtures/data.json";
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

  get skor() {
    return cy.get(
      ".QuizEngineResponseLayout__ResponseLayoutSuccessPercentage-sc-1lm9agf-5"
    );
  }
  getAvailableQuizzBooks({
    method = "GET",
    url = `${Cypress.env("apiOrigin")}/quizzes/available`,
  }) {
    return cy
      .request({
        method: method,
        url: url,
        failOnStatusCode: false,
      })
      .then((response) => {
        return response.body; // ovde mi se nalazi u response.body quizzUuid
      });
  }

  /* 
Ako je skor manji ili jednak sa oldScoreom on se nece promeniti, a iz resulta izvlacim novi score
Izvucicu skor tako sto cu prebrojati koliko tacnih odgovora ima i onda pomnoziti taj broj sa 20;
*/

  clickOnWantedBookQuizz({ bookName, answers = [], score }) {
    cy.intercept("**/quizzes/available").as("availableQuizz");
    navigation.navigateTo(data.navigateTo.quizz);
    cy.wait("@availableQuizz").then((response) => {
      let oldScore = response.response.body.score;
      this.searchInputField.clear().type(bookName);
      this.retryQuizz.click({ force: true });
      this.quizTitle.should("be.visible").and("contain.text", "Quiz");
    });
    //let currentQuizScore = this.quizScore;
    for (let i = 1; i <= answers.length; i++) {
      this.answerQuestion(i, answers[i - 1]);
    }
    // expect(this.quizIsOver).to.be.visible;
    // this.answerNegativeQuestion(1);
    // this.answerNegativeQuestion(2);
    // this.answerNegativeQuestion(3);
    // this.answerNegativeQuestion(4);
    // this.answerNegativeQuestion(5);
    this.submitQuiz.click();
    cy.intercept("**/result").as("result"); //asertuj rezultat i da je gotov quizz
    this.quizIsOver.should("be.visible");
    this.skor.should("be.visible").and("have.text", score);
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

  // ok na ovu neku foru hocu
  sendAnswers() {
    cy.intercept("**/result").as("result");
    //let options = [true, false];
    let oldScore = this.getAvailableQuizzBook;
    this.getAvailableQuizzBooks();
    let myAnswers = [];

    this.submitQuiz.click();
    cy.wait("@result").then(() => {
      return myAnswers;
    });
  }

  //   let answers = [];
  //     switch(statuses){
  //         case true:
  //             this.positiveAnswer.click();
  //             break;
  //         case false:
  //             this.positiveAnswer.click();
  //             break;
  readBookToEnd({
    method = "POST",
    url = `${Cypress.env("apiOrigin")}/user/readProgress`,
    bookId = "",
    resumeInformation = data.lastReadPage36,
    userId = data.userId,
  }) {
    const dataS = `${this.generateString(9)}`;
    return cy
      .request({
        method: method,
        url: url,
        failOnStatusCode: false,
        body: {
          readingActivityData: {
            bookId: 8523, // hc
            pages: data.setPage.toLast,
            resumeInformation: resumeInformation,
            readingSessionId: dataS,
            userId: userId,
          },
        },
      })
      .then((response) => {
        expect(response.status).eq(200);
      });
  }
}

export const quizz = new Quizz();
