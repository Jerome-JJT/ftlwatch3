


from _utils import *
from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def product_callback(product):

    mylogger(f"Import product {product['id']} {product['name']}", LOGGER_INFO)

    executeQueryAction("""INSERT INTO products (
        "id", "name", "slug", "description", 
        "price", "image", "is_uniq", "one_time_purchase"
    ) VALUES (
        %(id)s, %(name)s, %(slug)s, %(description)s, 
        %(price)s, %(image)s, %(is_uniq)s, %(one_time_purchase)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name,
        "slug" = EXCLUDED.slug,
        "description" = EXCLUDED.description,
        "price" = EXCLUDED.price,
        "image" = EXCLUDED.image,
        "is_uniq" = EXCLUDED.is_uniq,
        "one_time_purchase" = EXCLUDED.one_time_purchase
    """, {
        "id": product["id"],
        "name": product["name"],
        "slug": product["slug"],
        "description": product["description"],
        "price": product["price"],
        "image": product["image"]["url"],
        "is_uniq": product["is_uniq"] if product["is_uniq"] != None else False,
        "one_time_purchase": product["one_time_purchase"] if product["one_time_purchase"] != None else False
    })

    return True

def import_products():

    callapi("/v2/products?sort=id", True, product_callback, False)


import_products()