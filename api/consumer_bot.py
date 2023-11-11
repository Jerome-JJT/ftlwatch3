


from _dbConnector import *
from _api import *
import requests
import json
import pika
import environ
from _utils_discord import create_discord_payload

env = environ.Env()
environ.Env.read_env()

async def bot_consumer(bot, ch, method, properties, body):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    # ch.basic_ack(delivery_tag = method.delivery_tag)
    # ch.basic_reject(delivery_tag = method.delivery_tag, requeue=False)

    try:
        content = json.loads(body)

        # discord_channel = content["channel"]
        # discord_channel = method.routing_key.split('.')[0]

        private_chanid = env("BOT_PRIVATE_CHANID")

        if (private_chanid == None):
            raise Exception('chanid not found')

        discord_channel = bot.get_channel(int(1025065637497798726))


        payload = create_discord_payload(content)

        if (payload.get("content") != None):
            await discord_channel.send(payload.get("content"))

        else:
            await discord_channel.send(embed=payload.get("embeds")[0])

        mylogger(f"Consume bot {method.routing_key}, {discord_channel}", LOGGER_INFO)
        ch.basic_ack(delivery_tag = method.delivery_tag)


    except Exception as e:
        mylogger(f"Reject bot {method.routing_key}, type {type(e)}, reason {e}", LOGGER_ERROR)

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
