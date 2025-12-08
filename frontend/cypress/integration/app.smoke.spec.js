/// <reference types="cypress" />

describe('Conduit smoke (stubbed data)', () => {
  beforeEach(() => {
    cy.fixture('home').then((data) => {
      cy.intercept('GET', '**/api/tags', { tags: data.tags }).as('tags');
      cy.intercept('GET', '**/api/articles*', {
        articles: data.articles,
        articlesCount: data.articlesCount,
      }).as('articles');
    });
  });

  it('loads home with feed and tags', () => {
    cy.visit('/');
    cy.contains('conduit');
    cy.wait('@tags');
    cy.wait('@articles');
    cy.contains('Smoke Test Article').should('be.visible');
    cy.contains('.tag-default', 'sqi').should('be.visible');
  });

  it('opens sign in page', () => {
    cy.visit('/');
    cy.contains('Sign in').click();
    cy.url().should('include', '/login');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });
});

