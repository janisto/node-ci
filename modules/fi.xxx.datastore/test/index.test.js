'use strict';

/* global jest, jasmine, describe, it, beforeAll, afterAll, beforeEach, afterEach, expect */

/* eslint-disable import/no-extraneous-dependencies */
const Emulator = require('google-datastore-emulator');
/* eslint-enable import/no-extraneous-dependencies */
const Datastore = require('@google-cloud/datastore');
const Module = require('../index');
const path = require('path');

// Increase timeout
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('Test Datastore', () => {
  // Each test suite needs to have a unique folder.
  const emulatorDir = path.resolve('./test/ds-test');
  let emulator;
  let ds;

  beforeAll(() => {
    const options = {
      consistency: 1.0,
      host: 'localhost',
      port: 8090, // Each test suite needs to have a unique port.
      dataDir: emulatorDir
    };
    emulator = new Emulator(options);
    return emulator.start()
    .then(() => {
      // console.log('Emulator ready. Host: ', process.env.DATASTORE_EMULATOR_HOST);
      ds = Datastore({
        keyFilename: {},
        projectId: 'test'
      });
      return true;
    });
  });

  afterAll(() => {
    return emulator.stop();
  });

  describe('Test save', () => {
    it('Save promise should resolve', () => {
      const key = ds.key(['TestData']);
      const data = {
        title: 'Test'
      };

      return expect(ds.save({
        key: key,
        data: data
      })).resolves.toBeDefined();
    });
  });
});

describe('Test class', () => {
  it('test', () => {
    const datastore = new Module();

    return expect(datastore.test(2)).resolves.toEqual(4);
  });
});
