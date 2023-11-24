/// <reference types="cypress" />
import login from "../../api/auth.js";
import friendsApi from "../../api/friends.js";
const studentLogin = require("../../fixtures/login.json");

describe("Testing sending and accepting friend request", () => {
  beforeEach(() => {
    login.authStudents(studentLogin.student1);
    friendsApi.deleteFriend({ friendId: studentLogin.idStudent7 });
  });

  context("Positive scenarion for sending and accepting friend request", () => {
    it("send, accept, assert", () => {
      login.authStudents(studentLogin.student1);
      friendsApi.sendFriendRequest({
        statusCode: 200,
        userId: studentLogin.idStudent7,
      });
      friendsApi.checkIfStudentIsFriend({
        userId: studentLogin.idStudent7,
      });

      login.authStudents(studentLogin.student7);
      friendsApi.acceptFriendRequest({
        requestSender: studentLogin.idStudent1,
      }); //obavezno poslatibar prazan objekat jer je u iniju same funkcije vec sve postavljeno kako treba i samo ovde se objekat prosledjuje
      friendsApi.checkIfStudentIsFriend({ userId: studentLogin.idStudent1 });
    });
  });

  //negative scenarios
  context(
    "Negative scenarios for sending and accepting friend requests",
    () => {
      // bad Url context block
      context("Invalid URL when sending request", () => {
        beforeEach(() => {
          login.authStudents(studentLogin.student1);
        });
        it("Bad URL, good USER", () => {
          //
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            userId: studentLogin.idStudent7,
            url: `${Cypress.env("apiOrigin")}/123friends/${
              studentLogin.idStudent7
            }/friendRequest123`,
            statusCode: 404,
          });
        });

        it("Good URL, bad USER", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            userId: studentLogin.idStudent7,
            url: `${Cypress.env("apiOrigin")}/123friends/${
              studentLogin.idStudent7
            }/friendRequest123`,
            statusCode: 404,
          });
        });
      });

      context("Invalid url when accepting friend request", () => {
        beforeEach(() => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            userId: studentLogin.idStudent7,
            statusCode: 200,
          });
          login.authStudents(studentLogin.student7);
        });
        it("Bad url when accepting friend request", () => {
          friendsApi.acceptFriendRequest({
            requestSender: studentLogin.idStudent1,
            url: `${Cypress.env("apiOrigin")}/test/${
              studentLogin.idStudent1
            }/friendRequest/accept`,
            statusCode: 404,
          });
        });
      });

      context("Invalid method paramater when sending friend request: ", () => {
        it("POST", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "POST",
            userId: studentLogin.idStudent7,
            statusCode: 404,
          });
        });

        it("Bad method parameter: GET", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "GET",
            userId: studentLogin.idStudent7,
            statusCode: 404,
          });
        });

        it("Bad method parameter: PATCH", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "PATCH",
            userId: studentLogin.idStudent7,
            statusCode: 404,
          });
        });

        it("Bad method parameter: OPTIONS", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "OPTIONS",
            userId: studentLogin.idStudent7,
            statusCode: 204,
          });
        });

        it("Bad method parameter: HEAD", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "HEAD",
            userId: studentLogin.idStudent7,
            statusCode: 404,
          });
        });

        it("Bad method parameter: PATCH", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "PATCH",
            userId: studentLogin.idStudent7,
            statusCode: 404,
          });
        });
        it("Bad method parameter: DELETE", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "DELETE",
            userId: studentLogin.idStudent7,
            statusCode: 404,
          });
        });

        // Test invalid cases for accepting frend: 1st send request from s1 to s7
        // login as s7 and accept friend with wrong parameter
        context("Invalid cases for accepting friendship", () => {
          //i ovo srediti
          it("Bad method parameter: PUT", () => {
            login.authStudents(studentLogin.student7);
            friendsApi.acceptFriendRequest({
              method: "PUT",
              requestSender: studentLogin.idStudent1,
              statusCode: 404,
            });
          });

          it("Bad method parameter: DELETE", () => {
            login.authStudents(studentLogin.student7);
            friendsApi.acceptFriendRequest({
              method: "DELETE",
              requestSender: studentLogin.idStudent1,
              statusCode: 404,
            });
          });

          it("Bad method parameter: PATCH", () => {
            login.authStudents(studentLogin.student7);
            friendsApi.acceptFriendRequest({
              method: "PATCH",
              requestSender: studentLogin.idStudent1,
              statusCode: 404,
            });
          });

          //after
          afterEach(() => {
            login.authStudents(
              "https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg"
            );
            friendsApi.getAllFriends({}).then((friends) => {
              console.log(friends);
              friends.forEach((friend) => {
                friendsApi.deleteFriend({
                  friendId: friend.userId,
                  method: 200,
                });
              });
            });
          }); //kraj afterEacha
        });

        context(
          "Testing request/accept proccess with testing accepted body parameter in Accepting",
          () => {
            beforeEach(() => {
              login.authStudents(studentLogin.student1);
              friendsApi.sendFriendRequest({
                userId: studentLogin.idStudent7,
                statusCode: 200,
              });
              login.authStudents(studentLogin.student7);
            });

            it("Request already sent, check if he is already in list of friends", () => {
              friendsApi.checkIfStudentIsFriend({
                usr: studentLogin.student1,
              });
            });

            it("Student declined friend request, check if they are friendds", () => {
              friendsApi.acceptFriendRequest({
                accepted: false,
                statusCode: 422,
              });
            });

            afterEach(() => {
              friendsApi.checkIfStudentIsFriend({
                userId: studentLogin.student1,
              });
            });
          }
        );
      });
    }
  );

  // delete
  after(() => {
    login.authStudents(
      "https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg"
    );
    friendsApi.getAllFriends({}).then((friends) => {
      console.log(friends);
      friends.forEach((friend) => {
        friendsApi.deleteFriend({ friendId: friend.userId });
      });
    });
  });
});
