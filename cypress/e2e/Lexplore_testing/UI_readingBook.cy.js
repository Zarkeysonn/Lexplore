import data from "../../fixtures/data.json";
import login from "../../api/auth";
import loginData from "../../fixtures/login.json";
import { navigation } from "../../pageObjectModel/navigation";
import { library } from "../../pageObjectModel/libraryReading";
import bookApi from "../../api/books";

/*
Dograbi api details od knjige i iz responsa procitaj numberOfPages, 
*/
describe("Reading book", () => {
  before(() => {
    login.login({});
    cy.url().should("eq", loginData.homePageUrl);
    navigation.navigateTo(data.navigateTo.library);
  });
  it("Something", () => {
    console.log(bookApi.getAllBooksFromLibrary());
    library.clickOnWantedBook(2).click();
  });
});
