/// <reference types="cypress" />
import login from "../../api/auth.js";
import friendsApi from "../../api/friends.js";
const studentLogin = require("../../fixtures/login.json");
let student1; //= studentLogin.student1;
let student7; //= studentLogin.student7;

describe("Testing sending and accepting friend request", () => {
  it("Login as student1 and send request to student 7", () => {
    //cy.loginFromBackendWithSession();
    login.authStudents(
      studentLogin.student1
      //"https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg"
    );
    friendsApi.sendFriendRequest({});
  });

  it("Login as student7 and accept friend request", () => {
    login.authStudents(
      studentLogin.student7
      //"https://logindev.lexplore.com/go/nbSTogG-nk6Hfm9WAj8t6Q"
    );
    friendsApi.acceptFriendRequest({
      //statusCode: 200,
    });
  });

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
