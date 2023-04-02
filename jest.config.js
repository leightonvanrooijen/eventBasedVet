module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["./**/?(*.)+(integration|unit).ts"],
  roots: ["./src"],
  testPathIgnorePatterns: ["node_modules", ".devcontainer", "dist"],
  watchPathIgnorePatterns: ["node_modules", ".devcontainer", "dist"],
}
