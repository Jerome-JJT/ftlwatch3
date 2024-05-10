
import datetime

from _dbConnector import *
from _utils_map import *
from dateutil import parser

import pandas as pd
import plotly.express as px



    
def generate_peaks(output_name='', min_date='2000-00-00', max_date='2099-99-99'):

    peaks = executeQuerySelect("""
        SELECT id, total, total_same, is_piscine, date, peak_at FROM vp_peaks

        WHERE date between %(min_date)s AND %(max_date)s
    """, {
        "min_date": min_date,
        "max_date": max_date,
    })
    peaks = {one["id"]: one for one in peaks} 


    min_found_date = max_date
    max_found_date = min_date
    for i in peaks.values():
        if (i["date"] < min_found_date):
            min_found_date = i["date"]

        if (i["date"] > max_found_date):
            max_found_date = i["date"]

    min_found_date = parser.parse(min_found_date)
    max_found_date = parser.parse(max_found_date) + datetime.timedelta(days=1)

    cols = ["date", "count", "time", "type"]
    data = []


    while (min_found_date < max_found_date):

        thisday = min_found_date.strftime("%Y-%m-%d")

        if (f"0_{thisday}" in peaks.keys()):
            data.append([thisday, peaks[f"0_{thisday}"]['total'], '', 'cursus_day'])
            data.append([thisday, peaks[f"0_{thisday}"]['total_same'], peaks[f"0_{thisday}"]['peak_at'], 'cursus_time'])
        else:
            data.append([thisday, -1, '', 'cursus_day'])
            data.append([thisday, -1, '', 'cursus_time'])

        if (f"1_{thisday}" in peaks.keys()):
            data.append([thisday, peaks[f"1_{thisday}"]['total'], '', 'piscine_day'])
            data.append([thisday, peaks[f"1_{thisday}"]['total_same'], peaks[f"1_{thisday}"]['peak_at'], 'piscine_time'])
        else:
            data.append([thisday, -1, '', 'piscine_day'])
            data.append([thisday, -1, '', 'piscine_time'])

        min_found_date += datetime.timedelta(days=1)


    df = pd.DataFrame(data, columns=cols)
    df = df.sort_values(by="date")

    fig = px.line(df, x="date", y="count", color="type", hover_data=["count", "time"], markers=True, title=f"Connections")
    fig.write_html(f'/secure_static/{output_name}.html')


def gen_peaks():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start peaks graph generator", LOGGER_ALERT)
    generate_peaks(output_name='peaks_days')
    mylogger("End peaks graph generator", LOGGER_ALERT)


if __name__ == "__main__":
    gen_peaks()
