import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from call_perplexity import *
import threading

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
existing_urls = set([doc['url'] for doc in uwwebsites.find()])


def get_site_content(url: str = 'https://www.washington.edu/students/',
                     depth: int = 0,
                     max_depth: int = 2,
                     origin: bool = True,
                     start_at: int = 0,
                     end_at: int = 10):
    '''
    it will start at the student help directory and
    go through every link in there to make a general help doc
    '''
    if depth > max_depth:  # Stop when max depth is reached
        return
    existing_urls.add(url)
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        print('link:', url, 'depth:', depth)
        text = soup.get_text()
        try:
            if url not in existing_urls or origin:

                mongo_input = make_output(text)
                mongo_input['url'] = url
                uwwebsites.insert_one(mongo_input)

                links = get_links(soup,
                                  base_url=url,
                                  origin=origin,
                                  start_at=start_at,
                                  end_at=end_at)

                for child in links:
                    if child not in existing_urls:
                        existing_urls.add(child)
                        get_site_content(url=child,
                                         depth=depth+1,
                                         max_depth=max_depth,
                                         origin=False,
                                         existing_urls=existing_urls)
                    else:
                        print('Skipped url', url)
            else:
                print('Skipped url', url)

        except Exception as e:
            print(f'Exception {e} occured with {url}')
    else:
        print(f"Status code: {response.status_code} at {url}")


def get_links(soup, base_url, origin, start_at, end_at):
    links = soup.find_all('a', href=True)
    link_list = []
    for i in links:
        href = i['href']
        if href.startswith('https'):
            link_list.append(href)
        elif href.startswith('/'):  # Handle relative URLs
            link_list.append(urljoin(base_url, href))
    if origin:
        return link_list[start_at:end_at]
        # Ive scraped the first :10
        # get 10 on original help page
    else:
        return link_list[:2]
        # 3 on all subpages


# thread1 = threading.Thread(target=get_site_content,
#                            args=('https://www.washington.edu/students/',
#                                  0, 2, True, 10, 20, existing_urls))
# thread2 = threading.Thread(target=get_site_content,
#                            args=('https://www.washington.edu/students/',
#                                  0, 2, True, 20, 30, existing_urls))

# # Start the threads
# thread1.start()
# thread2.start()

# # Wait for threads to finish
# thread1.join()
# thread2.join()


get_site_content(end_at=1)
