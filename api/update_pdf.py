


from _dbConnector import *
from _api import *
import click
import io
import time
import urllib
from urllib.request import Request, urlopen
from PyPDF2 import PdfReader
import hashlib


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
local_hashes = []
local_subjects = []


def subject_callback(id, url, head, content):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global local_hashes
    global local_subjects

    head_hash = hashlib.sha256(head.encode()).hexdigest()
    content_hash = hashlib.sha256(content.encode()).hexdigest()


    if (head_hash not in local_hashes.keys()):
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



def import_subjects(update_all=False, start_at=1):
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


    limit_checker = 200
    current_limit = limit_checker

    mylogger("Start pdfs worker", LOGGER_ALERT)
    while True:

        url = f"https://cdn.intra.42.fr/pdf/pdf/{start_at}/en.subject.pdf"
        

        mylogger(f"Try import subject {start_at} {url} / current_limit {current_limit}", LOGGER_INFO)
        try:
            res = urlopen(url)

            if (res.status == 200):

                mylogger(f"Find import subject {start_at} {url} / current_limit {current_limit}", LOGGER_INFO)
                
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
            if ("404" not in str(e)):
                mylogger(f"Pdf http error {url} {type(e)} {e}", LOGGER_ERROR)

        except Exception as e:
            mylogger(f"Subject bug error {url} {type(e)} {e}", LOGGER_ERROR)


        if (current_limit <= 0):
            break

        start_at += 1
        time.sleep(0.5)

    mylogger("End pdfs full worker", LOGGER_ALERT)



@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def starter(update_all=False, start_at=1):
    import_subjects(update_all, start_at)


if __name__ == "__main__":
    starter()