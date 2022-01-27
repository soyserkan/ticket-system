import { Publisher, rabbitmq, Subscriber } from "@serkans/rabbitmq-service";
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
            subscriber.listen(QueueName.ORDER_DELETE, optionsCallback => {
                self.OrderDelete(optionsCallback);
            });
        }

    }
    async OrderCreate(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                
                rabbitmq.channel.ack(msg);
            }
        }
    }
    async OrderDelete(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                
                rabbitmq.channel.ack(msg);
            }
        }
    }
}