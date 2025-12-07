describe('Comment Management Flow', () => {
    const uniqueId = Date.now();
    const testUser = {
        username: `cy_user_${uniqueId}`,
        email: `cy_${uniqueId}@example.com`,
        password: 'password123'
    };
    let authToken = '';
    let articleSlug = '';

    before(() => {
        // Create user
        cy.request('POST', `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/users`, {
            user: testUser
        }).then((response) => {
            authToken = response.body.user.token;
            window.localStorage.setItem('jwt', authToken);
        });

        // Create an article for commenting
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/articles`,
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: {
                article: {
                    title: `Comment Test Article ${uniqueId}`,
                    description: 'Test article for comments',
                    body: 'This article is for testing comments'
                }
            }
        }).then((response) => {
            articleSlug = response.body.article.slug;
        });
    });

    it('adds a comment to an article', () => {
        cy.visit(`/article/${articleSlug}`);

        const commentText = `This is a test comment ${uniqueId}`;

        // Type comment
        cy.get('textarea[placeholder*="Write a comment"]').type(commentText);
        
        // Submit comment
        cy.get('button').contains('Post Comment').click();

        // Verify comment appears
        cy.contains(commentText).should('be.visible');
    });

    it('displays existing comments', () => {
        // Add a comment via API first
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/articles/${articleSlug}/comments`,
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: {
                comment: {
                    body: `API Comment ${uniqueId}`
                }
            }
        });

        // Visit article page
        cy.visit(`/article/${articleSlug}`);

        // Verify comment is displayed
        cy.contains(`API Comment ${uniqueId}`).should('be.visible');
    });

    it('deletes own comment', () => {
        // Add a comment first
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/articles/${articleSlug}/comments`,
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: {
                comment: {
                    body: `Comment to delete ${uniqueId}`
                }
            }
        }).then((response) => {
            const commentId = response.body.comment.id;

            cy.visit(`/article/${articleSlug}`);

            // Find and click delete button for the comment
            cy.contains(`Comment to delete ${uniqueId}`)
                .parent()
                .find('button')
                .contains('Delete')
                .click();

            // Verify comment is removed
            cy.contains(`Comment to delete ${uniqueId}`).should('not.exist');
        });
    });
});

