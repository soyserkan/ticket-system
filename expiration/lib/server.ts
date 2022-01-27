import { App } from './app';
import dotenv from 'dotenv'
import { OrderSubscriber } from './events/order-subscriber';

(async function init() {
    dotenv.config();
    const node = new App();
    await node.rabbitmq(process.env.RabbitMQ_URI);
    new OrderSubscriber().listenChannels();
})();