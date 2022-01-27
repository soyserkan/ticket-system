import { rabbitmq } from '@serkans/rabbitmq-service';


export class App {
    constructor() {
    }
    async rabbitmq(url: string | undefined) {
        try {
            if (url) {
                await rabbitmq.connect(url);
                console.log('[RabbitMQ] connection successful');
            } else {
                console.error('[RabbitMQ] connection uri not found');
            }
        } catch (error) {
            console.log('[RabbitMQ] connection error: ' + error);
            process.exit(1);
        }
    }
}
