describe('Home (stubbed API)', () => {
  beforeEach(() => {
    cy.fixture('home').then((data) => {
      cy.intercept('GET', '**/api/tags', { tags: data.tags }).as('tags')
      cy.intercept('GET', '**/api/articles*', {
        articles: data.articles,
        articlesCount: data.articlesCount,
      }).as('articles')
    })
  })

  it('Should show the global feed', () => {
    cy.visit('/')
    cy.wait('@articles')
    cy.wait('@tags')
    cy.findByRole('heading', { name: /Smoke Test Article/i }).should('exist')
    cy.contains('This is a stubbed article body').should('exist')
  })
})
