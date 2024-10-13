import requests
import ast
import re
import hashlib


def call(content):
    perplexity_api_key = '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'
    url = "https://api.perplexity.ai/chat/completions"

    payload = {
        "model": "llama-3.1-sonar-small-128k-online",
        "messages": [
            {
                "role": "system",
                "content": "Your purpose is to summarize and pre-processs text from a website. Be clear and precise. Generate a list of 10 keywords for the given \"SITE CONTENT\" and a 3 paragraph summary of the \"SITE CONTENT\". The summary should not be bulletted lists, it should be 3 paragraphs of general summary text and should not include any URLS. The keywords should not be more than 3 tokens each and should not include URLs. Format your output to be EXACTLY like this: \"##KEYS## [<KEY>, <KEY>, <KEY>, <KEY>, <KEY>, <KEY>, <KEY>, <KEY>, <KEY>, <KEY>] ##SUMMARY##\". Exclude the rest of the \"SITE CONTENT\" from the output."
            },
            {
                "role": "user",
                "content": f'SITE CONTENT: \"{content}\"'
            }
        ],
        "max_tokens": 1000,
        "temperature": 0.2,
        "top_p": 0.9,
        "return_citations": True,
        "search_domain_filter": ["perplexity.ai"],
        "return_images": False,
        "return_related_questions": False,
        "search_recency_filter": "month",
        "top_k": 0,
        "stream": False,
        "presence_penalty": 0,
        "frequency_penalty": 1
    }
    headers = {
        "Authorization": f"Bearer {perplexity_api_key}",
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    text = response.text
    lit_text = ast.literal_eval(text)

    chat_response = lit_text['choices'][0]['message']['content']

    return chat_response


def extract_keywords(text):
    keywords = text.split("##")[2]
    keywords = keywords.split(',')
    keys = [re.sub(r'[^a-zA-Z0-9\s]', '', i).strip() for i in keywords]
    return keys


def extract_summary(text):
    summary = text.split("##")[4]
    return summary


def generate_hash(keywords):
    keywords_str = ' '.join(keywords)
    hash_object = hashlib.sha256(keywords_str.encode('utf-8'))
    hex_dig = hash_object.hexdigest()
    return hex_dig[:25]


def make_output(content: str):
    text = call(content)
    keys = extract_keywords(text)
    hash_id = generate_hash(keys)
    summary = extract_summary(text)
    return {'hash_id': hash_id, 'keys': keys, 'summary': summary}


'''
DEPRICATED - Old scraping prompt
def extract_keywords(text):
    keywords = text.split('###')[1]
    lines = text.split('\n')
    keywords = []

    for i in lines:
        if i.startswith('- '):
            keyword = i[2:].strip()
            keywords.append(keyword)

    return keywords


def extract_sumary(text):
    summary = text.split('###')[2]
    if summary.startswith(' Summary:\n\n'):
        summary = summary[14:].strip()
    return summary
'''
