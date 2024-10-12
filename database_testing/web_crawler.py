import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin


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
        return link_list[:10]
        # get 10 on original help page
    else:
        return link_list[:3]
        # 3 on all subpages


get_site_content()
