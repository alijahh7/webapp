const { PubSub } = require('@google-cloud/pubsub');
const topicName = 'verify_email';
//projectId = 'dev-alijahh';
const pubsub = new PubSub();

// Publishes a message to the Pub/Sub topic
async function publishToPubSub(data) {
    const dataBuffer = Buffer.from(data);

    try {
        const messageId = await pubsub.topic(topicName).publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
        console.log(`Project: ${pubsub.projectId}`);
    } catch (error) {
        console.error(`Error publishing message: ${error}`);
    }
}

module.exports = {publishToPubSub}
