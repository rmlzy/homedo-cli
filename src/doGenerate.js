const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
const inquirer = require("inquirer");
const { sleep, logger } = require("./util");
const doGenerateList = require("./doGenerateList");
const doGenerateForm = require("./doGenerateForm");
const doGenerateDetail = require("./doGenerateDetail");

async function doGenerate() {
  const viewsPath = path.resolve("src/views");
  const viewsExisted = await fs.pathExists(viewsPath);
  if (!viewsExisted) {
    logger.info(`抱歉，我没有检测到 ${viewsPath}`);
    shell.exit(1);
  }

  const { type } = await inquirer.prompt({
    name: "type",
    type: "list",
    message: "你要生成哪种代码?",
    choices: [
      { name: "列表页", value: "list" },
      { name: "表单页", value: "form" },
      { name: "详情页", value: "detail" },
    ],
  });
  if (type === "list") {
    await doGenerateList();
  }
  if (type === "form") {
    doGenerateForm();
  }
  if (type === "detail") {
    doGenerateDetail();
  }
}

module.exports = doGenerate;
