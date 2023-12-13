import mockData from "../../fixtures/mock_data.json";
import login from "../../api/auth";
import { navigation } from "../../pageObjectModel/navigation";
import data from "../../fixtures/data.json";
import { myReading } from "../../pageObjectModel/myReading";
import { countBooks } from "../../helper/helper";

describe("Testing mock", () => {
  before(() => {
    login.login({});
  });
  it("Mock response data", () => {
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
      for (let i = 0; i < 5; i++) {
        myReading.pageNavigationButtons
          .eq(1)
          .should("have.text", "Next")
          .click();
        myReading.pageNumber.should("have.text", i + 2);
        myReading.pageNavigationButtons
          .eq(0)
          .should("not.be.disabled")
          .and("have.text", "Previous");
        if (i === 4) {
          myReading.pageNavigationButtons.eq(1).should("not.be.enabled");
        }
      }

      //   myReading.lastPage.should("be.visible").and("have.text", "of 6");
      //   myReading.pageNavigationButtons.eq(0).should("not.be.enabled");
      //   myReading.pageNavigationButtons.eq(1).should("have.text", "Next").click();
      //   myReading.pageNumber.should("have.text", 2);
      //   myReading.lastPage.should("be.visible").and("have.text", "of 6");
      //  myReading.numberOfBookDisplayed.should("have.length", 48);
    });
  });
});
