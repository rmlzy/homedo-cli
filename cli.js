#!/usr/bin/env node

const path = require('path');
const cac = require('cac');
const chalk = require('chalk');
const inquirer = require('inquirer');
const update = require('update-notifier');
const shell = require('shelljs');
const pkg = require('./package');
const cli = cac('homedo');

const boilerplate = {
  name: 'homedo-vue3-boilerplate',
  url: 'https://github.com/rmlzy/homedo-vue3-boilerplate.git'
};

cli
  .command('new <folder>', '创建新项目')
  .action(async (folder) => {
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
  })
  .example('homedo new my-new-project');

cli
  .command('generate', '生成代码')
  .alias('g')
  .action(() => {});

cli.version(pkg.version);
cli.help();
cli.parse();

update({ pkg }).notify();
