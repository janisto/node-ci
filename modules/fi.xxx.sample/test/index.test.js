'use strict';

/* global jest, jasmine, describe, it, beforeAll, afterAll, beforeEach, afterEach, expect */

const Sample = require('../index');

describe('Sample', () => {
  it('world resolves', () => {
    const sample = new Sample();

    return expect(sample.world()).resolves.toEqual('world');
  });
});
