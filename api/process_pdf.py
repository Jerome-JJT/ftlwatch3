


from _dbConnector import *
from _api import *
# from dateutil.parser import parse
import datetime
from _hosts import host_locations


matcher = {
    "Shell 00": "c-piscine-shell-00",
    "Shell 01": "c-piscine-shell-01",

    "C 00": "c-piscine-c-00",
    "C 01": "c-piscine-c-01",
    "C 02": "c-piscine-c-02",
    "C 03": "c-piscine-c-03",
    "C 04": "c-piscine-c-04",
    "C 05": "c-piscine-c-05",
    "C 06": "c-piscine-c-06",
    "C 07": "c-piscine-c-07",
    "C 08": "c-piscine-c-08",
    "C 09": "c-piscine-c-09",
    "C 10": "c-piscine-c-10",
    "C 11": "c-piscine-c-11",
    "C 12": "c-piscine-c-12",
    "C 13": "c-piscine-c-13",

    "Rush 00": "c-piscine-rush-00",
    "Rush 01": "c-piscine-rush-01",
    "Rush 02": "c-piscine-rush-02",
    "BSQ": "c-piscine-bsq",

    "Your very first own library": "42cursus-libft",
    "Get Next Line": "42cursus-get_next_line",
    "printf": "42cursus-ft_printf",
    "Born2beRoot": "born2beroot",

    "Push_swap": "42cursus-push_swap",
    "Minitalk": "minitalk",
    "Pipex": "pipex",
    "FDF": "42cursus-fdf",
    "fract’ol": "42cursus-fract-ol",
    "So Long": "so_long",

    "Philosophers": "42cursus-philosophers",
    "Minishell": "42cursus-minishell",

    "miniRT": "minirt",
    "cub3D": "cub3d",
    "Net_Practice": "netpractice",
    "C++ - Module 00": "cpp-module-00",
    "C++ - Module 01": "cpp-module-01",
    "C++ Pool - Module 01": "cpp-module-01",
    "C++ - Module 02": "cpp-module-02",
    "C++ - Module 03": "cpp-module-03",
    "C++ - Module 04": "cpp-module-04",
    "C++ - Module 05": "cpp-module-05",
    "C++ - Module 06": "cpp-module-06",
    "C++ - Module 07": "cpp-module-07",
    "C++ - Module 08": "cpp-module-08",
    "C++ - Module 09": "cpp-module-09",
    "Inception\nS": "inception",
    "Webserv": "webserv",
    "IRC": "ft_irc",
    "ft_containers": "ft_containers",
    "ft_transcendence": "ft_transcendence",
}

def process_pdf(update_all = True):
    global local_projects

    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR, LOGGER_ALERT

    mylogger("Start pdf processor", LOGGER_ALERT)

    subject_headers = executeQuerySelect("SELECT id, title FROM subject_hashmaps")


    for subject_header in subject_headers:

        # mylogger(f"Look {subject_header['id']}", LOGGER_DEBUG)

        for search in matcher.keys():

            if ("Inception" in subject_header['title']):
                mylogger(f"Inc ___{subject_header['title']}___ {search}", LOGGER_DEBUG)


            if search in subject_header['title'] and local_projects.get(matcher[search]) != None:

                mylogger(f"Match {subject_header['id']} {search} {local_projects.get(matcher[search])}", LOGGER_INFO)

                executeQueryAction("""UPDATE subject_hashmaps 
                                SET project_id = %(project_id)s 
                                WHERE id = %(id)s""", {
                    "project_id": local_projects.get(matcher[search]),
                    "id": subject_header['id'],
                })

                break


    mylogger("End pdf processor", LOGGER_ALERT)
    


if __name__ == "__main__":
    global local_projects

    local_projects = executeQuerySelect("SELECT id, slug FROM projects")
    local_projects = {one['slug']: one['id'] for one in local_projects}

    process_pdf(True)