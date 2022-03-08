import { Publisher, rabbitmq, Subscriber } from "@serkans/rabbitmq-service";
import { QueueName } from "../types/queue-names";
import Ticket from '../models/ticket';


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
                const ticket = await Ticket.findById(content.ticket.id);
                if (!ticket) {
                    throw new Error("Ticket not found!");
                }
                await ticket.set({ orderId: content.id }).save();
                await new Publisher(rabbitmq.channel).publish(QueueName.TICKET_UPDATE, {
                    id: ticket.id,
                    version: ticket.version,
                    title: ticket.title,
                    price: ticket.price,
                    userId: ticket.userId,
                    orderId: ticket.orderId
                });
                rabbitmq.channel.ack(msg);
            }
        }
    }
    async OrderDelete(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                const ticket = await Ticket.findById(content.ticket.id);
                if (!ticket) {
                    throw new Error("Ticket not found!");
                }
                await ticket.set({ orderId: undefined }).save();
                await new Publisher(rabbitmq.channel).publish(QueueName.TICKET_UPDATE, {
                    id: ticket.id,
                    version: ticket.version,
                    title: ticket.title,
                    price: ticket.price,
                    userId: ticket.userId,
                    orderId: ticket.orderId
                });
                rabbitmq.channel.ack(msg);
            }
        }
    }
}