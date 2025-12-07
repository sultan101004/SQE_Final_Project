describe('Article Management Flow', () => {
    const uniqueId = Date.now();
    const testUser = {
        username: `cy_user_${uniqueId}`,
        email: `cy_${uniqueId}@example.com`,
        password: 'password123'
    };
    let authToken = '';

    before(() => {
        // Create user and get auth token
        cy.request('POST', `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/users`, {
            user: testUser
        }).then((response) => {
            expect(response.status).to.eq(201);
            authToken = response.body.user.token;
        });
    });

    beforeEach(() => {
        // Login before each test
        cy.request('POST', `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/users/login`, {
            user: {
                email: testUser.email,
                password: testUser.password
            }
        }).then((response) => {
            authToken = response.body.user.token;
            // Set token in localStorage for frontend
            window.localStorage.setItem('jwt', authToken);
        });
    });

    it('creates a new article successfully', () => {
        cy.visit('/editor');

        const articleTitle = `Test Article ${uniqueId}`;
        const articleDescription = 'This is a test article description';
        const articleBody = 'This is the body of the test article. It contains multiple paragraphs.';

        // Fill in article form
        cy.get('input[placeholder*="Article Title"]').type(articleTitle);
        cy.get('input[placeholder*="What\'s this article about?"]').type(articleDescription);
        cy.get('textarea[placeholder*="Write your article"]').type(articleBody);
        
        // Publish article
        cy.get('button').contains('Publish Article').click();

        // Should redirect to article page
        cy.url().should('include', '/article/');
        
        // Verify article content is displayed
        cy.contains(articleTitle).should('be.visible');
        cy.contains(articleBody).should('be.visible');
    });

    it('displays article list on home page', () => {
        cy.visit('/');

        // Should see article list
        cy.get('.article-preview').should('exist');
    });

    it('views article details', () => {
        // First, create an article via API
        const articleTitle = `Test Article ${uniqueId}`;
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/articles`,
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: {
                article: {
                    title: articleTitle,
                    description: 'Test description',
                    body: 'Test body',
                    tagList: ['test']
                }
            }
        }).then((response) => {
            const slug = response.body.article.slug;
            
            // Visit article page
            cy.visit(`/article/${slug}`);
            
            // Verify article content
            cy.contains(articleTitle).should('be.visible');
        });
    });

    it('favorites an article', () => {
        // Create article via API
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl') || 'http://localhost:3000/api'}/articles`,
            headers: {
                'Authorization': `Token ${authToken}`
            },
            body: {
                article: {
                    title: `Favorite Test ${uniqueId}`,
                    description: 'Test',
                    body: 'Test body'
                }
            }
        }).then((response) => {
            const slug = response.body.article.slug;
            
            cy.visit(`/article/${slug}`);
            
            // Click favorite button
            cy.get('button').contains('Favorite Article').click();
            
            // Verify favorite count increased
            cy.contains('1').should('be.visible');
        });
    });
});

