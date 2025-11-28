// jest.config.cjs
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'jsx'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // <- setup file
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js'
    }
};
