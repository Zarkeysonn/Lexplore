import friendRequestAccept from "../fixtures/login.json";

module.exports = {
  sendFriendRequest({
    method = "PUT",
    url = `${Cypress.env("apiOrigin")}/friends/257923/friendRequest`,
    failOnStatusCode = false,
  }) {
    return cy
      .request({
        method: method,
        url: url, //`${Cypress.env("apiOrigin")}/friends/257923/friendRequest`,
        failOnStatusCode: failOnStatusCode,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  },

  acceptFriendRequest({
    method = "POST",
    url = `${Cypress.env("apiOrigin")}/friends/257919/friendRequest/accept`,
    statusCode = 200,
    failOnStatusCode = false,
  }) {
    return cy
      .request({
        method: method,
        url: url,
        statusCode: statusCode,
        failOnStatusCode: failOnStatusCode,
        body: {
          accepted: true,
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
        method: method,
        failOnStatusCode: failOnStatusCode,
        url: url,
      })
      .then((response) => {
        console.log(response.body, "Response body for all friends list");
        return response.body;
      });
  },

  deleteFriend({ friendId = "" }) {
    return cy
      .request({
        method: "DELETE",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/friends/${friendId}`,
      })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  },
};
