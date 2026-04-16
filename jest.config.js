export default {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/'
    ]
};
