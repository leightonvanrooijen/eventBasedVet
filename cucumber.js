module.exports = {
  default: {
    paths: ["./src/**/acceptanceTests/**/?(*.)+feature.ts"],
    requireModule: ["ts-node/register"],
    parallel: 1,
    // format: ["json:reports/report.cucumber.json", "summary"],
    // formatOptions: { snippetInterface: "async-await" },
    tags: "@acceptance",
    publishQuiet: true,
    require: ["./src/**/acceptanceTests/**/*.ts"],
  },
}
