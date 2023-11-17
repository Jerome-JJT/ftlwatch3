

(watchmedo auto-restart --patterns="*.py" --recursive --directory "." -- python -u runner.py) &

watchmedo auto-restart --patterns="*.py" --recursive --directory "." -- python -u _rabbit.py --serv true

# sleep infinity