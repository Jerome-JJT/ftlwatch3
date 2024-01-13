import environ
import pika
import json
import threading
import time
import sys


env = environ.Env()
environ.Env.read_env()

credentials = pika.PlainCredentials(env('RABBIT_USER'), env('RABBIT_PASS'))
parameters = pika.ConnectionParameters('rabbit', 5672, '/', credentials)

def custom_reject(dlq, ch, method, body, reason=""):
    new_properties = pika.BasicProperties(
        headers={'x-rejection-reason': f"Reject update {method.routing_key}, reason : {reason}"}
    )

    ch.basic_publish(
        exchange='',
        routing_key=dlq,
        properties=new_properties,
        body=body
    )

    ch.basic_ack(delivery_tag = method.delivery_tag)


def send_to_rabbit(routing_key, body):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    if (type(body) == type({})):
        body = json.dumps(body)

    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    channel.basic_publish(exchange="main", routing_key=routing_key, body=body, 
        properties=pika.BasicProperties(delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE))

    mylogger(f'Sent to rabbit {routing_key}', LOGGER_DEBUG, rabbit=False)

    connection.close()



# def test_worker_1(ch, method, properties, body, reject_first=False):
#     print("worker1 activate", body, reject_first)
#     time.sleep(int(body))
#     print("worker1 end")
#     print("")

#     ch.basic_ack(delivery_tag = method.delivery_tag)


# def test_worker_2(ch, method, properties, body, reject_first=False):
#     print("worker2 activate", body, reject_first)
#     time.sleep(int(body))
#     print("worker2 end")
#     print("")

#     ch.basic_ack(delivery_tag = method.delivery_tag)




from consumer_api import api_consumer
from consumer_webhook import webhook_consumer


def reject_flag(flag):
    tmp = flag[0]
    flag[0] = False
    return tmp

def rabbit_connection(queue, consumer_function):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    reject_first = [False]

    while (1):

        try:
            mylogger(f"Start rabbit connection for {queue}", LOGGER_INFO)

            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()

            channel.basic_qos(prefetch_count=1)

            channel.basic_consume(queue=queue, auto_ack=False, 
                                  on_message_callback=lambda ch, method, properties, body: consumer_function(ch, method, properties, body, reject_first=reject_flag(reject_first)))
            channel.start_consuming()

        except pika.exceptions.ChannelClosedByBroker:
            mylogger(f"Message timeout in {queue}", LOGGER_ERROR)
            reject_first = [True]
            time.sleep(1)

        except pika.exceptions.AMQPConnectionError:
            mylogger(f"RabbitMQ connection error", LOGGER_ERROR)
            time.sleep(60)


        mylogger(f"Forbidden looping for {queue}", LOGGER_WARNING)
        time.sleep(1)




working = [
    {"queue": "slow.update.queue", "function": api_consumer},
    {"queue": "fast.update.queue", "function": api_consumer},

    {"queue": "server.message.queue", "function": webhook_consumer},
    {"queue": "servercomplain.message.queue", "function": webhook_consumer},
]

# working_test = [
#     {"queue": "slow.update.queue", "function": test_worker_1},
#     {"queue": "fast.update.queue", "function": test_worker_2},
# ]




def main(server=False):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    if (server):

        print("Waiting 5 seconds for rabbit")
        time.sleep(5)
        print("Starting rabbit consumers")
        
        threads = []
        for i in working:
            threads.append(threading.Thread(target=rabbit_connection, args=(i["queue"],i["function"],)))
            threads[-1].start()
            time.sleep(0.5)

        for num, thread in enumerate(threads):
            thread.join()
            mylogger(f"Thread {num} exited", LOGGER_ERROR)


if __name__ == '__main__':
    main(True if len(sys.argv) >= 3 and sys.argv[1:3] == ['-server', '1'] else False)
    

    