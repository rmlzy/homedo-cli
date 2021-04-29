#!/usr/bin/env node

const path = require('path');
const cac = require('cac');
const sao = require('sao');
const update = require('update-notifier');

const pkg = require('./package');

const cli = cac('homedo');

cli
  .command('new <folder>', '创建新项目')
  .action((folder) => {
    const targetPath = path.resolve(folder);
    console.log(`> 正在下载代码至: ${targetPath}`);
  })
  .example('lass my-new-project');

cli
  .command('generate', '生成代码')
  .alias('g')
  .action(() => {});

cli.version(pkg.version);
cli.help();
cli.parse();

update({ pkg }).notify();
