/// <reference types="cypress" />
import login from "../../api/auth.js";
import friendsApi from "../../api/friends.js";
const studentLogin = require("../../fixtures/login.json");
let student1; //= studentLogin.student1;
let student7; //= studentLogin.student7;

let student1_id;
let student7_id;

describe("Testing sending and accepting friend request", () => {
  //   before(() => {
  //     login.authStudents(
  //       "https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg"
  //     );
  //     friendsApi.getAllFriends({}).then((friends) => {
  //       console.log(friends);
  //       friends.forEach((friend) => {
  //         friendsApi.deleteFriend({ friendId: friend.userId });
  //       });
  //     });
  //   });

  it("Login as student1 and send request to student 7", () => {
    //cy.loginFromBackendWithSession();
    login.authStudents(
      studentLogin.student1
      //"https://logindev.lexplore.com/go/5yU3DaVNH0GmIjPBMJXWDg"
    );
    //student1_id = uzmi taj svoj ID
    friendsApi.sendFriendRequest({});
    // .then((response) => {
    //   console.log(response);
    // });
  });

  it("Login as student7 and accept friend request", () => {
    login.authStudents(
      studentLogin.student7
      //"https://logindev.lexplore.com/go/nbSTogG-nk6Hfm9WAj8t6Q"
    );

    friendsApi.acceptFriendRequest({}); //obavezno poslati prazan objekat jer je u iniju same funkcije vec sve postavljeno kako treba i samo ovde se objekat prosledjuje
  });

  it("Check if student7 is in student1 friend list", () => {
    //let usrID = 257923;
    login.authStudents(studentLogin.student1);
    friendsApi.checkIfStudentIsFriend({ userId: 257923 });
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