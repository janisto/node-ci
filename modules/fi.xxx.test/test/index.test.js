'use strict';

/* global describe, it, expect */

const Test = require('../index');

describe('Test', () => {
  it('hello resolves', () => {
    const test = new Test();

    return expect(test.hello()).resolves.toEqual('hello');
  });
});
