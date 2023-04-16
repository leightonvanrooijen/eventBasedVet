module.exports = {
  default: {
    paths: ["./src/**/acceptanceTests/**/?(*.)+feature"],
    requireModule: ["ts-node/register"],
    parallel: 1,
    // format: ["json:reports/report.cucumber.json", "summary"],
    // formatOptions: { snippetInterface: "async-await" },
    tags: "@procedure or @acceptance or @invoice",
    publishQuiet: true,
    require: ["./src/**/acceptanceTests/**/*.ts"],
  },
}
