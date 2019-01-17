'use strict';

/* global jest, describe, it, beforeAll, afterAll, expect */

const { Datastore } = require('@google-cloud/datastore');
const Emulator = require('google-datastore-emulator');
const Module = require('../index');
const path = require('path');

jest.setTimeout(20 * 1000);

describe('Test Datastore', () => {
  // Each test suite needs to have a unique folder.
  const emulatorDir = path.resolve('./test/ds-test');
  let emulator;
  let ds;

  beforeAll(() => {
    const options = {
      debug: false,
      consistency: 1.0,
      host: 'localhost',
      port: 8090, // Each test suite needs to have a unique port.
      dataDir: emulatorDir,
    };
    emulator = new Emulator(options);
    return emulator.start().then(() => {
      // console.log('Emulator ready. Host: ', process.env.DATASTORE_EMULATOR_HOST);
      ds = new Datastore({
        keyFilename: {},
        projectId: 'test',
      });
      return true;
    });
  });

  afterAll(() => {
    return emulator.stop();
  });

  describe('Test save', () => {
    it('Save should resolve', () => {
      const key = ds.key(['TestData', 'id-1']);
      const data = [
        {
          name: 'createdAt',
          value: new Date(),
        },
        {
          name: 'title',
          value: 'Test',
          excludeFromIndexes: true,
        },
      ];

      return expect(
        ds.save({
          key: key,
          data: data,
        }),
      ).resolves.toBeDefined();
    });
  });

  describe('Test get', () => {
    it('Get should return entity', () => {
      const key = ds.key(['TestData', 'id-1']);
      const expected = {
        title: 'Test',
        createdAt: expect.any(Date),
      };

      return ds.get(key).then((result) => {
        expect(result[0]).toMatchObject(expected);
      });
    });
  });

  describe('Test query', () => {
    it('runQuery should return entities', async () => {
      const query = ds.createQuery('TestData').order('createdAt');
      const expected = {
        title: 'Test',
        createdAt: expect.any(Date),
      };

      const [tasks] = await ds.runQuery(query);
      expect(tasks.length).toBe(1);
      expect(tasks[0]).toMatchObject(expected);
    });
  });

  describe('Test delete', () => {
    it('Delete should delete entity', () => {
      const key = ds.key(['TestData', 'id-1']);

      return expect(ds.delete(key)).resolves.toBeDefined();
    });
  });
});

describe('Test class', () => {
  it('test', () => {
    const datastore = new Module();

    return expect(datastore.test(2)).resolves.toEqual(4);
  });
});
