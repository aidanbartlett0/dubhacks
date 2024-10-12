import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from call_perplexity import *


from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://aidanb04:dubhackshacker@dubhacks.qxk8w.mongodb.net/"

client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!\n")
except Exception as e:
    print(e)

db = client['dubhacks']
uwwebsites = db['uwwebsites']


def get_site_content(url: str = 'https://www.washington.edu/students/',
                     depth: int = 0,
                     max_depth: int = 2,
                     origin: bool = True):
    '''
    it will start at the student help directory and
    go through every link in there to make a general help doc
    '''
    if depth > max_depth:  # Stop when max depth is reached
        return

    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        print('link:', url, 'depth:', depth)
        text = soup.get_text()
        mongo_input = make_output(text)
        mongo_input['url'] = url
        uwwebsites.insert_one(mongo_input)

        links = get_links(soup, base_url=url, origin=origin)
        for child in links:
            get_site_content(url=child, depth=depth+1, max_depth=max_depth, origin=False)
    else:
        print(f"Status code: {response.status_code} at {url}")


def get_links(soup, base_url, origin):
    links = soup.find_all('a', href=True)
    link_list = []
    for i in links:
        href = i['href']
        if href.startswith('https'):
            link_list.append(href)
        elif href.startswith('/'):  # Handle relative URLs
            link_list.append(urljoin(base_url, href))
    if origin:
        return link_list[:1]
        # get 10 on original help page
    else:
        return link_list[:1]
        # 3 on all subpages



get_site_content()
