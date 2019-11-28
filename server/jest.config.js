module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts$": ["babel-jest"]
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  moduleFileExtensions: ["ts", "js"]
};
