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
    it("Login as student1 and send request to student 7", () => {
      login.authStudents(studentLogin.student1);
      friendsApi.sendFriendRequest({
        statusCode: 200,
        userId: studentLogin.idStudent7,
      });
    });

    //vec sam ulogovan kao student1 i poslao zahtev s7
    //it("NEW:", () => {});

    // accept friend request
    it("Login as student7 and accept friend request", () => {
      //prvo opet posalji zahtev i onda tek prihvati i asertuj to
      login.authStudents(studentLogin.student1);
      friendsApi.sendFriendRequest({
        statusCode: 200,
        userId: studentLogin.idStudent7,
      });

      login.authStudents(studentLogin.student7);
      friendsApi.acceptFriendRequest({
        requestSender: studentLogin.idStudent1,
      }); //obavezno poslatibar prazan objekat jer je u iniju same funkcije vec sve postavljeno kako treba i samo ovde se objekat prosledjuje
      friendsApi.checkIfStudentIsFriend({ userId: studentLogin.idStudent1 });
    });

    // ovo ispod mi mislim ne treba jer sam vec uradio asertaciju u gornjem testu!

    // it("Check if student7 is in student1 friend list", () => {
    //   login.authStudents(studentLogin.student1);
    //   friendsApi.checkIfStudentIsFriend({ userId: 257923 });
    // });
  });

  //negative scenarios
  context(
    "Negative scenarios for sending and accepting friend requests",
    () => {
      context("Invalid method paramater when sending friend request: ", () => {
        it("POST", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "POST",
            userId: 257923,
            statusCode: 404,
          });
        });

        it("Bad method parameter: GET", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "GET",
            userId: 257923,
            statusCode: 404,
          });
        });

        it("Bad method parameter: PATCH", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "PATCH",
            userId: 257923,
            statusCode: 404,
          });
        });

        it("Bad method parameter: OPTIONS", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "OPTIONS",
            userId: 257923,
            statusCode: 204,
          });
        });

        it("Bad method parameter: HEAD", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "HEAD",
            userId: 257923,
            statusCode: 404,
          });
        });

        it("Bad method parameter: PATCH", () => {
          login.authStudents(studentLogin.student1);
          friendsApi.sendFriendRequest({
            method: "PATCH",
            userId: 257923,
            statusCode: 404,
          });

          it("Bad method parameter: DELETE", () => {
            login.authStudents(studentLogin.student1);
            friendsApi.sendFriendRequest({
              method: "DELETE",
              userId: 257923,
              statusCode: 404,
            });
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
              requestSender: 257919, //studentLogin.idStudent1,
              statusCode: 404,
            });
          });

          it("Bad method parameter: DELETE", () => {
            login.authStudents(studentLogin.student7);
            friendsApi.acceptFriendRequest({
              method: "DELETE",
              requestSender: 257919, //studentLogin.idStudent1,
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
