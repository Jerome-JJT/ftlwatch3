

# (watchmedo auto-restart --patterns="*.py" --recursive --directory "." -- python -u runner.py) &
# watchmedo auto-restart --patterns="*.py" --recursive --directory "." -- python -u _rabbit.py -server 1


python runner.py &
python _discord_bot.py &
python _rabbit.py -server 1

# sleep infinity