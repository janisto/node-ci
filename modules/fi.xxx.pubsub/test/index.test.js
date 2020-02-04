'use strict';

/* global jest, describe, it, beforeAll, afterAll, expect */

const Emulator = require('google-pubsub-emulator');
const PubSub = require('../index');
const path = require('path');

jest.setTimeout(180 * 1000);

const ACK_TIMEOUT = 2 * 1000; // milliseconds
const NACK_DELAY = 20; // seconds
const EXPECTED_DELAY = NACK_DELAY * 1000 + ACK_TIMEOUT;
const PROJECT_ID = 'fake-project';

describe('fi.st1.pubsub messages', () => {
  // Each test suite needs to have a unique folder.
  const emulatorDir = path.resolve('./test/ps-test');
  let emulator;
  let ps;

  beforeAll(() => {
    const options = {
      debug: false,
      host: 'localhost',
      port: 8282, // Each test suite needs to have a unique port.
      dataDir: emulatorDir,
    };

    emulator = new Emulator(options);
    return emulator.start().then(() => {
      // console.log('Pubsub emulator ready. Host: ', process.env.PUBSUB_EMULATOR_HOST);
      ps = new PubSub({
        projectId: PROJECT_ID,
      });
      return true;
    });
  });

  afterAll((done) => {
    setTimeout(() => {
      return emulator.stop().then(() => {
        done();
      });
    }, 11000);
    // Default '@google-cloud/pubsub' ackDeadline is 10000.
    // '@google-cloud/pubsub' tries to modify ackDeadlines automatically,
    // so we need to take that into account when exiting.
  });

  describe('Methods', () => {
    it('subscribeToTopic() and ack messages', (done) => {
      const topicName = 'topic-1';
      const subName = 'subscription-1';
      const messageCount = 10;
      let sendCount = 0;
      let sendInterval;
      let ackCount = 0;
      let sub;

      const subscriptionOnMessage = (msg) => {
        if (msg.attributes.orderId) {
          setTimeout(() => {
            ackCount += 1;
            // console.log('subscriptionOnMessage acked', msg.attributes.orderId);
            msg.ack();
            if (ackCount === messageCount) {
              sub.removeListener('message', subscriptionOnMessage);
              // console.log(`${messageCount} messages acked`);
              expect(ackCount).toEqual(messageCount);
              done();
            }
          }, ACK_TIMEOUT);
        }
      };

      const sendMessage = async () => {
        if (sendCount >= messageCount) {
          clearInterval(sendInterval);
          return;
        }
        sendCount += 1;

        // console.log(`Sending message ${sendCount}`);
        const start = Date.now();
        await ps.publishMessageToTopic(
          topicName,
          { test: `data-${sendCount}` },
          { orderId: `msg-${sendCount}` },
          { batching: { maxMessages: 1, maxMilliseconds: 10 } },
        );
        const end = Date.now();
        const duration = end - start;
        expect(duration).toBeLessThan(2000);
        // console.log(`Message sent. Duration: ${duration}ms`);
      };

      const options = {
        // ackDeadline: 60,
        flowControl: {
          maxMessages: 1,
        },
      };
      ps.subscribeToTopic(topicName, subName, options)
        .then((subscription) => {
          expect(subscription.name).toBe(`projects/${PROJECT_ID}/subscriptions/${subName}`);
          sub = subscription;
          sub.on('message', subscriptionOnMessage);
        })
        .then(() => {
          sendInterval = setInterval(sendMessage, 300);
        });
    });

    it.skip('subscribeToTopic() and ack messages after retry', (done) => {
      const topicName = 'topic-2';
      const subName = 'subscription-2';
      const messageCount = 10;
      const retryCount = 4 * messageCount;
      const start = [];
      let sendCount = 0;
      let sendInterval;
      let ackRetry = 0;
      let ackCount = 0;
      let sub;

      const subscriptionOnMessage = (msg) => {
        if (msg.attributes.orderId) {
          const orderId = msg.attributes.orderId;
          setTimeout(() => {
            ackRetry += 1;
            // console.log('subscriptionOnMessage received', orderId);
            if (ackRetry > retryCount) {
              ackCount += 1;

              const now = Date.now();
              const duration = now - start[orderId];
              expect(duration).toBeGreaterThan(EXPECTED_DELAY);
              // console.log(`acked orderId: ${orderId}. Delay: ${duration}ms`);

              msg.ack();
              if (ackCount === messageCount) {
                sub.removeListener('message', subscriptionOnMessage);
                // console.log(`${messageCount} messages acked`);
                expect(ackCount).toEqual(messageCount);
                done();
              }
            } else {
              if (!start[orderId]) {
                start[orderId] = Date.now();
                // console.log(`nacked orderId: ${orderId}.`);
              } else {
                const now = Date.now();
                const duration = now - start[orderId];
                start[orderId] = Date.now();
                expect(duration).toBeGreaterThan(EXPECTED_DELAY);
                // console.log(`nacked orderId: ${orderId}. Delay: ${duration}ms`);
              }
              msg.nack(NACK_DELAY);
            }
          }, ACK_TIMEOUT);
        }
      };

      const sendMessage = async () => {
        if (sendCount >= messageCount) {
          clearInterval(sendInterval);
          return;
        }
        sendCount += 1;

        // console.log(`Sending message ${sendCount}`);
        const start = Date.now();
        await ps.publishMessageToTopic(
          topicName,
          { test: `data-${sendCount}` },
          { orderId: `msg-${sendCount}` },
          { batching: { maxMessages: 1, maxMilliseconds: 10 } },
        );
        const end = Date.now();
        const duration = end - start;
        expect(duration).toBeLessThan(2000);
        // console.log(`Message sent. Duration: ${duration}ms`);
      };

      const options = {
        ackDeadline: 60,
        flowControl: {
          maxMessages: messageCount,
        },
      };
      ps.subscribeToTopic(topicName, subName, options)
        .then((subscription) => {
          expect(subscription.name).toBe(`projects/${PROJECT_ID}/subscriptions/${subName}`);
          sub = subscription;
          sub.on('message', subscriptionOnMessage);
        })
        .then(() => {
          sendInterval = setInterval(sendMessage, 300);
        });
    });
  });
});
