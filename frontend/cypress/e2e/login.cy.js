describe('Login Flow', () => {
    const uniqueId = Date.now();
    const testUser = {
        username: `cy_user_${uniqueId}`,
        email: `cy_${uniqueId}@example.com`,
        password: 'password123'
    };

    before(() => {
        // Seed the user via API before running the UI test
        // This ensures the user exists even if the DB was empty
        cy.request('POST', `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/users`, {
            user: testUser
        }).then((response) => {
            expect(response.status).to.eq(201);
        });
    });

    it('successfully logs in and redirects to home', () => {
        // Visit the login page
        cy.visit('/login');

        // Type email and password
        cy.get('input[type="email"]').type(testUser.email);
        cy.get('input[type="password"]').type(testUser.password);

        // Click Sign in button
        cy.get('button[type="submit"]').click();

        // Assert URL changes to Home page
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Optional: Check if user is logged in (e.g. settings link is visible)
        // cy.contains('Settings').should('be.visible');
    });
});
