


from _utils import *
from _dbConnector import *
from _api import *
import requests
import json
import pika
import environ

env = environ.Env()
environ.Env.read_env()

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def bot_consumer(ch, method, properties, body):

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


        payload = {
            "username": "BlazingDuck",
            "avatar_url": "https://dev.42lwatch.ch/static/logo_gray.png", 
            "embeds": [],
        }

        if (content.get('message_type') == 'embed'):
            embed = {
                "title": content["title"],
                "color": 32896, 
            }
            if (content.get("description") != None):
                embed["description"] = content.get("description")
            if (content.get("url") != None):
                embed["url"] = content.get("url")
            if (content.get("thumbnail") != None):
                embed["thumbnail"] = {
                    "url": content.get("thumbnail")
                }

            if (content.get("image") != None):
                embed["image"] = {
                    "url": content.get("image")
                }

            if (content.get("fields") != None):
                embed["fields"] = []
                for name, value in content.get("fields").items():
                    embed["fields"].append({"name": name, "value": value})


            if (content.get("footer_text") != None or content.get("footer_icon") != None):
                embed["footer"] = {}
                if (content.get("footer_text")):
                    embed["footer"]["text"] = content.get("footer_text")
                if (content.get("footer_icon")):
                    embed["footer"]["icon_url"] = content.get("footer_icon")

            print(embed)
            payload["embeds"].append(embed)

        else:
            payload["content"] = content["content"]


        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(webhook_url, data=json.dumps(payload), headers=headers)

        if response.status_code != 204:
            raise Exception(f'Channel {discord_channel}, status {response.status_code}, Response: {response.text}')

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
