import { Publisher, rabbitmq, Subscriber } from "@serkans/rabbitmq-service";
import { QueueName } from "../types/queue-names";
import Ticket from "../models/ticket";
import Order from "../models/order";
import { OrderStatus } from "../types/order-status";


export class TicketSubscriber {
    constructor() {
    }
    async listenChannels() {
        var self = this;
        var subscriber = await new Subscriber(rabbitmq.channel);
        if (subscriber) {
            subscriber.listen(QueueName.TICKET_CREATE, optionsCallback => {
                self.TicketCreate(optionsCallback);
            });
            subscriber.listen(QueueName.TICKET_UPDATE, optionsCallback => {
                self.TicketUpdate(optionsCallback);
            });
            subscriber.listen(QueueName.EXPIRATION_COMPLETE, optionsCallback => {
                self.ExpirationComplete(optionsCallback);
            });
            subscriber.listen(QueueName.PAYMENT_CREATE, optionsCallback => {
                self.PaymentCreate(optionsCallback);
            });
        }
    }
    async TicketCreate(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            const { id, title, price } = content;
            if (content) {
                await Ticket.create({ _id: id, title, price });
                rabbitmq.channel.ack(msg);
            }
        }
    }
    async TicketUpdate(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                const ticket = await Ticket.findOne({ _id: content.id, version: content.version - 1 });
                if (!ticket) {
                    throw new Error("Ticket not found!");
                } else {
                    await ticket.set({ title: content.title, price: content.price }).save();
                    rabbitmq.channel.ack(msg);
                }
            }
        }
    }
    async ExpirationComplete(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                console.log(content);
                const order = await Order.findById(content.orderId).populate('ticket');
                if (!order) {
                    throw new Error("Ticket not found!");
                } else {
                    if (order.status == OrderStatus.Complete) {
                        return rabbitmq.channel.ack(msg);
                    }
                    await order.set({ status: OrderStatus.Cancelled }).save();
                    await new Publisher(rabbitmq.channel).publish(QueueName.ORDER_CANCEL, {
                        id: order.id,
                        version: order.version,
                        ticket: {
                            id: order.ticket.id
                        }
                    })
                    rabbitmq.channel.ack(msg);
                }
            }
        }
    }
    async PaymentCreate(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                const order = await Order.findById(content.orderId);
                if (!order) {
                    throw new Error("Order not found!");
                } else {
                    await order.set({ status: OrderStatus.Complete }).save();
                    rabbitmq.channel.ack(msg);
                }
            }
        }
    }
}