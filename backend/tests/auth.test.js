const axios = require('axios');

describe('Auth API', () => {
    // Ensure the backend server is running on port 3000 (or the port defined in your env)
    const API_URL = 'http://localhost:3000/api';

    test('POST /users/login should return 200 and a JWT token', async () => {
        // You might need to adjust these credentials to match a seeded user or register one first
        const userData = {
            user: {
                email: 'jake@jake.jake',
                password: 'jakejake'
            }
        };

        try {
            const response = await axios.post(`${API_URL}/users/login`, userData);

            expect(response.status).toBe(200);
            expect(response.data.user).toBeDefined();
            expect(response.data.user.token).toBeDefined();
        } catch (error) {
            // Check if error is due to connection refused (server not running)
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Backend server is not running. Please start the server before running tests.');
            }
            // If request failed (e.g. 401), re-throw to fail the test with details
            throw error;
        }
    });
});
