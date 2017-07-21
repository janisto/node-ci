'use strict';

/* global jest, jasmine, describe, it, beforeAll, afterAll, beforeEach, afterEach, expect */

const Test = require('../index');

describe('Test', () => {
  it('hello resolves', () => {
    const test = new Test();

    return expect(test.hello()).resolves.toEqual('hello');
  });
});
