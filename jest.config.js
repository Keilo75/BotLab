module.exports = {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ["<rootDir>/out", "<rootDir>/dist"],
  "testPathIgnorePatterns": ["__mocks__"]
}