//import { forEach } from "cypress/types/lodash";
import friendRequestAccept from "../fixtures/login.json";

module.exports = {
  sendFriendRequest({
    method = "PUT",
    userId = "",
    // url = `${Cypress.env("apiOrigin")}/friends/257923/friendRequest`,
    url = `${Cypress.env("apiOrigin")}/friends/${userId}/friendRequest`,
    failOnStatusCode = false,
    statusCode = 200,
  }) {
    return cy
      .request({
        method: method,
        url: url, //`${Cypress.env("apiOrigin")}/friends/257923/friendRequest`,
        failOnStatusCode: failOnStatusCode,
      })
      .then((response) => {
        expect(response.status).to.eq(statusCode);
      });
  },

  // added requestSender param, don't forget to add it to func calls
  acceptFriendRequest({
    method = "POST",
    requestSender,
    url = `${Cypress.env(
      "apiOrigin"
    )}/friends/${requestSender}/friendRequest/accept`,
    statusCode = 200,
    failOnStatusCode = false,
  }) {
    return cy
      .request({
        method: method,
        requestSender: requestSender,
        url: url,
        failOnStatusCode: failOnStatusCode,
        body: {
          accepted: true, //accept treba proveriti
        },
      })
      .then((response) => {
        expect(response.status).to.eq(statusCode);
      });
  },

  getAllFriends({
    method = "GET",
    failOnStatusCode = false,
    url = `${Cypress.env("apiOrigin")}/friends`,
  }) {
    return cy
      .request({
        method,
        failOnStatusCode: failOnStatusCode,
        url: url,
      })
      .then((response) => {
        console.log(response, "Response body for all friends list");
        return response.body;
      });
  },

  //helper funkcija da li se nalazi u nizu neka vrednost koja ce vracati true
  // cim naleti na vrednost koju smo zadali vraca true, ta funkcija da ima 2 parametra niz i koji parametar trazimo
  // pozvati je u expectu izmedju zagrada
  checkIfStudentIsFriend({ userId }) {
    this.getAllFriends({}).then((friends) => {
      let count = 0;
      console.log(friends, "MICA OPET PITA");
      friends.forEach((friend) => {
        console.log(friend, "MICA PITA");

        //zakomentario sam ovaj IF koji je inace dobar ali fali
        //ta asertacija za isFriend atribut

        // if (friend.userId == userId) {
        //   count++;
        // }
        if (friend.userId == userId && friend.isFriend == true) {
          //if (friend.isFriend == true) {
          count++;
          //}
        }
      });
      if (count > 0) {
        expect(count).to.eq(1);
        console.log("In friends list");
      } else {
        expect(count).to.eq(0);
        console.log("Not in friends list");
      }
    });
  },

  // ova funkcija mi je nepotrebna ne koristim je
  studentIsFriend({ userId }) {
    this.getAllFriends({}).then((friends) => {
      friends.forEach((friend) => {
        console.log(friends, "All friends new");
        if (friend.isFriend == true) {
          //nastaviti ako je dobro
        }
      });
    });
  },

  deleteFriend({ friendId = "", statusCode = 200 }) {
    return cy
      .request({
        method: "DELETE",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/friends/${friendId}`,
      })
      .then((response) => {
        expect(response.status).to.eq(statusCode);
      });
  },
};
