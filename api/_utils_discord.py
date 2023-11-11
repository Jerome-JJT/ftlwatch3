


def create_discord_payload(content = {}):
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

        payload["embeds"].append(embed)

    else:
        payload["content"] = content["content"]

    return payload