const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const shell = require("shelljs");
const ejs = require("ejs");
const upperCase = require("uppercamelcase");
const { logger, readTemplate, isEmptyDir, getNameFromPath } = require("./util");

async function doGenerateDetail() {
  const {
    outputPath,
    needPageHeader,
    pageHeaderTitle,
    pageHeaderAction,
    pageHeaderActionName,
    fieldCount,
  } = await inquirer.prompt([
    {
      name: "outputPath",
      type: "input",
      message: "请输入文件路径，例如 ./views/demo/my-detail",
      validate: (value) => {
        return !!value;
      },
    },
    {
      name: "needPageHeader",
      type: "confirm",
      message: "是否需要PageHeader?",
      default: true,
    },
    {
      when: (ans) => ans.needPageHeader,
      name: "pageHeaderTitle",
      type: "input",
      message: "请输入PageHeader名称:",
      default: "详情页",
    },
    {
      when: (ans) => ans.needPageHeader,
      name: "pageHeaderAction",
      type: "confirm",
      message: "PageHeader是否需要操作按钮?",
      default: true,
    },
    {
      when: (ans) => ans.needPageHeader,
      name: "pageHeaderActionName",
      type: "input",
      message: "请输入PageHeader按钮名称(多个按钮用空格间隔)?",
      default: "",
    },
    {
      name: "fieldCount",
      type: "input",
      message: "请输入字段条数?",
      default: 9,
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
    const pageHeaderActionNames = pageHeaderActionName.split(" ").map((item) => item.trim());
    const upperCaseName = upperCase(name);
    const templateNames = [
      "index.vue",
      "detail.component.html",
      "detail.component.less",
      "detail.component.ts",
      "detail.constant.ts",
      "detail.interface.ts",
      "detail.service.ts",
    ];
    for (let i = 0; i < templateNames.length; i++) {
      const tmplName = templateNames[i];
      const outputName = tmplName.replace("detail", name);
      const originTmpl = await readTemplate(`detail/${tmplName}.txt`);
      const compiledTmpl = ejs.render(originTmpl, {
        name,
        upperCaseName,
        needPageHeader,
        pageHeaderTitle,
        pageHeaderAction,
        pageHeaderActionNames,
        fieldCount,
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

module.exports = doGenerateDetail;
