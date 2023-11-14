



def notif():
    try:
        lod = json.loads(mess)

        titl = "Default title"
        ur = "localhost"
        desc = "Default desc"
        imag = "https://cdn.intra.42.fr/users/3b3.jpg"

        if ("title" in lod.keys()):
            titl = lod["title"]

        if ("url" in lod.keys()):
            ur = lod["url"]

        if ("desc" in lod.keys()):
            desc = lod["desc"]


        embed=discord.Embed(title=titl, url=ur, description=desc, color=discord.Color.green(), timestamp=datetime.datetime.utcnow())


        if ("image" in lod.keys()):
            embed.set_thumbnail(url=lod["image"])

        if ("author" not in lod.keys()):
            try:
                embed.set_author(name=bot.user.name, icon_url=bot.user.avatar.url)
            except:
                embed.set_author(name="Cheese")


        if ("msg" in lod.keys()):
            msgtitl = "Default"

            if ("msgtitle" in lod.keys()):
                msgtitl = lod["msgtitle"]
            embed.add_field(name=msgtitl, value=lod["msg"][:1000], inline=False)

        # if ("footer" in lod.keys()):
        #     embed.set_footer(text=lod["footer"])


        await ctx.send(embed=embed)

    except Exception as e:
        #print("Error, here ", e)
        await ctx.send(f"{mess[:1900]}")