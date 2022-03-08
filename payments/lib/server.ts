import { App } from './app';
import http from 'http';
import dotenv from 'dotenv'
import { Directories } from './directories';
import { OrderSubscriber } from './events/order-subscriber';

(async function init() {
    dotenv.config();
    const node = new App(process.env.PORT || 3000);
    const server = http.createServer(node.app);
    await node.listen(server);
    await node.rabbitmq(process.env.RabbitMQ_URI);
    await node.mongoose(process.env.MONGO_URI);
    await new OrderSubscriber().listenChannels();
    await Directories.createDirectories();
})();