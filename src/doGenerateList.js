const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const shell = require('shelljs');
const nunjucks = require('nunjucks');
const ejs = require('ejs');
const upperCase = require('uppercamelcase');
const { sleep, logger, readTemplate, isEmptyDir } = require('./util');

async function doGenerateList() {
  await sleep(1000);
  logger.info('小志：好的，接下来需要你回答我几个问题。');
  await sleep(1000);

  const {
    name,
    needQuery,
    queryCount,
    needAction,
    actionName,
    needSelection,
    needScroll,
    scrollX
  } = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: '小志：起个名称吧, 比如说 my-demo。',
      validate: (value) => {
        return !!value;
      }
    },
    {
      name: 'needQuery',
      type: 'confirm',
      message: '小志：好的，需要查询条件吗？',
      default: true
    },
    {
      when: (ans) => ans.needQuery,
      name: 'queryCount',
      type: 'input',
      message: '小志：好的，需要几个查询条件呢？',
      default: 9
    },
    {
      name: 'needAction',
      type: 'confirm',
      message: '小志：好的，需要操作按钮吗？',
      default: true
    },
    {
      when: (ans) => ans.needAction,
      name: 'actionName',
      type: 'input',
      message: '小志：按钮名称是什么呢（多个按钮用空格间隔）？',
      default: ''
    },
    {
      name: 'needSelection',
      type: 'confirm',
      message: '小志：好的，表格需要支持多选吗?',
      default: true
    },
    {
      name: 'needScroll',
      type: 'confirm',
      message: '小志：好的，表格需要支持横向滚动吗?',
      default: true
    },
    {
      when: (ans) => ans.needScroll,
      name: 'scrollX',
      type: 'input',
      message: '小志：好的，你需要多宽的表格?',
      default: 1000,
      validate: (value) => {
        return value > 0;
      }
    }
  ]);
  const targetPath = path.resolve(`src/views/${name}`);
  await fs.ensureDir(targetPath);
  if (!isEmptyDir(targetPath)) {
    logger.fail(`src/views/${name} 非空`);
    shell.exit(1);
  }

  logger.success('小志：开始生成代码...');
  await sleep(1000);
  try {
    const actionNames = actionName.split(' ').map((item) => item.trim());
    const upperCaseName = upperCase(name);
    const templateNames = [
      'index.vue',
      'list.component.html',
      'list.component.less',
      'list.component.ts',
      'list.constant.ts',
      'list.interface.ts',
      'list.service.ts'
    ];
    for (let i = 0; i < templateNames.length; i++) {
      const tmplName = templateNames[i];
      const outputName = tmplName.replace('list', name);
      const originTmpl = await readTemplate(`list/${tmplName}`);
      const compiledTmpl = ejs.render(originTmpl, {
        name,
        upperCaseName,
        needQuery,
        queryCount: +queryCount,
        needAction,
        actionNames,
        needSelection,
        needScroll,
        scrollX
      });
      await fs.outputFile(`${targetPath}/${outputName}`, compiledTmpl);
    }
    logger.success('小志：代码生成成功！');

    await sleep(1000);
    logger.success('小志：开始格式化代码...');
    const formatCmd = `./node_modules/.bin/prettier ${targetPath} --write`;
    const formatRes = shell.exec(formatCmd, { silent: true });
    if (formatRes.code !== 0) {
      logger.fail('小志：格式化代码失败!');
      shell.exit(1);
    }
    logger.success('小志：格式化代码成功！');
  } catch (e) {
    console.log(e);
    // pass
  }
}

module.exports = doGenerateList;
