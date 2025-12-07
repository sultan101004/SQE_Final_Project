describe('Login Flow', () => {
    it('successfully logs in and redirects to home', () => {
        // Visit the login page
        cy.visit('/login');

        // Type email and password
        // Selectors depend on the actual implementation, standard RealWorld uses:
        // input[type="email"] and input[type="password"]
        cy.get('input[type="email"]').type('jake@jake.jake');
        cy.get('input[type="password"]').type('jakejake');

        // Click Sign in button
        cy.get('button[type="submit"]').click();

        // Assert URL changes to Home page
        // Assuming home page is root path '/'
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
});
