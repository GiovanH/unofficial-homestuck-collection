import requests
import pickle
import bs4
import json
import re
import subprocess

# resp = requests.get("https://ko-fi.com/giovanh39142", headers={
#     'User-Agent': 'giovanh from the internet on line',
#     'Accept-Charset': 'utf-8'
# })

try:
    # raise FileNotFoundError()
    with open("temp.pickle", 'rb') as fp:
        resp_json = pickle.load(fp)
except FileNotFoundError:
    resp = requests.post('http://garnet:8191/v1', json={
        "cmd": "request.get",
        "url": "https://ko-fi.com/giovanh39142",
        "maxTimeout": 60000
    })
    resp.raise_for_status()

    resp_json = resp.json()
    with open("temp.pickle", 'wb') as fp:
        pickle.dump(resp_json, fp)


soup = bs4.BeautifulSoup(resp_json.get('solution').get('response'), features="html.parser")

kofi_goal_progress_a = soup.select('.goal-label')[0].previous
kofi_goal_progress_b = soup.select('.goal-label')[0].text

data = {
    "percent": int(kofi_goal_progress_a.strip().replace('%', '')),
    "total": float(re.match(r'of \$(.+?) goal', kofi_goal_progress_b).group(1))
}

print(data)

with open('goals.json', 'w') as fp:
    json.dump(data, fp)

subprocess.run(['rsync', '-v', 'goals.json', 'blog.giovanh.com:~/www-homestuck/'])