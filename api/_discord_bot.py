

import os
import asyncio
import datetime
import time
import json

from _api import *

import discord
from discord.errors import PrivilegedIntentsRequired
from discord.ext import commands
from discord.commands import slash_command, Option, OptionChoice


intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(intents=intents)

valid_crudcmd = [
    OptionChoice(name="Add", value="add"),
    OptionChoice(name="Rm", value="rm"),
    OptionChoice(name="List", value="list"),
    OptionChoice(name="Help", value="help")
]

valid_cluster = [
    OptionChoice(name="Gotham", value="c1"),
    OptionChoice(name="Asgard", value="c2"),
    OptionChoice(name="Salle sur demande", value="c3")
]

valid_cursus = [
    OptionChoice(name="Cursus 42", value="all"),
    OptionChoice(name="Not cursus 42", value="not")
]


# async def manage_send_bot(ctx, bot, mess):
#     try:
#         lod = json.loads(mess)

#         titl = "Default title"
#         ur = "localhost"
#         desc = "Default desc"
#         imag = "https://cdn.intra.42.fr/users/3b3.jpg"

#         if ("title" in lod.keys()):
#             titl = lod["title"]

#         if ("url" in lod.keys()):
#             ur = lod["url"]

#         if ("desc" in lod.keys()):
#             desc = lod["desc"]


#         embed=discord.Embed(title=titl, url=ur, description=desc, color=discord.Color.green(), timestamp=datetime.datetime.utcnow())


#         if ("image" in lod.keys()):
#             embed.set_thumbnail(url=lod["image"])

#         if ("author" not in lod.keys()):
#             try:
#                 embed.set_author(name=bot.user.name, icon_url=bot.user.avatar.url)
#             except:
#                 embed.set_author(name="Cheese")


#         if ("msg" in lod.keys()):
#             msgtitl = "Default"

#             if ("msgtitle" in lod.keys()):
#                 msgtitl = lod["msgtitle"]
#             embed.add_field(name=msgtitl, value=lod["msg"][:1000], inline=False)

#         # if ("footer" in lod.keys()):
#         #     embed.set_footer(text=lod["footer"])


#         await ctx.send(embed=embed)

#     except Exception as e:
#         #print("Error, here ", e)
#         await ctx.send(f"{mess[:1900]}")


