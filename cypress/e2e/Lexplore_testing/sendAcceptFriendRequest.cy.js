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
      });
      friendsApi.checkIfStudentIsFriend({ userId: studentLogin.idStudent1 });
    });
  });

  // context block kada je zahtev samo stigao i nije prihvacen:
  // u responsu friends ima atribut isFriend koji je boolean, videti logiku za to ovo mi
  // se cini da ne radi onda dobro jer kada se samo posalje request ovde ce on vrv biti prijtelj odmah
  // ima u books nesto slicno pristupanje response.body pa odredjeni atribut
  context.only(
    "Friend request sent, check on student 7 if user 1 is friend",
    () => {
      it("check if s1 is friend of s7", () => {
        login.authStudents(studentLogin.student1);
        friendsApi.sendFriendRequest({
          userId: studentLogin.idStudent7,
          statusCode: 200,
        });
        login.authStudents(studentLogin.student7);
        friendsApi.checkIfStudentIsFriend({ userId: studentLogin.idStudent1 });
      });
    }
  );

  // after(() => {
  //     bookApi.getAllBooks().then((books) => {
  //       console.log(books);
  //       books.forEach((book) => {
  //         bookApi.deleteBook({ bookId: book.bookId });
  //       });
  //     });
  //   });
  //ovo je u knjigama u allBooks kako sam pristupio u respondu odredjenom atributu, znaci expect
  //da je taj atribut false ili true u zavisnosti od situacije e to trebam da uradim

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
      });

      // Test invalid cases for accepting frend: 1st send request from s1 to s7
      // login as s7 and accept friend with wrong parameter
      context("Invalid cases for accepting friendship", () => {
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
        "Testing request/accept proccess with testing accepted parameter and bad user",
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

          it("Accepting random user for friend", () => {
            friendsApi.acceptFriendRequest({
              accepted: true,
              requestSender: 313123,
              statusCode: 409,
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
    }
  );
});

// delete
after(() => {
  login.authStudents("https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg");
  friendsApi.getAllFriends({}).then((friends) => {
    friends.forEach((friend) => {
      friendsApi.deleteFriend({ friendId: friend.userId });
    });
  });
});
