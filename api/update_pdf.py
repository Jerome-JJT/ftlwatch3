


from _dbConnector import *
from _api import *
import click
import io
import time
import urllib
from urllib.request import Request, urlopen
import ssl
from PyPDF2 import PdfReader
import hashlib
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
local_hashes = []
local_subjects = []



def subject_notification(fetched, flag):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    embed = {
        'message_type': 'embed',
        'url': f'{fetched["url"]}',
        'description': f'https://42lwatch.ch/basics/subjects',
        'footer_text': datetime.datetime.now().astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }

    embed['title'] = f'Created subject {fetched["id"]}'


    embed['fields'] = {
        'head': f'```{fetched["head"]}```'
    }

    mylogger(f"Nofified subject {fetched['id']} {fetched['head']}", LOGGER_INFO)
    send_to_rabbit('subjects_minor.server.message.queue', embed)
    if (flag):
        send_to_rabbit('subjects_major.server.message.queue', embed)


def subject_callback(id, url, head, content):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global local_hashes
    global local_subjects

    head_hash = hashlib.sha256(head.encode()).hexdigest()
    content_hash = hashlib.sha256(content.encode()).hexdigest()

    flag = False

    if (head_hash not in local_hashes.keys()):
        flag = True
        executeQueryAction("""INSERT INTO subject_hashmaps (
            "title", "title_hash"
            ) VALUES (
            %(title)s, %(title_hash)s
        )
        ON CONFLICT (id) DO NOTHING
        """, {
            "title": head,
            "title_hash": head_hash,
        })

        local_hashes = executeQuerySelect("SELECT id, title_hash FROM subject_hashmaps ORDER BY id DESC")
        local_hashes = {one['title_hash']: one for one in local_hashes} 

    
    hashset_id = local_hashes[head_hash]["id"]

    subject_notification({
        "id": id,
        "url": url,
        "head": head
    }, flag)


    executeQueryAction("""INSERT INTO subjects (
        "id", "url", "content_hash", "subject_hashmap_id"
        ) VALUES (
        %(id)s, %(url)s, %(content_hash)s, %(subject_hashmap_id)s
    )
    ON CONFLICT (id) DO NOTHING
    """, {
        "id": id, 
        "url": url,
        "content_hash": content_hash,
        "subject_hashmap_id": hashset_id,
    })


    with open(f"/subjects_static/{id}.txt", "w") as f:
        f.write(f"{content}")



def import_subjects(update_all=False, start_at=1500):
    global local_hashes
    global local_subjects

    from _utils_mylogger import mylogger, LOGGER_INFO, LOGGER_ERROR, LOGGER_ALERT

    local_hashes = executeQuerySelect("SELECT id, title_hash FROM subject_hashmaps ORDER BY id DESC")
    local_hashes = {one['title_hash']: one for one in local_hashes} 

    local_subjects = executeQuerySelect("SELECT id FROM subjects ORDER BY id DESC")
    local_subjects = [one['id'] for one in local_subjects] 

    if (len(local_subjects) == 0):
        update_all = True

    if (update_all == False):
        start_at = max(local_subjects)


    counter_500 = 0
    limit_checker = 200
    current_limit = limit_checker

    mylogger("Start pdfs worker", LOGGER_ALERT)
    while True:

        url = f"https://cdn.intra.42.fr/pdf/pdf/{start_at}/en.subject.pdf"
        

        mylogger(f"Try import subject {start_at} {url} / current_limit {current_limit}, 500 limit {counter_500}", LOGGER_INFO)
        try:
            context = ssl._create_unverified_context()
            res = urlopen(url, context=context)

            if (res.status == 200):

                mylogger(f"Find import subject {start_at} {url} / current_limit {current_limit}, 500 limit {counter_500}", LOGGER_INFO)
                
                current_limit = limit_checker

                remote_file = res.read()
                memory_file = io.BytesIO(remote_file)
                pdf_file = PdfReader(memory_file)

                head = pdf_file.pages[0].extract_text()

                content = ''
                for page in pdf_file.pages:
                    content += page.extract_text()

                subject_callback(start_at, url, head, content)




        except urllib.error.HTTPError as e:
            current_limit -= 1
            if ("500" in str(e) and counter_500 < 3):
                counter_500 += 1
                time.sleep(1)
                continue

            if ("404" not in str(e)):
                mylogger(f"Pdf http error {url} {type(e)} {e}", LOGGER_ERROR)

        except Exception as e:
            mylogger(f"Subject bug error {url} {type(e)} {e}", LOGGER_ERROR)


        if (current_limit <= 0):
            break

        start_at += 1
        counter_500 = 0
        time.sleep(0.5)

    mylogger("End pdfs full worker", LOGGER_ALERT)



@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1500, help="start at")

def starter(update_all=False, start_at=1500):
    import_subjects(update_all, start_at)


if __name__ == "__main__":
    starter()