# if __name__ == "__main__":


    # @bot.slash_command(name="api", description="Api endpoint")
    # async def api(ctx,
    #     endpoint: Option(str, 'Endpoint', required=False),
    #     page_num: Option(int, 'Page num', required=False),
    #     page_size: Option(int, 'Page size', required=False),
    #     req_type: Option(str, 'Request type', required=False, choices=(["json", "big", "user"])),
    #     sub_index: Option(str, 'Sub index', required=False)):


    #     print(endpoint, page_num, page_size)
    #     print(str(ctx.author))

    #     if (page_num == None):
    #         page_num = 1
    #     page_num = min(max(page_num, 1), 100)

    #     if (page_size == None):
    #         page_size = 30
    #     page_size = min(max(page_size, 1), 100)


    #     await ctx.defer()

    #     if (str(ctx.author) in admins):
    #         try:
    #             if (endpoint != None):

    #                 url = ""
    #                 if ("?" in endpoint):
    #                     url = f"{endpoint}&page[size={page_size}]&page[number={page_num}]"
    #                 else:
    #                     url = f"{endpoint}?page[size={page_size}]&page[number={page_num}]"


    #                 print(url)
    #                 await ctx.respond(url)
    #                 res = pure(url)

    #                 if (type([]) == type(res) and len(res) == 1):
    #                     res = res[0]

    #                 if (sub_index != None):
    #                     if (type(res) == type({}) and "," in sub_index):
    #                         mykeys = sub_index.split(",")
    #                         mykeys = list(map(lambda x: x.strip(), mykeys))
    #                         res = {mykey: (res[mykey] if mykey in list(res.keys()) else "none") for mykey in mykeys}

    #                     elif (type(res) == type({}) and sub_index in list(res.keys())):
    #                         res = res[sub_index]

    #                     elif (type(res) == type([]) and "," in sub_index):
    #                         mykeys = sub_index.split(",")
    #                         mykeys = list(map(lambda x: x.strip(), mykeys))
    #                         res = list(map(lambda x: {mykey: (x[mykey] if mykey in list(x.keys()) else "none") for mykey in mykeys}, res))

    #                     elif (type(res) == type([]) and sub_index in list(res[0].keys())):
    #                         res = list(map(lambda x: x[sub_index], res))
    #                     else:
    #                         await ctx.respond(f"sub_index not found")
    #                         return 0
                        
    #                 if (type(res) == type({}) and req_type == "user"):
    #                     res = userify(res)

    #                 elif (type(res) == type([]) and req_type == "user"):
    #                     res = list(map(lambda x: userify(x), res))

    #                 # print(json.dumps(res, indent=2))
    #                 toprint = json.dumps(res, indent=2, ensure_ascii=False)


    #                 if (len(toprint) < 10000 or req_type == "big" or req_type == "user"):

    #                     lines = toprint.split("\n")
    #                     buffer = ""

    #                     for line in lines:
    #                         if (len(buffer) > 1900):
    #                             while (len(buffer) > 1):
    #                                 minibuf = buffer[:1900]
    #                                 buffer = f"\n{buffer[1900:]}"
    #                                 await ctx.send(f"```json{minibuf}```")
    #                                 time.sleep(0.15)

    #                         elif (len(buffer) + len(line) >= 1900):
    #                             await ctx.send(f"```json{buffer}```")
    #                             time.sleep(0.15)
    #                             buffer = ""

    #                         buffer += f"\n{line}"

    #                     await ctx.send(f"```json{buffer}```")
    #                     while (len(buffer) > 1):
    #                         minibuf = buffer[:1900]
    #                         buffer = f"\n{buffer[1900:]}"
    #                         await ctx.send(f"```json{minibuf}```")
    #                         time.sleep(0.15)
    #                     await ctx.respond(f"{len(res)} results for endpoint {endpoint}")
                    
    #                 else:
    #                     await ctx.respond(f"Result is {len(toprint)} chars long, default limit is 10000 chars\npass 'big' to req_type to bypass the limit")
                    

    #             else:
    #                 await ctx.respond(f"Usage /api endpoint:/v2/")

    #         except Exception as e:
    #             await ctx.respond(f"Try error {e} for {endpoint}")

    #     else:
    #         await ctx.respond(f"Unauthorized")


    # @bot.event
    # async def on_command_error(ctx, error):

    #     if isinstance(error, commands.CommandNotFound):
    #         await ctx.respond(f"Command not found")

    #     channel = bot.get_channel(1007247986151133244)
    #     await channel.send(f"{error} by {ctx.author}")



    # async def auto_sub(chan_id, sub_id, rb = 0, type="c"):
    #     global subscriptions

    #     await bot.wait_until_ready()
    #     if ("42" not in bot.user.name and int(chan_id) != 403285251637379083):
    #        return 0

    #     channel = 0
    #     if (type == "c" and int(chan_id) != 0):
    #         channel = bot.get_channel(int(chan_id))
    #     elif (type == "u" and int(chan_id) != 0):
    #         channel = await bot.fetch_user(int(chan_id))
    #     else:
    #         return 0

    #     #print(chan_id, sub_id)

    #     nline = 0
    #     with open(f"res_watcher/{subscriptions[sub_id]['file']}", "r") as f:
    #         nline = len(f.readlines()) - rb
    #         if (nline < 0):
    #             nline = 0

    #     #if (type == "c" or chan_id == 378496894441095168):
    #     if (chan_id == 378496894441095168):
    #         await channel.send(f"{sub_id} linked")

    #     while ((type == "c" and chan_id in autos[sub_id]['channels']) or (type == "u" and chan_id in autos[sub_id]['autousers'])):
    #         toread = []
    #         #print(f"res_watcher/{subscriptions[sub_id]['file']})
    #         with open(f"res_watcher/{subscriptions[sub_id]['file']}", "r") as f:
    #             lines = f.readlines()

    #             #if (chan_id == 1013789722285457428):
    #             #print(chan_id, sub_id, nline, len(lines))

    #             if (nline > len(lines)):
    #                 nline = 0

    #             toread = lines[nline:]
    #             nline = len(lines)

    #         for mess in toread:
    #             await manage_send(channel, mess)

    #         await asyncio.sleep(15)


    # async def logs_sub():
    #     await bot.wait_until_ready()

    #     channel = bot.get_channel(int(1071417393185816716))

    #     nline = 0
    #     with open(f"res_html/_newsletter_logs.news", "r") as f:
    #         nline = len(f.readlines())
    #         if (nline < 0):
    #             nline = 0

    #     #if (type == "c" or chan_id == 378496894441095168):
    #     await channel.send(f"logs linked")

    #     while (True):
    #         toread = []
    #         #print(f"res_watcher/{subscriptions[sub_id]['file']})
    #         with open(f"res_html/_newsletter_logs.news", "r") as f:
    #             lines = f.readlines()

    #             if (nline > len(lines)):
    #                 nline = 0

    #             toread = lines[nline:]
    #             nline = len(lines)

    #         for mess in toread:
    #             mess = f"Logs: {mess[:512]}"
    #             await manage_send(channel, mess)

    #         await asyncio.sleep(60)




