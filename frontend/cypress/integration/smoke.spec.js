describe('Conduit smoke test', () => {
  it('loads home page', () => {
    cy.visit('/');
    cy.contains('conduit');
    cy.contains('A place to share your knowledge.');
  });
});

