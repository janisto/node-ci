'use strict';

module.exports = class Test {
  saySomething(str) {
    return `Say: ${str}`;
  }

  hello() {
    return Promise.resolve('hello');
  }
};