import environ
# from consumer_bot import bot_consumer
import pika

# env = environ.Env()
# environ.Env.read_env()

# credentials = pika.PlainCredentials(env('RABBIT_USER'), env('RABBIT_PASS'))
# parameters = pika.ConnectionParameters('rabbit', 5672, '/', credentials)

# async def rabbit_worker():

#     await bot.wait_until_ready()


#     titl = "Default title"
#     desc = "Default desc"
#     imag = "https://dev.42lwatch.ch/static/animals.png"



#     embed=discord.Embed(title=titl, description=desc, color=discord.Color.green(), timestamp=datetime.datetime.utcnow())


#     embed.set_thumbnail(url=imag)

#     channel = await bot.fetch_user(int(378496894441095168))

#     await channel.send(embed=embed)








    # async def exam():
    #     pass

    # connection = pika.BlockingConnection(parameters)
    # channel = connection.channel()
    # channel.basic_qos(prefetch_count=1)
    # # channel.basic_consume(
    # #     queue='server_message_queue', 
    # #     auto_ack=False, 
    # #     on_message_callback=lambda ch, method, properties, body: bot_consumer(bot, ch, method, properties, body)
    # # )
    # channel.start_consuming()

    # channel = await bot.fetch_user(int(378496894441095168))
    # channel = bot.get_channel(int(1071417393185816716))


    # channel.basic_consume(on_message_callback=lambda ch, method, properties, body: on_message(window, ch, method, body),
    #                 queue=queue_name,
    #                 no_ack=True)


    # await channel.send(f"logs linked")


    #     for mess in toread:
    #         mess = f"Logs: {mess[:512]}"
    #         await manage_send(channel, mess)

    #     await asyncio.sleep(60)

# import aiormq

import asyncio
from consumer_bot import bot_consumer


loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

def tmpt(ch, method, properties, body):
    
    # res = asyncio.run(bot_consumer(bot, ch, method, properties, body))
    # res = loop.run_until_complete(bot_consumer(bot, ch, method, properties, body))
    res = bot.loop.create_task(bot_consumer(bot, ch, method, properties, body))
    return res


async def consume_messages():

    credentials = pika.PlainCredentials(env('RABBIT_USER'), env('RABBIT_PASS'))
    parameters = pika.ConnectionParameters('rabbit', 5672, '/', credentials)

    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='private_message_queue', auto_ack=False, on_message_callback=tmpt)

    channel.start_consuming()

@bot.event
async def on_ready():
    bot.loop.create_task(consume_messages())

if __name__ == "__main__":
    # bot.run("") #PROD
    bot.run("") #DEV
