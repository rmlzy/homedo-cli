#!/usr/bin/env node

const cac = require("cac");
const update = require("update-notifier");
const pkg = require("./package");
const doNew = require("./src/doNew");
const doGenerate = require("./src/doGenerate");

const cli = cac("homedo");

cli.command("new <folder>", "创建新项目").action(doNew).example("homedo new my-new-project");

cli.command("generate", "生成代码").alias("g").action(doGenerate).example("homedo g");

cli.version(pkg.version);
cli.help();
cli.parse();

update({ pkg }).notify();
