
from _dbConnector import *

import requests
import http.cookiejar
from bs4 import BeautifulSoup
import environ
import base64
from dateutil import parser
import pytz

env = environ.Env()
environ.Env.read_env()

cookie_jar = http.cookiejar.LWPCookieJar("/jar/.cookie_jar")
try:
    cookie_jar.load(ignore_discard=True)
except FileNotFoundError:
    print("No existing cookie file found. Creating a new one.")

session = requests.Session()
session.cookies = cookie_jar

url = 'https://profile.intra.42.fr/'
response = session.get(url, timeout=60, headers={'Connection': 'close'})

if (response.url != url):

    print("NEED LOGIN")

    soup = BeautifulSoup(response.content, 'html.parser')
    login_form = soup.find(id="kc-form-login")
    next = login_form.attrs["action"]

    print("Next: ", next)

    if (next != None):
        post_data = {
            'username': base64.b64decode(env("INTRA_USER")).decode('utf-8'), 
            'password': base64.b64decode(env("INTRA_PASS")).decode('utf-8'),
            'credentialId': ''
        }
        response_post = session.post(next, data=post_data, timeout=60, headers={'Connection': 'close'})

        cookie_jar.save(ignore_discard=True)

    else:
        print("No next found")

else:
    print("Already logged")


def get_authenticity_token(url: str):
    response = session.get(url, timeout=60, headers={'Connection': 'close'})

    if (response.url == url):
        soup = BeautifulSoup(response.content, 'html.parser')
        meta_tag = soup.find("meta", attrs={"name": "csrf-token"})
        return meta_tag.attrs["content"]

    return None


def get_notifs():
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    url = f'https://profile.intra.42.fr/notifications'
    response = session.get(url, timeout=60, headers={'Connection': 'close'})

    if (response.url == url):

        soup = BeautifulSoup(response.content, 'html.parser')
        notifs = soup.find_all("a", "notification-link")

        for notif in notifs:

            notif_link = notif.attrs["href"]
            notif_content = notif.find("div", "notification-item--body").text.strip()
            notif_date = notif.find("div", "notification-item--footer").text

            id = parser.parse(notif_date).timestamp()

            notif = executeQuerySelect("SELECT id FROM intra_notifs WHERE id = %(id)s", {
                "id": id
            })

            if (len(notif) == 0):
                embed = {
                    'message_type': 'embed',
                    'url': f'https://profile.intra.42.fr/notifications',
                    'title': notif_content,
                    'description': notif_link,
                    'footer_text': parser.parse(notif_date).astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
                }

                mylogger(f"Nofified intranotif {id} {notif_content}", LOGGER_INFO)
                send_to_rabbit('intranotif.server.message.queue', embed)

                executeQueryAction("""INSERT INTO intra_notifs (
                    "id", "content", "link", "updated_at"
                    ) VALUES (
                    %(id)s, %(content)s, %(link)s, %(updated_at)s
                )
                ON CONFLICT DO NOTHING
                """, {
                    "id": id, 
                    "content": notif_content,
                    "link": notif_link,
                    "updated_at": parser.parse(notif_date)
                })


    else:
        print("ERROR, REDIRECTED TO", response.url)


def starter():
    get_notifs()

if __name__ == "__main__":
    starter()