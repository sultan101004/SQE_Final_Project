const axios = require('axios');

describe('Auth API', () => {
    // Ensure the backend server is running on port 3000 (or the port defined in your env)
    const API_URL = 'http://localhost:3000/api';

    // Create a unique user for this test run
    const uniqueId = Date.now();
    const testUser = {
        user: {
            username: `testuser_${uniqueId}`,
            email: `test${uniqueId}@example.com`,
            password: 'password123'
        }
    };

    test('Should register and then login with 200 OK', async () => {
        try {
            // 1. Register
            const registerResponse = await axios.post(`${API_URL}/users`, testUser);
            expect(registerResponse.status).toBe(201); // 201 Created

            // 2. Login
            const loginResponse = await axios.post(`${API_URL}/users/login`, {
                user: {
                    email: testUser.user.email,
                    password: testUser.user.password
                }
            });

            expect(loginResponse.status).toBe(200);
            expect(loginResponse.data.user).toBeDefined();
            expect(loginResponse.data.user.token).toBeDefined();
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Backend server is not running. Please start the server before running tests.');
            }
            if (error.response) {
                console.error('API Error Response:', error.response.data);
            }
            throw error;
        }
    });
});
