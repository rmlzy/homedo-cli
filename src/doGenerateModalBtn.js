const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const shell = require("shelljs");
const ejs = require("ejs");
const upperCase = require("uppercamelcase");
const { logger, readTemplate, isEmptyDir, getNameFromPath } = require("./util");

async function doGenerateModalBtn() {
  const {
    outputPath,
    createButtonText,
    editButtonText,
    title,
    needModalWidth,
    modalWidth,
    maskClosable,
    keyboard,
    needOkText,
    okText,
    needCancelText,
    cancelText,
    fieldCount,
  } = await inquirer.prompt([
    {
      name: "outputPath",
      type: "input",
      message: "请输入文件路径，例如 ./views/demo/my-modal-btn",
      validate: (value) => {
        return !!value;
      },
    },
    {
      name: "createButtonText",
      type: "input",
      message: "请输入新建状态时按钮的名称:",
      default: "新建",
    },
    {
      name: "editButtonText",
      type: "input",
      message: "请输入编辑状态时按钮的名称:",
      default: "编辑",
    },
    {
      name: "title",
      type: "input",
      message: "请输入模态框标题:",
      default: "",
    },
    {
      name: "needModalWidth",
      type: "confirm",
      message: "是否需要指定模态框宽度?",
      default: false,
    },
    {
      when: (ans) => ans.needModalWidth,
      name: "modalWidth",
      type: "input",
      message: "请输入模态框宽度:",
      default: 800,
    },
    {
      name: "maskClosable",
      type: "confirm",
      message: "点击模态框蒙层是否允许关闭?",
      default: false,
    },
    {
      name: "keyboard",
      type: "confirm",
      message: "是否支持键盘 esc 关闭模态框?",
      default: false,
    },
    {
      name: "needOkText",
      type: "confirm",
      message: "是否需要指定模态框确认按钮文字?",
      default: false,
    },
    {
      when: (ans) => ans.needOkText,
      name: "okText",
      type: "input",
      message: "请输入模态框确认按钮文字:",
      default: "确定",
    },
    {
      name: "needCancelText",
      type: "confirm",
      message: "是否需要指定模态框取消按钮文字?",
      default: false,
    },
    {
      when: (ans) => ans.needCancelText,
      name: "cancelText",
      type: "input",
      message: "请输入模态框取消按钮文字:",
      default: "取消",
    },
    {
      name: "fieldCount",
      type: "input",
      message: "请输入模态框中表单字段条数?",
      default: 4,
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
      "modal-btn.component.html",
      "modal-btn.component.less",
      "modal-btn.component.ts",
      "modal-btn.constant.ts",
      "modal-btn.interface.ts",
      "modal-btn.service.ts",
    ];
    for (let i = 0; i < templateNames.length; i++) {
      const tmplName = templateNames[i];
      const outputName = tmplName.replace("modal-btn", name);
      const originTmpl = await readTemplate(`modal-btn/${tmplName}.txt`);
      const compiledTmpl = ejs.render(originTmpl, {
        name,
        upperCaseName,
        createButtonText,
        editButtonText,
        title,
        needModalWidth,
        modalWidth,
        maskClosable,
        keyboard,
        needOkText,
        okText,
        needCancelText,
        cancelText,
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

module.exports = doGenerateModalBtn;
