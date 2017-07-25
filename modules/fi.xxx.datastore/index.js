'use strict';

module.exports = class Datastore {
  test(num) {
    return Promise.resolve(num * 2);
  }
};
