

import datetime
import time
import json
import environ
import pika
import rich
import sys
import asyncio
from operator import itemgetter

from _api import *
from _utils_discord import *
from _rabbit import custom_reject
from _dbConnector import *

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

valid_timelines = [
    OptionChoice(name="Future", value="future"),
    OptionChoice(name="Past", value="past"),
    OptionChoice(name="Both", value="both"),
]



env = environ.Env()
environ.Env.read_env()

credentials = pika.PlainCredentials(env('RABBIT_USER'), env('RABBIT_PASS'))
parameters = pika.ConnectionParameters('rabbit', 5672, '/', credentials)


async def discord_send(ctx, body):
    if (type(body) == type({})):
        content = body
    else:
        content = json.loads(body)
    payload = create_discord_payload(content)

    if (content.get('content') != None):
        await ctx.send(f"{content.get('content')[:1900]}")

    else:
        if (payload.get("embeds") != None):
            payload = payload["embeds"][0]
        
        embed=discord.Embed(
            title=payload["title"], 
            url=payload.get("url") if payload.get("url") != None else None, 
            description=payload.get("description") if payload.get("description") != None else None, 
            color=payload["color"] if payload.get("color") else 32896, 
            timestamp=datetime.datetime.utcnow())
        
        if (payload.get("thumbnail") != None):
            embed.set_thumbnail(url=payload.get("thumbnail")["url"])

        if (payload.get("fields") != None):
            for field in payload.get("fields"):
                embed.add_field(name=field["name"], value=field["value"], inline=False)

        if (payload.get("footer") != None):
            embed.set_footer(text=payload.get("footer")["text"])

        await ctx.send(embed=embed)



async def get_private_messages():
    global bot
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    ctx = await bot.fetch_user(int(378496894441095168))
    # channel = bot.get_channel(int(chan_id))

    for i in range(100):
        method, properties, body = channel.basic_get(queue="private.message.queue")

        if (method == None):
            break

        try:
            if (type(body) == type({})):
                body = json.dumps(body)

            mylogger(f'Got {method.routing_key} for private', LOGGER_DEBUG, rabbit=False)
            await discord_send(ctx, body)

            channel.basic_ack(delivery_tag = method.delivery_tag)

        except Exception as e:

            print(e)
            mylogger(f'Error for {str(e)}', LOGGER_ERROR, rabbit=True)
            custom_reject("message.dlq", channel, method, body, f"Discord reject {str(e)}")

    connection.close()



@bot.slash_command(name="ping", description="Ping private")
async def ping(ctx):

    from _rabbit import send_to_rabbit

    await ctx.defer()

    try:
        send_to_rabbit('errors.server.message.queue', {'content': f'Bot ping request by {str(ctx.author)}'})
    except:
        pass
    
    if (str(ctx.author) in env('BOT_ADMIN_WL').split(",")):
        send_to_rabbit('private.message.queue', {'content': 'Ping'})

    await ctx.respond(f"Done")





