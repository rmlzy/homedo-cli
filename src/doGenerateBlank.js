const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const shell = require("shelljs");
const ejs = require("ejs");
const upperCase = require("uppercamelcase");
const { logger, readTemplate, isEmptyDir, getNameFromPath } = require("./util");

async function doGenerateBlank() {
  const { outputPath, needConstant, needInterface, needService } = await inquirer.prompt([
    {
      name: "outputPath",
      type: "input",
      message: "请输入文件路径，例如 ./components/demo/my-component",
      validate: (value) => {
        return !!value;
      },
    },
    {
      name: "needConstant",
      type: "confirm",
      message: "是否需要 constant.ts?",
      default: true,
    },
    {
      name: "needInterface",
      type: "confirm",
      message: "是否需要 interface.ts?",
      default: true,
    },
    {
      name: "needService",
      type: "confirm",
      message: "是否需要 service.ts?",
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
    const upperCaseName = upperCase(name);
    const templateNames = [
      "index.vue",
      "blank.component.html",
      "blank.component.less",
      "blank.component.ts",
    ];
    if (needConstant) {
      templateNames.push("blank.constant.ts");
    }
    if (needInterface) {
      templateNames.push("blank.interface.ts");
    }
    if (needService) {
      templateNames.push("blank.service.ts");
    }
    for (let i = 0; i < templateNames.length; i++) {
      const tmplName = templateNames[i];
      const outputName = tmplName.replace("blank", name);
      const originTmpl = await readTemplate(`blank/${tmplName}.txt`);
      const compiledTmpl = ejs.render(originTmpl, { name, upperCaseName });
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

module.exports = doGenerateBlank;
