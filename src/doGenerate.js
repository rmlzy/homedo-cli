const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const shell = require('shelljs');
const inquirer = require('inquirer');
const { sleep, logger } = require('./util');
const doGenerateList = require('./doGenerateList');
const doGenerateForm = require('./doGenerateForm');
const doGenerateDetail = require('./doGenerateDetail');

async function doGenerate() {
  const username = os.userInfo().username;
  logger.info(`小志：欢迎回来，${username}`);
  await sleep(1000);

  logger.info('小志：下边让我来检查一下你的环境。');
  await sleep(1000);

  const viewsPath = path.resolve('src/views');
  const viewsExisted = await fs.pathExists(viewsPath);
  if (!viewsExisted) {
    logger.info(`小志：很抱歉，我没有检测到 ${viewsPath}`);
    shell.exit(1);
  }

  logger.info('小志：很好，一些正常。');
  await sleep(1000);

  const { type } = await inquirer.prompt({
    name: 'type',
    type: 'list',
    message: '小志：今天想生成哪种代码？',
    choices: [
      { name: '列表页', value: 'list' },
      { name: '表单页', value: 'form' },
      { name: '详情页', value: 'detail' }
    ]
  });
  if (type === 'list') {
    await doGenerateList();
  }
  if (type === 'form') {
    doGenerateForm();
  }
  if (type === 'detail') {
    doGenerateDetail();
  }
}

module.exports = doGenerate;
