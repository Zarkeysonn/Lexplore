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
  it("Read book to the end", () => {
    //library.getBookID(2); //response body sa detailjima knjige
    //for (let i; i < 3; i++) {
    library.readingProgress({ option: 2 }); //46 epub, 2 je gulhoj
    library.showProgressBtn.click();
    library.bookProgressPercentage.should("have.text", "100%");
  });
  after(() => {
    //obrisi tj. vrati na pocetno stanje
  });
});
