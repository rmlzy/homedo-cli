const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
const inquirer = require("inquirer");
const { logger } = require("./util");
const doGenerateBlank = require("./doGenerateBlank");
const doGenerateList = require("./doGenerateList");
const doGenerateForm = require("./doGenerateForm");
const doGenerateDetail = require("./doGenerateDetail");
const doGenerateModalBtn = require("./doGenerateModalBtn");

async function doGenerate() {
  const srcPath = path.resolve("src");
  const srcExisted = await fs.pathExists(srcPath);
  if (!srcExisted) {
    logger.info(`抱歉，没有检测到 ${srcPath}`);
    shell.exit(1);
  }

  const { type } = await inquirer.prompt({
    name: "type",
    type: "list",
    message: "你要生成哪种代码?",
    choices: [
      { name: "空白模板", value: "blank" },
      { name: "河姆渡通用列表页", value: "list" },
      { name: "河姆渡通用表单页", value: "form" },
      { name: "河姆渡通用详情页", value: "detail" },
      { name: "带表单模态框的按钮", value: "modal-btn" },
    ],
  });
  if (type === "blank") {
    await doGenerateBlank();
  }
  if (type === "list") {
    await doGenerateList();
  }
  if (type === "form") {
    await doGenerateForm();
  }
  if (type === "detail") {
    await doGenerateDetail();
  }
  if (type === "modal-btn") {
    await doGenerateModalBtn();
  }
}

module.exports = doGenerate;
