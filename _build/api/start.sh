

(watchmedo auto-restart --patterns="*.py" --recursive --directory "." -- python -u _scheduler.py 2>&1 >> /scheduler.log) &

watchmedo auto-restart --patterns="*.py" --recursive --directory "." -- python -u _rabbit.py --server true 2>&1 >> /rabbit_server.log

# sleep infinity