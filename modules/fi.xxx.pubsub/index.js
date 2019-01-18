'use strict';

const GoogleCloudPubSub = require('@google-cloud/pubsub').PubSub;

module.exports = class PubSub {
  constructor(config) {
    this.config = config;

    this.api = new GoogleCloudPubSub({
      projectId: this.config.projectId,
    });
  }

  async getTopic(topicName, options = {}) {
    const topic = this.api.topic(topicName);
    const [exists] = await topic.exists();
    if (!exists) {
      await topic.create(options);
    }
    return topic;
  }

  async getSubscription(topic, subscriptionName, options = {}) {
    const subscription = topic.subscription(subscriptionName, options);
    const [exists] = await subscription.exists();
    if (!exists) {
      await subscription.create(options);
    }
    return subscription;
  }

  async publishMessageToTopic(topicName, data = {}, attributes = {}, options = {}) {
    const topic = await this.getTopic(topicName);
    topic.setPublishOptions(options);
    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(JSON.stringify(data));
    }
    const messageId = await topic.publish(data, attributes);
    return messageId;
  }

  async subscribeToTopic(topicName, subscriptionName, options = {}) {
    const topic = await this.getTopic(topicName);
    const subscription = await this.getSubscription(topic, subscriptionName, options);
    return subscription;
  }
};
