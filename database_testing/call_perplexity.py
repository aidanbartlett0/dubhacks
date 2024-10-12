import requests
import ast


def call(content):
    perplexity_api_key = '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'
    url = "https://api.perplexity.ai/chat/completions"

    payload = {
        "model": "llama-3.1-sonar-small-128k-online",
        "messages": [
            {
                "role": "system",
                "content": "Give a list of comma-seperated keywords or keyword pairs for the given text and give a two paragraph summary of the text, specifically focused on the keywords"
            },
            {
                "role": "user",
                "content": content
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


def make_output(content: str):
    text = call(content)
    keys = extract_keywords(text)
    summary = extract_sumary(text)
    return {'text': text, 'keys': keys, 'sumamry': summary}
