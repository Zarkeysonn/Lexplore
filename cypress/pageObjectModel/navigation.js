class Navigation {
    get getHomeBtn() {
        return cy.get('xmlns="http://www.w3.org/2000/svg"')
    }

    get getMyReading() {
        return cy.get('data-cy="nav.my.books.tab"')
    }

    clickHomeBtn() {
        this.getHomeBtn.click({force:true})
    }

    clickMyReading() {
        this.getMyReading.click({force:true})
    }

    toMyReadingPage() {
        this.clickHomeBtn()
        this.clickMyReading()
    }
}

export const navigation = new Navigation() 