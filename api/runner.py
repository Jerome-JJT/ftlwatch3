import time
import schedule
import threading

from update_achievements import import_achievements
from update_campus import import_campus
from update_coalitions import import_coalitions
from update_cursus import import_cursus
from update_groups import import_groups
from update_locations import import_locations
from update_products import import_products
from update_projects import import_projects
from update_teams import import_teams
from update_titles import import_titles
from update_users import import_users

scheduler_update = schedule.Scheduler()
scheduler_live = schedule.Scheduler()


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


scheduler_update.every().day.at("02:00", "Europe/Zurich").do(update_achievements)
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(update_coalitions)
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(update_cursus)
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(update_groups)
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(update_products)
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(update_projects)
scheduler_update.every().day.at("02:00", "Europe/Zurich").do(update_titles)

scheduler_update.every().day.at("10:30", "Europe/Zurich").do(update_users)

scheduler_live.every().minutes.do(update_locations, update_all=False)
scheduler_live.every().minutes.do(update_teams, update_all=False)

thread_update = threading.Thread(target=scheduler_watcher, args=(scheduler_update,))
thread_live = threading.Thread(target=scheduler_watcher, args=(scheduler_live,))

thread_update.start()
thread_live.start()

thread_update.join()
thread_live.join()

