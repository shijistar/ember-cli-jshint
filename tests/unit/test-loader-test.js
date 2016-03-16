/* globals QUnit */
import { module, test } from 'qunit';

module('Unit | test loader', {
  beforeEach() {
    this.TestLoader = window.require('ember-cli/test-loader')['default'];

    this.originalRequire = window.require;
    this.requiredModules = [];
    window.require = (name) => {
      this.requiredModules.push(name);
    };

    window.requirejs.entries = {
      'valid-test': true,
      'valid.jshint': true,
      'valid.lint-test': true,
      'valid-no-dot-lint-test': true,
      'nohyphentest': true,
    };

    this.originalURLParams = QUnit.urlParams;
    QUnit.urlParams = {};
  },

  afterEach() {
    QUnit.urlParams = this.originalURLParams;
    window.require = this.originalRequire;
  }
});

test('with nolint unconfigured', function(assert) {
  this.TestLoader.load();

  assert.deepEqual(
    this.requiredModules,
    [
      'valid-test',
      'valid.jshint',
      'valid.lint-test',
      'valid-no-dot-lint-test'
    ],
    "loads modules that end in -test.js, .jshint, or .lint-test");
});

test('with nolint option enabled', function(assert) {
  QUnit.urlParams.nolint = true;
  this.TestLoader.load();

  assert.deepEqual(
    this.requiredModules,
    ['valid-test', 'valid-no-dot-lint-test'],
    "Only loads the test module"
  );
});
