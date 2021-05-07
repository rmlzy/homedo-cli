const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const shell = require("shelljs");
const ejs = require("ejs");
const upperCase = require("uppercamelcase");
const { logger, readTemplate, isEmptyDir, getNameFromPath } = require("./util");

async function doGenerateForm() {
  const {
    outputPath,
    pageHeaderTitle,
    pageHeaderDesc,
    needCreateContinue,
    needEdit,
    needFooter,
    fieldCount,
  } = await inquirer.prompt([
    {
      name: "outputPath",
      type: "input",
      message: "请输入文件路径，例如 ./views/demo/my-form",
      validate: (value) => {
        return !!value;
      },
    },
    {
      name: "pageHeaderTitle",
      type: "input",
      message: "请输入表单名称:",
      default: "表单",
    },
    {
      name: "pageHeaderDesc",
      type: "input",
      message: "请输入表单描述:",
      default: "一段简单的描述",
    },
    {
      name: "needCreateContinue",
      type: "confirm",
      message: "是否支持继续创建?",
      default: true,
    },
    {
      name: "needEdit",
      type: "confirm",
      message: "是否支持编辑?",
      default: true,
    },
    {
      name: "needFooter",
      type: "confirm",
      message: "是否需要固定在底部的操作按钮?",
      default: true,
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
    const upperCaseName = upperCase(name);
    const templateNames = [
      "index.vue",
      "form.component.html",
      "form.component.less",
      "form.component.ts",
      "form.constant.ts",
      "form.interface.ts",
      "form.service.ts",
    ];
    for (let i = 0; i < templateNames.length; i++) {
      const tmplName = templateNames[i];
      const outputName = tmplName.replace("form", name);
      const originTmpl = await readTemplate(`form/${tmplName}.txt`);
      const compiledTmpl = ejs.render(originTmpl, {
        name,
        upperCaseName,
        pageHeaderTitle,
        pageHeaderDesc,
        needCreateContinue,
        needEdit,
        needFooter,
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

module.exports = doGenerateForm;
