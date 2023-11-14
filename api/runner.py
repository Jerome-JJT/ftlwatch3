import time
import schedule
import threading
from _rabbit import send_to_rabbit

scheduler_update = schedule.Scheduler()
# scheduler_live = schedule.Scheduler()


def scheduler_watcher(scheduled):
    while (1):
        scheduled.run_pending()
        time.sleep(1)

# def greet(name):
#     print('Hello', name)
#     time.sleep(10)
#     print('Good bye Hello', name)

# scheduler_update.every(4).seconds.do(greet, name='Alice')
# scheduler_live.every(15).seconds.do(greet, name='Bob')

# schedule.every(2).seconds.do(greet, name='Alice')
# schedule.every(4).seconds.do(greet, name='Bob')
# schedule.every(10).minutes.do(job)
# schedule.every().hour.do(job)
# schedule.every().day.at("10:30").do(job)
# schedule.every().monday.do(job)
# schedule.every().wednesday.at("13:15").do(job)
# schedule.every().day.at("12:42", "Europe/Amsterdam").do(job)
# schedule.every().minute.at(":17").do(job)


scheduler_update.every().day.at("02:00", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'achievements'}))
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'campus'}))
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'coalitions'}))
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'cursus'}))
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'groups'}))
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'products'}))
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'projects'}))
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'titles'}))

scheduler_update.every().day.at("10:30", "Europe/Zurich").do(lambda: send_to_rabbit('slow.update.queue', {'resource': 'users'}))

scheduler_update.every().minutes.do(lambda: send_to_rabbit('fast.update.queue', {'resource': 'locations'}))
scheduler_update.every().minutes.do(lambda: send_to_rabbit('fast.update.queue', {'resource': 'teams'}))

thread_update = threading.Thread(target=scheduler_watcher, args=(scheduler_update,))
# thread_live = threading.Thread(target=scheduler_watcher, args=(scheduler_live,))

thread_update.start()
# thread_live.start()

thread_update.join()
# thread_live.join()

