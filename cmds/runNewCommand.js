const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const shell = require('shelljs');

const boilerplate = {
  name: 'homedo-vue3-boilerplate',
  url: 'https://github.com/rmlzy/homedo-vue3-boilerplate.git'
};

async function runNewCommand(folder) {
  if (!shell.which('git')) {
    shell.echo('抱歉, 没有检测到 git!');
    shell.exit(1);
  }
  const defaultProjectName = folder.split('/').pop();
  const targetPath = path.resolve(folder, '..');
  const answers = await inquirer.prompt([
    {
      name: 'projectName',
      type: 'input',
      message: '请输入项目名称',
      default: defaultProjectName
    }
  ]);
  console.log(chalk.green('开始下载模板...'));
  const cloneCmd = `cd ${targetPath}; git clone ${boilerplate.url} ${answers.projectName}`;
  if (shell.exec(cloneCmd).code !== 0) {
    shell.echo(chalk.red(`⚠️ 抱歉, 拉取 ${boilerplate.name} 失败!`));
    shell.exit(1);
  }

  console.log(chalk.green('✅ 下载成功, 开始安装依赖...'));
  const installCmd = `cd ${targetPath}/${answers.projectName}; npm install`;
  if (shell.exec(installCmd).code !== 0) {
    shell.echo(chalk.red(`⚠️ 抱歉, 依赖安装失败!`));
    shell.exit(1);
  }

  console.log(chalk.green(`✅ ${answers.projectName} 初始化成功!`));
}

module.exports = runNewCommand;
