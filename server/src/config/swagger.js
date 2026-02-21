const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CareerLink Nexus API',
            version: '1.0.0',
            description: 'API Documentation for CareerLink Nexus Backend',
            contact: {
                name: 'CareerLink Teaam',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                JobSeeker: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role_id: { type: 'string', format: 'uuid' },
                    }
                },
                Role: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Auto-generated UUID of the role',
                        },
                        name: {
                            type: 'string',
                            enum: ['job_seeker', 'employer'],
                            description: 'Name of the role',
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp of creation',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp of last update',
                        },
                    },
                    example: {
                        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                        name: 'job_seeker',
                        created_at: '2023-10-27T10:00:00.000Z',
                        updated_at: '2023-10-27T10:00:00.000Z',
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'fail',
                        },
                        message: {
                            type: 'string',
                            example: 'Error message description',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