@bot.slash_command(name="api", description="Api endpoint")
async def api(ctx,
    endpoint: Option(str, 'Endpoint', required=False),
    page_num: Option(int, 'Page num', required=False),
    page_size: Option(int, 'Page size', required=False),
    req_type: Option(str, 'Request type', required=False, choices=(["json", "big", "user", "keys", "options", "rules"])),
    sub_index: Option(str, 'Sub index', required=False)):

    await ctx.defer()

    try:
        from _rabbit import send_to_rabbit
        send_to_rabbit('errors.server.message.queue', {'content': f'Bot api request by {str(ctx.author)} on {endpoint}'})
    except:
        pass


    if (req_type == "rules"):
        if ("v2" not in url):
            url = f"/v2/project_sessions/{url}"

        if (sub_index == None or len(sub_index) == 0):
            sub_index = "project_sessions_rules"

    print(endpoint, page_num, page_size)
    print(str(ctx.author))

    if (page_num == None):
        page_num = 1
    page_num = min(max(page_num, 1), 100)

    if (page_size == None):
        page_size = 30
    page_size = min(max(page_size, 1), 100)

    if (req_type == "options"):
        page_size = 100



    # if (str(ctx.author) in env('BOT_API_WL').split(",")):
    try:
        if (endpoint != None):

            url = ""
            if ("?" in endpoint):
                url = f"{endpoint}&page[size]={page_size}&page[number]={page_num}"
            else:
                url = f"{endpoint}?page[size]={page_size}&page[number]={page_num}"


            print(url)
            await ctx.respond(url)
            if (req_type == "options"):
                res = raw(url, True)
                res = dict(res.headers)
            else:
                res = callapi(url, nultiple=0, mode="fast")

            if (type([]) == type(res) and len(res) == 1):
                res = res[0]

            if (sub_index != None):
                if (type(res) == type({}) and "," in sub_index):
                    mykeys = sub_index.split(",")
                    mykeys = list(map(lambda x: x.strip(), mykeys))
                    res = {mykey: (res[mykey] if mykey in list(res.keys()) else "none") for mykey in mykeys}

                elif (type(res) == type({}) and sub_index in list(res.keys())):
                    res = res[sub_index]

                elif (type(res) == type([]) and "," in sub_index):
                    mykeys = sub_index.split(",")
                    mykeys = list(map(lambda x: x.strip(), mykeys))
                    res = list(map(lambda x: {mykey: (x[mykey] if mykey in list(x.keys()) else "none") for mykey in mykeys}, res))

                elif (type(res) == type([]) and sub_index in list(res[0].keys())):
                    res = list(map(lambda x: x[sub_index], res))
                else:
                    await ctx.respond(f"sub_index not found")
                    return 0
                
            if (type(res) == type({}) and req_type == "user"):
                res = userify(res)

            elif (type(res) == type([]) and req_type == "user"):
                res = list(map(lambda x: userify(x), res))

            # print(json.dumps(res, indent=2))
            if (req_type == "keys"):
                toprint = json.dumps(list(res.keys()), indent=2, ensure_ascii=False)
            else:
                toprint = json.dumps(res, indent=2, ensure_ascii=False)


            if (len(toprint) < 10000 or req_type == "big" or req_type == "user"):

                lines = toprint.split("\n")
                buffer = ""

                for line in lines:
                    if (len(buffer) > 1900):
                        while (len(buffer) > 1):
                            minibuf = buffer[:1900]
                            buffer = f"\n{buffer[1900:]}"
                            await ctx.send(f"```json{minibuf}```")
                            time.sleep(0.15)

                    elif (len(buffer) + len(line) >= 1900):
                        await ctx.send(f"```json{buffer}```")
                        time.sleep(0.15)
                        buffer = ""

                    buffer += f"\n{line}"

                #await ctx.send(f"```json{buffer}```")
                while (len(buffer) > 1):
                    minibuf = buffer[:1900]
                    buffer = f"\n{buffer[1900:]}"
                    await ctx.send(f"```json{minibuf}```")
                    time.sleep(0.15)
                await ctx.respond(f"{len(res)} results for endpoint {endpoint}")
            
            else:
                await ctx.respond(f"Result is {len(toprint)} chars long, default limit is 10000 chars\npass 'big' to req_type to bypass the limit")
            

        else:
            await ctx.respond(f"Usage /api endpoint:/v2/")

    except Exception as e:
        await ctx.respond(f"Try error {e} for {endpoint}")

    # else:
    #     await ctx.respond(f"Unauthorized")



    @bot.slash_command(name="comments", description="Nb comments over 180 chars")
    async def comments(ctx, pseudo: Option(str, 'Pseudo', required=True)):

        await ctx.defer()

        try:
            from _rabbit import send_to_rabbit
            send_to_rabbit('errors.server.message.queue', {'content': f'Bot comments request by {str(ctx.author)} for {pseudo}'})
        except:
            pass

        r = callapi(f"/v2/users/{pseudo}/scale_teams/as_corrector?range[created_at]=2021-10-01T00:00:00.000Z,2025-03-01T00:00:00.000Z", nultiple=1)
        list = ["comment", "created_at"]

        #print(r)
        fulltab = []
        for line in r:
            tab = {}
            for k in line.keys():
                if (k == "id" or k in list):
                    tab[k] = line[k]

            fulltab.append(tab)
            #print(tab)

        nbdone = 0
        for aa in fulltab:
            try:
                if (len(aa["comment"]) >= 180):
                    nbdone += 1
            except:
                continue

        await ctx.respond(f"{pseudo} has done {nbdone} comments with over 180 characters chars")



