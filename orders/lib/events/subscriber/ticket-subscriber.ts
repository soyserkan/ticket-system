import { rabbitmq, Subscriber } from "@serkans/rabbitmq-service";
import { QueueName } from "../../types/queue-names";


export class TicketSubscriber {
    /**
     *
     */
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
    async TicketCreate(response) {
        console.log(response);
    }
    async TicketUpdate(response) {
        console.log(response);
    }
}