export default {
    testEnvironment: 'node',
    transform: {},
    extensionsToTreatAsEsm: ['.js'],
    testMatch: ['**/tests/**/*.test.js'],
    setupFiles: ['dotenv/config']
  };