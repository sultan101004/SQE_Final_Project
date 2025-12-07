describe('Profile Management Flow', () => {
    const uniqueId = Date.now();
    const testUser = {
        username: `cy_user_${uniqueId}`,
        email: `cy_${uniqueId}@example.com`,
        password: 'password123'
    };
    let authToken = '';

    before(() => {
        // Create user
        cy.request('POST', `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/users`, {
            user: testUser
        }).then((response) => {
            expect(response.status).to.eq(201);
            authToken = response.body.user.token;
            window.localStorage.setItem('jwt', authToken);
        });
    });

    it('views user profile page', () => {
        cy.visit(`/@${testUser.username}`);

        // Verify profile information is displayed
        cy.contains(testUser.username).should('be.visible');
    });

    it('updates user settings', () => {
        cy.visit('/settings');

        const newBio = 'Updated bio from Cypress test';
        
        // Update bio
        cy.get('textarea[placeholder*="Short bio about you"]').clear().type(newBio);
        
        // Save settings
        cy.get('button[type="submit"]').contains('Update Settings').click();

        // Verify success message or redirect
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('displays user articles on profile', () => {
        // Create an article first
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/articles`,
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: {
                article: {
                    title: `Profile Test Article ${uniqueId}`,
                    description: 'Test',
                    body: 'Test body'
                }
            }
        });

        // Visit profile page
        cy.visit(`/@${testUser.username}`);

        // Should see user's articles
        cy.get('.article-preview').should('exist');
    });
});

