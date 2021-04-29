const fs = require('fs');
const path = require('path');
const camelcase = require('camelcase');
const debug = require('debug')('lass');
const execa = require('execa');
const fetchGithubUsername = require('github-username');
const fixpack = require('fixpack');
const githubUsernameRegex = require('github-username-regex');
const isEmail = require('is-email');
const isURL = require('is-url');
const isValidNpmName = require('is-valid-npm-name');
const npmConf = require('npm-conf');
const semver = require('semver');
const slug = require('speakingurl');
const spawn = require('cross-spawn');
const spdxLicenseList = require('spdx-license-list/full');
const superb = require('superb');
const uppercamelcase = require('uppercamelcase');
const { which } = require('shelljs');

const conf = npmConf();

module.exports = {
  updateNotify: true,
  enforceNewFolder: true,
  templateOptions: {
    context: {
      camelcase,
      uppercamelcase
    }
  },
  prompts: {
    templateType: {
      message: '请选择模板类型',
      choices: ['npm', 'yarn'],
      type: 'list',
      default: 'npm',
      store: true
    }
  },
  move: {
    gitignore: '.gitignore',
    README: 'README.md',
    package: 'package.json',
    nycrc: '.nycrc'
  },
  filters: {
    LICENSE: 'license === "MIT"',
    'node_modules/**': false
  },
  post: async (ctx) => {}
};
