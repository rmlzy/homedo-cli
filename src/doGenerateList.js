const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const shell = require("shelljs");
const ejs = require("ejs");
const upperCase = require("uppercamelcase");
const { logger, readTemplate, isEmptyDir, getNameFromPath } = require("./util");

async function doGenerateList() {
  const {
    outputPath,
    serviceName,
    needQuery,
    queryCount,
    needAction,
    actionName,
    columnCount,
    needSelection,
    needIndexColumn,
    needScroll,
    needTableAction,
    needTableEdit,
    needTableDelete,
  } = await inquirer.prompt([
    {
      name: "outputPath",
      type: "input",
      message: "请输入文件路径，例如 ./views/demo/my-list",
      validate: (value) => {
        return !!value;
      },
    },
    {
      name: "serviceName",
      type: "input",
      message: "请输入Service名称, 例如 user",
      validate: (value) => {
        return !!value;
      },
    },
    {
      name: "queryCount",
      type: "input",
      message: "请输入查询条件个数?",
      default: 9,
    },
    {
      name: "needAction",
      type: "confirm",
      message: "是否需要操作按钮?",
      default: true,
    },
    {
      when: (ans) => ans.needAction,
      name: "actionName",
      type: "input",
      message: "请输入按钮名称(多个按钮用空格间隔)?",
      default: "",
    },
    {
      name: "columnCount",
      type: "input",
      message: "请输入表格列数?",
      default: 9,
    },
    {
      name: "needSelection",
      type: "confirm",
      message: "表格是否需要支持多选?",
      default: true,
    },
    {
      name: "needIndexColumn",
      type: "confirm",
      message: `表格是否需要"索引"列?`,
      default: true,
    },
    {
      name: "needScroll",
      type: "confirm",
      message: "表格是否需要支持横向滚动?",
      default: true,
    },
    {
      name: "needTableAction",
      type: "confirm",
      message: `表格是否需要"操作"列?`,
      default: true,
    },
    {
      when: (ans) => ans.needTableAction,
      name: "needTableEdit",
      type: "confirm",
      message: "表格是否需要编辑按钮?",
      default: true,
    },
    {
      when: (ans) => ans.needTableAction,
      name: "needTableDelete",
      type: "confirm",
      message: "表格是否需要删除按钮?",
      default: true,
    },
  ]);
  const name = getNameFromPath(outputPath);
  const targetPath = path.resolve("src", outputPath);
  await fs.ensureDir(targetPath);
  if (!isEmptyDir(targetPath)) {
    logger.fail(`src/views/${name} 非空`);
    shell.exit(1);
  }

  logger.success("开始生成代码...");
  try {
    const actionNames = (actionName || "").split(" ").map((item) => item.trim());
    const templateNames = [
      "index.vue",
      "template.component.html",
      "template.component.less",
      "template.component.ts",
      "template.constant.ts",
    ];
    for (let i = 0; i < templateNames.length; i++) {
      const tmplName = templateNames[i];
      const outputName = tmplName.replace("template", name);
      const originTmpl = await readTemplate(`list/${tmplName}.txt`);
      const compiledTmpl = ejs.render(originTmpl, {
        name,
        upperCaseName: upperCase(name),
        serviceName,
        upperCaseServiceName: upperCase(serviceName),
        queryCount: +queryCount,
        needAction,
        actionNames,
        columnCount,
        needSelection,
        needIndexColumn,
        needScroll,
        needTableAction,
        needTableEdit,
        needTableDelete,
      });
      await fs.outputFile(`${targetPath}/${outputName}`, compiledTmpl);
    }
    logger.success("代码生成成功!");

    logger.success("开始格式化代码...");
    const formatCmd = `./node_modules/.bin/prettier ${targetPath} --write`;
    const formatRes = shell.exec(formatCmd, { silent: true });
    if (formatRes.code !== 0) {
      logger.fail("格式化代码失败!");
      shell.exit(1);
    }
    logger.success("格式化代码成功!");
  } catch (e) {
    console.log(e);
    // pass
  }
}

module.exports = doGenerateList;
