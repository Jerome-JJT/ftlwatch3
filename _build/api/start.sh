

(watchmedo auto-restart --patterns="*.py" --recursive --directory "." -- python -u runner.py 2>&1) &

watchmedo auto-restart --patterns="*.py" --recursive --directory "." -- python -u _rabbit.py --server true

# sleep infinity