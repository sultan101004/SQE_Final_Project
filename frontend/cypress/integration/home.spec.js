describe('Home (stubbed API)', () => {
  let fixtureData

  beforeEach(() => {
    cy.fixture('home').then((data) => {
      fixtureData = data
      cy.intercept('GET', '**/api/tags', {
        statusCode: 200,
        body: { tags: data.tags },
      }).as('tags')
      cy.intercept('GET', '**/api/articles**', (req) => {
        req.reply({
          statusCode: 200,
          body: {
            articles: data.articles,
            articlesCount: data.articlesCount,
          },
        })
      }).as('articles')
    })
  })

  it('Should show the global feed', () => {
    cy.visit('/')
    cy.wait('@articles')
    cy.wait('@tags')
    cy.contains('.article-preview h1', fixtureData.articles[0].title).should('exist')
    cy.contains('.article-preview p', fixtureData.articles[0].body).should('exist')
  })
})
