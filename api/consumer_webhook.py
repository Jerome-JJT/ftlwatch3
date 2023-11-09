


from _utils import *
from _dbConnector import *
from _api import *
import requests
import json
import pika
import environ
from _utils import create_discord_payload


env = environ.Env()
environ.Env.read_env()

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def webhook_consumer(ch, method, properties, body):

    # ch.basic_ack(delivery_tag = method.delivery_tag)
    # ch.basic_reject(delivery_tag = method.delivery_tag, requeue=False)

    try:
        content = json.loads(body)

        # discord_channel = content["channel"]
        discord_channel = method.routing_key.split('.')[0]

        webhook_url = None

        for key in env.ENVIRON:
            if key.startswith("BOT_WEBHOOK_"):
                webhook_chan = key.replace("BOT_WEBHOOK_", "").lower()

                if webhook_chan == discord_channel:
                    webhook_url = env(key)

        if (webhook_url == None):
            raise Exception(f'{discord_channel} channel webhook not found')


        payload = create_discord_payload(content)

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(webhook_url, data=json.dumps(payload), headers=headers)

        if response.status_code != 204:
            raise Exception(f'Channel {discord_channel}, status {response.status_code}, Response: {response.text}')

        mylogger(f"Consume webhook {method.routing_key}, {discord_channel}", LOGGER_INFO)
        ch.basic_ack(delivery_tag = method.delivery_tag)


    except Exception as e:
        mylogger(f"Reject webhook {method.routing_key}, type {type(e)}, reason {e}", LOGGER_ERROR)

        new_properties = pika.BasicProperties(
            headers={'x-rejection-reason': f"Reject bot {method.routing_key}, type {type(e)}, reason {e}"}
        )

        ch.basic_publish(
            exchange='',
            routing_key='message_dlq',
            properties=new_properties,
            body=body
        )

        ch.basic_ack(delivery_tag = method.delivery_tag)
        # ch.basic_reject(delivery_tag = method.delivery_tag, requeue=False)

    return True
