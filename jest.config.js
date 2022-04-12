module.exports = {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ["<rootDir>/out", "<rootDir>/dist"],
  testPathIgnorePatterns: ["__mocks__"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup-tests.ts"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"]
}