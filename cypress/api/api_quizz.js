module.exports = {
  getAllBooksFromLibrary() {
    return cy
      .request({
        method: "GET",
        failOnStatusCode: false,
        url: `${Cypress.env("apiOrigin")}/books?libraryType=eLibrary`,
      })
      .then((response) => {
        return response.body;
      });
  },
};