@bot.slash_command(name="logged", description="Logged people")
async def logged(ctx,
    cluster: Option(str, 'Cluster', required=False, choices=(valid_cluster)),
    list: Option(str, 'Cursus', required=False, choices=(valid_cursus))):

    await ctx.defer()

    try:
        from _rabbit import send_to_rabbit
        send_to_rabbit('errors.server.message.queue', {'content': f'Bot loggeds request by {str(ctx.author)}'})
    except:
        pass
    
    lst = callapi("/v2/campus/47/locations?filter[active]=true&sort=begin_at", nultiple=1, mode="fast")

    for log in lst:
        if (cluster and cluster not in log['host']):
            continue

        begin = datetime.datetime.strptime(log["begin_at"], "%Y-%m-%dT%H:%M:%S.%fZ")
        end = datetime.datetime.now()

        diff = end - begin

        payload = {'message_type': 'embed'}
        payload["title"] = f"{log['user']['login']} on {log['host']}"
        payload["url"] = f"https://profile.intra.42.fr/users/{log['user']['login']}"

        try:
            payload["thumbnail"] = log['user']["image"]["link"]
        except:
            pass

        payload["description"] = f"""Since {diff.total_seconds() // 3600} hours and {diff.total_seconds() % 3600 // 60} minutes"""


        await discord_send(ctx, payload)

    await discord_send(ctx, {"content": f"{len(lst)} people logged in query"})
    await ctx.respond(f"Done")


@bot.slash_command(name="blackhole", description="Blackholes")
async def blackhole(ctx, 
                    timeline: Option(str, 'Future or/and Past', required=True, choices=(valid_timelines)), 
                    days: Option(int, 'Days', required=False)):
    await ctx.defer()

    if days is None:
        days = 5
    datenow = datetime.datetime.now()

    try:
        if timeline == "future":
            refer = executeQuerySelect("""SELECT * FROM users WHERE has_cursus21 = True AND blackhole < %(datelimit)s AND blackhole > %(datenow)s""", {
                "datelimit": datenow + datetime.timedelta(days=days),
                "datenow" : datetime.datetime.now()
            })
        elif timeline == "past":
            refer = executeQuerySelect("""SELECT * FROM users WHERE has_cursus21 = True AND blackhole > %(datelimit)s AND blackhole < %(datenow)s""", {
                "datelimit": datenow - datetime.timedelta(days=days),
                "datenow" : datetime.datetime.now()
            })
        else:
            refer = executeQuerySelect("""SELECT * FROM users WHERE has_cursus21 = True AND blackhole > %(datepast)s AND blackhole < %(datelimit)s""", {
                "datelimit": datenow + datetime.timedelta(days=days),
                "datepast" : datenow - datetime.timedelta(days=days)
            })
    except Exception as e:
            await ctx.respond(f"Error {e} when querying the DB")
        

    user_days_list = []
    for user in refer:
        bhdate_timedelta = user['blackhole'] - datenow
        days_until_bh = bhdate_timedelta.days
        user_days_list.append((user, days_until_bh))
    user_days_list.sort()

    past_blackholes = 0
    for user, days_until_bh in user_days_list:
        payload = {'message_type': 'embed'}
        payload["title"] = f"{user['login']}"
        payload["url"] = f"https://profile.intra.42.fr/users/{user['login']}"

        try:
            payload["thumbnail"] = user["avatar_url"]
        except KeyError:
            pass

        if days_until_bh > 0:
            payload["description"] = f"{user['login']} will blackhole in {days_until_bh} days"
        elif days_until_bh == 0:
            payload["description"] = f"{user['login']} is blackholing today"
        else:
            payload["description"] = f"{user['login']} have blackholed {abs(days_until_bh)} days ago"
            past_blackholes += 1
            
        await discord_send(ctx, payload)
        
    if timeline == "future":
        await discord_send(ctx, {"content": f"{len(refer) - past_blackholes} people could blackhole within {days} days"})
    elif timeline == "past":
        await discord_send(ctx, {"content": f"{past_blackholes} people have blackholed in the last {days} days"})
    else:
        await discord_send(ctx, {"content": f"{past_blackholes} people have blackholed in the last {days} days and {len(refer) - past_blackholes} could blackhole within the next {days} days"})
    await ctx.respond(f"Done")



async def consume_messages():
    await bot.wait_until_ready()

    while True:

        print("LOOP")
        await get_private_messages()
        await asyncio.sleep(10)


@bot.event
async def on_ready():
    bot.loop.create_task(consume_messages())

if __name__ == "__main__":

    if (env('BUILD_TYPE') == "PROD"):
        bot.run(env('DISCORD_BOT_PROD'))

    else:
        bot.run(env('DISCORD_BOT_DEV'))
