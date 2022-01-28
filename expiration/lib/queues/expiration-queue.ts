import { Publisher, rabbitmq } from "@serkans/rabbitmq-service";
import Queue from "bull";
import { QueueName } from "../types/queue-names";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>(QueueName.ORDER_EXPIRATION, {
    redis: { host: process.env.REDIS_HOST }
});

expirationQueue.process(async function (job) {
    new Publisher(rabbitmq.channel).publish(QueueName.EXPIRATION_COMPLETE, {
        orderId: job.data.orderId
    })
})

export { expirationQueue };