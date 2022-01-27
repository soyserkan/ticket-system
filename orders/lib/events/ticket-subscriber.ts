import { rabbitmq, Subscriber } from "@serkans/rabbitmq-service";
import { QueueName } from "../types/queue-names";
import Ticket from "../models/ticket";


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
        }

    }
    async TicketCreate(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            const { id, title, price } = content;
            if (content) {
                await new Ticket({ _id: id, title, price }).save();
                rabbitmq.channel.ack(msg);
            }
        }
    }
    async TicketUpdate(msg) {
        if (msg && msg.content) {
            const content = JSON.parse(msg.content.toString());
            if (content) {
                const ticket = await Ticket.findByEvent({ id: content.id, version: content.version });
                if (!ticket) {
                    throw new Error("Ticket not found!");
                } else {
                    await ticket.set({ title: content.title, price: content.price }).save();
                    rabbitmq.channel.ack(msg);
                }
            }
        }
    }
}