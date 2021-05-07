const { getInstalledPath } = require("get-installed-path");
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const shell = require("shelljs");

const CLI_CONFIG = ".homedo-cli.json";

module.exports.getNameFromPath = function getNameFromPath(filePath) {
  return (filePath || "").split("/").pop();
};

module.exports.sleep = function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports.detectGit = function () {
  if (!shell.which("git")) {
    shell.echo("抱歉, 没有检测到 git!");
    shell.exit(1);
  }
};

module.exports.logger = {
  success: function success(text) {
    console.log(chalk.green(text));
  },
  fail: function fail(text) {
    console.log(chalk.red(text));
  },
  info: function fail(text) {
    console.log(chalk.whiteBright(text));
  },
};

module.exports.readTemplate = async function (name) {
  const rootPath = await getInstalledPath("homedo-cli", {});
  const tmplPath = path.resolve(rootPath, `src/templates/${name}`);
  console.log(tmplPath);
  return fs.readFile(tmplPath, "utf8");
};

module.exports.isEmptyDir = function (dirPath) {
  return fs.readdirSync(dirPath).length === 0;
};
