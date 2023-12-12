import mockData from "../../fixtures/mock_data.json";
import login from "../../api/auth";
import { navigation } from "../../pageObjectModel/navigation";
import data from "../../fixtures/data.json";
import { myReading } from "../../pageObjectModel/myReading";

describe("Testing mock", () => {
  //login i navigate na my reading
  before(() => {
    login.login({});
  });
  it("Mock response data", () => {
    //test
    cy.intercept(
      "https://readingservicesdev.lexplore.com/books?libraryType=eLibrary",
      {
        fixture: "mock_data.json",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    ).as("getBooks");
    navigation.navigateTo(data.navigateTo.myReading);
    cy.wait("@getBooks").then((response) => {
      myReading.numberOfBookDisplayed
        .should("be.visible")
        .and("have.length", 48);
      myReading.pageNumber.should("be.visible").and("have.text", 1);
      cy.scrollTo("bottom");
      myReading.lastPage.should("be.visible").and("have.text", "of 6");
      console.log(response.response.body);
    });
  });
});
