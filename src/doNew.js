const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const shell = require("shelljs");
const nunjucks = require("nunjucks");
const { detectGit, logger, readTemplate } = require("./util");

const boilerplate = {
  name: "homedo-vue3-boilerplate",
  url: "https://github.com/rmlzy/homedo-vue3-boilerplate.git",
};

async function doNew(folder) {
  detectGit();
  const defaultName = folder.split("/").pop();
  const targetPath = path.resolve(folder, "..");
  const answers = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "请输入项目名称",
      default: defaultName,
    },
    {
      name: "description",
      type: "input",
      message: "请输入项目描述",
    },
    {
      name: "useNexus",
      type: "confirm",
      message: "是否使用 homedo 私服?",
      default: true,
    },
    {
      name: "installImmediately",
      type: "confirm",
      message: "是否现在下载依赖?",
      default: true,
    },
  ]);

  logger.success("开始下载模板...");
  const repoPath = `${targetPath}/${answers.name}`;
  const cloneCmd = `
    cd ${targetPath};
    git clone ${boilerplate.url} ${answers.name};
    rm -rf ${repoPath}/.git`;
  const cloneRes = shell.exec(cloneCmd, { silent: true });
  if (cloneRes.code !== 0) {
    logger.fail("模板下载失败!");
    logger.fail(cloneRes.stderr);
    shell.exit(1);
  }
  logger.success("模板下载成功!");

  const readmeTmpl = await readTemplate("README.md");
  const readme = nunjucks.renderString(readmeTmpl, {
    name: answers.name,
    description: answers.description,
  });
  await fs.outputFile(`${repoPath}/README.md`, readme);

  if (answers.useNexus) {
    const npmrc = await readTemplate(".homedo.npmrc");
    await fs.outputFile(`${repoPath}/.npmrc`, npmrc);
  }

  if (answers.installImmediately) {
    logger.success("开始安装依赖...");
    const installCmd = `cd ${repoPath}; npm install`;
    if (shell.exec(installCmd, { silent: true }).code !== 0) {
      logger.fail("依赖安装失败!");
      shell.exit(1);
    }
    logger.success("依赖安装成功!");
  }

  logger.success(`${answers.name} 初始化成功!`);
}

module.exports = doNew;
