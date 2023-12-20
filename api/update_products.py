


from _dbConnector import *
from _api import *
from dateutil import parser
import pytz

lausanne_products = []
# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def product_notification(fetched):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM products WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://42lwatch.ch/basics/products',
        'footer_text': datetime.datetime.now().astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }
    if fetched["image"] != None:
        embed["thumbnail"] = f'https://cdn.intra.42.fr/{fetched["image"].replace("/uploads/", "")}'

    if (len(refer) == 0):
        embed['title'] = f'Created product {fetched["id"]}, {fetched["name"]}'
        refer = None
    else:
        embed['title'] = f'Updated product {fetched["id"]}, {fetched["name"]}'
        refer = refer[0]


    check_fields = ["name", "slug", "description", "price", "image", "is_uniq", "one_time_purchase", "has_lausanne"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or refer[check] != fetched[check]):
            diffs[check] = f'ref: `{refer[check] if (refer != None and refer[check] != None and len(refer[check]) > 0) else "None"}`, new: `{fetched[check]}`'

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified product {fetched['id']} {fetched['name']}", LOGGER_INFO)
        send_to_rabbit('shop.server.message.queue', embed)

        

def product_callback(product):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    global lausanne_products

    mylogger(f"Import product {product['id']} {product['name']}", LOGGER_INFO)

    good = {
        "id": product["id"],
        "name": product["name"],
        "slug": product["slug"],
        "description": product["description"],
        "price": product["price"],
        "image": product["image"]["url"],
        "is_uniq": product["is_uniq"] if product["is_uniq"] != None else False,
        "one_time_purchase": product["one_time_purchase"] if product["one_time_purchase"] != None else False,
        "has_lausanne": product["id"] in lausanne_products
    }

    if (good["has_lausanne"]):
        product_notification(good)

    executeQueryAction("""INSERT INTO products (
        "id", "name", "slug", "description", 
        "price", "image", "is_uniq", "one_time_purchase", "has_lausanne"
    ) VALUES (
        %(id)s, %(name)s, %(slug)s, %(description)s, 
        %(price)s, %(image)s, %(is_uniq)s, %(one_time_purchase)s, %(has_lausanne)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name,
        "slug" = EXCLUDED.slug,
        "description" = EXCLUDED.description,
        "price" = EXCLUDED.price,
        "image" = EXCLUDED.image,
        "is_uniq" = EXCLUDED.is_uniq,
        "one_time_purchase" = EXCLUDED.one_time_purchase,
        "has_lausanne" = EXCLUDED.has_lausanne
    """, good)

    return True

def import_products():
    from _utils_mylogger import mylogger, LOGGER_ALERT
    global lausanne_products

    lausanne_products = list(map(lambda x: x["id"], callapi("/v2/campus/47/products?sort=id", True)))

    mylogger("Start products worker", LOGGER_ALERT)
    callapi("/v2/products?sort=id", True, product_callback, False)
    mylogger("End products worker", LOGGER_ALERT)



if __name__ == "__main__":
    import_products()