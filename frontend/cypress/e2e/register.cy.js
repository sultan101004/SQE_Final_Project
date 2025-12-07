describe('User Registration Flow', () => {
    const uniqueId = Date.now();
    const testUser = {
        username: `cy_user_${uniqueId}`,
        email: `cy_${uniqueId}@example.com`,
        password: 'password123'
    };

    beforeEach(() => {
        // Clean up: Delete user if exists (via API)
        cy.request({
            method: 'DELETE',
            url: `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/user`,
            failOnStatusCode: false,
            headers: {
                'Authorization': `Token ${Cypress.env('testToken') || ''}`
            }
        });
    });

    it('successfully registers a new user and redirects to home', () => {
        // Visit the register page
        cy.visit('/register');

        // Fill in registration form
        cy.get('input[placeholder*="Username"]').type(testUser.username);
        cy.get('input[type="email"]').type(testUser.email);
        cy.get('input[type="password"]').first().type(testUser.password);
        
        // Click Sign up button
        cy.get('button[type="submit"]').contains('Sign up').click();

        // Assert URL changes to Home page
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Verify user is logged in (settings link should be visible)
        cy.contains('Settings').should('be.visible');
    });

    it('displays error for invalid email format', () => {
        cy.visit('/register');

        cy.get('input[placeholder*="Username"]').type(testUser.username);
        cy.get('input[type="email"]').type('invalid-email');
        cy.get('input[type="password"]').first().type(testUser.password);
        
        cy.get('button[type="submit"]').contains('Sign up').click();

        // Should display validation error
        cy.contains('email').should('be.visible');
    });

    it('displays error for empty username', () => {
        cy.visit('/register');

        cy.get('input[type="email"]').type(testUser.email);
        cy.get('input[type="password"]').first().type(testUser.password);
        
        cy.get('button[type="submit"]').contains('Sign up').click();

        // Should display validation error
        cy.contains('username').should('be.visible');
    });
});

