import environ
import pika
import click
from _utils import *

from consumer_api import api_consumer
from consumer_webhook import webhook_consumer

env = environ.Env()
environ.Env.read_env()

credentials = pika.PlainCredentials(env('RABBIT_USER'), env('RABBIT_PASS'))
parameters = pika.ConnectionParameters('rabbit', 5672, '/', credentials)

def send_to_rabbit(routing_key, body):

    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    channel.basic_publish(exchange="main", routing_key=routing_key, body=body, 
        properties=pika.BasicProperties(delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE))

    connection.close()


# def callback(ch, method, properties, body):
#     print("Receiveed", body)

#     ch.basic_ack(delivery_tag = method.delivery_tag)
    # ch.basic_reject(delivery_tag = method.delivery_tag, requeue=False)


@click.command()
@click.option("--server", type=bool, help="server mode")
def main(server = False):
    if (server):
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()

        channel.basic_qos(prefetch_count=1)


        channel.basic_consume(queue='slow.update.queue', auto_ack=False, on_message_callback=api_consumer)
        channel.basic_consume(queue='fast.update.queue', auto_ack=False, on_message_callback=api_consumer)
        
        channel.basic_consume(queue='server.message.queue', auto_ack=False, on_message_callback=webhook_consumer)

        channel.start_consuming()

if __name__ == '__main__':
    main()
    

    