module.exports = {
  extends: ["plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["unused-imports"],
  rules: {
    "unused-imports/no-unused-imports": "error",
  },
}
