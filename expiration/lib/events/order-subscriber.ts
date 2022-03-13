import { Publisher, rabbitmq, Subscriber } from "@serkans/rabbitmq-service";
import { expirationQueue } from "../queues/expiration-queue";
import { QueueName } from "../types/queue-names";


export class OrderSubscriber {
    constructor() {
    }
    async listenChannels() {
        var self = this;
        var subscriber = await new Subscriber(rabbitmq.channel);
        if (subscriber) {
            subscriber.listen(QueueName.ORDER_CREATE, optionsCallback => {
                self.OrderCreate(optionsCallback);
            });
        }

        
    }
    async OrderCreate(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                const delay = new Date(content.expiresAt).getTime() - new Date().getTime();
                console.log("Scheduled job for", delay);
                console.log(content);
                await expirationQueue.add({ orderId: content.id }, { delay });
                rabbitmq.channel.ack(msg);
            }
        }
    }
}