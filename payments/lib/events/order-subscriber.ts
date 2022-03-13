import { Publisher, rabbitmq, Subscriber } from "@serkans/rabbitmq-service";
import { QueueName } from "../types/queue-names";
import Order from '../models/order';
import { OrderStatus } from "../types/order-status";


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
            subscriber.listen(QueueName.ORDER_CANCEL, optionsCallback => {
                self.OrderCancel(optionsCallback);
            });
        }

    }
    async OrderCreate(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                await new Order({
                    _id: content.id,
                    price: content.ticket.price,
                    status: content.status,
                    userId: content.userId,
                    version: content.version
                }).save();
                rabbitmq.channel.ack(msg);
            }
        }
    }
    async OrderCancel(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                const order = await Order.findOne({ _id: content.id, version: content.version - 1 });
                if (!order) {
                    throw new Error("Order not found!");
                }
                await order.set({ status: OrderStatus.Cancelled }).save();
                rabbitmq.channel.ack(msg);
            }
        }
    }
}