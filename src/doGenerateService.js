const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const shell = require("shelljs");
const ejs = require("ejs");
const upperCase = require("uppercamelcase");
const { logger, readTemplate, getNameFromPath } = require("./util");

async function doGenerateService() {
  const {
    outputPath,
    needPage,
    needCreate,
    needDelete,
    needEdit,
    needDetail,
    fieldCount,
  } = await inquirer.prompt([
    {
      name: "outputPath",
      type: "input",
      message: "请输入文件路径，例如 ./views/demo",
      validate: (value) => {
        return !!value;
      },
    },
    {
      name: "needPage",
      type: "confirm",
      message: "是否需要列表接口?",
      default: true,
    },
    {
      name: "needCreate",
      type: "confirm",
      message: "是否需要新增接口?",
      default: true,
    },
    {
      name: "needDelete",
      type: "confirm",
      message: "是否需要删除接口?",
      default: true,
    },
    {
      name: "needEdit",
      type: "confirm",
      message: "是否需要修改接口?",
      default: true,
    },
    {
      name: "needDetail",
      type: "confirm",
      message: "是否需要详情接口?",
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

  logger.success("开始生成代码...");
  try {
    const upperCaseName = upperCase(name);
    const templateNames = ["template.interface.ts", "template.service.ts"];
    for (let i = 0; i < templateNames.length; i++) {
      const tmplName = templateNames[i];
      const outputName = tmplName.replace("template", name);
      const originTmpl = await readTemplate(`service/${tmplName}.txt`);
      const compiledTmpl = ejs.render(originTmpl, {
        name,
        upperCaseName,
        needPage,
        needCreate,
        needDelete,
        needEdit,
        needDetail,
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

module.exports = doGenerateService;
