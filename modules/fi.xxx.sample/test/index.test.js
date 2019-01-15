'use strict';

/* global describe, it, expect */

const Sample = require('../index');

describe('Sample', () => {
  it('world resolves', () => {
    const sample = new Sample();

    return expect(sample.world()).resolves.toEqual('world');
  });

  it('test return', () => {
    const sample = new Sample();

    return expect(sample.test(2)).resolves.toEqual(4);
  });
});
