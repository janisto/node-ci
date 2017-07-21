'use strict';

module.exports = class Sample {
  world() {
    return Promise.resolve('world');
  }

  test(num) {
    return num * 2;
  }
};
