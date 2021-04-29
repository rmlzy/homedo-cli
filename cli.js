#!/usr/bin/env node

const cac = require('cac');
const update = require('update-notifier');
const pkg = require('./package');
const runNewCommand = require('./cmds/runNewCommand');
const runGenerateCommand = require('./cmds/runGenerateCommand');

const cli = cac('homedo');

cli
  .command('new <folder>', '创建新项目')
  .action(runNewCommand)
  .example('homedo new my-new-project');

cli.command('generate', '生成代码').alias('g').action(runGenerateCommand);

cli.version(pkg.version);
cli.help();
cli.parse();

update({ pkg }).notify();
