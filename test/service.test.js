'use strict';

/* global describe, it, beforeEach, afterEach, expect */

/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

const request = require('supertest');

describe('service', () => {
  let service;

  beforeEach(() => {
    service = require('../service');
  });

  afterEach(() => {
    service.close();
  });

  it('responds to /', () => {
    return request(service)
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.text).toBe('ok');
      });
  });

  it('404 everything else', () => {
    return request(service)
      .get('/xxx')
      .expect(404);
  });
});
