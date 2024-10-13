# app.py
from flask import Flask, jsonify, request

import requests
import ast

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://aidanb04:dubhackshacker@dubhacks.qxk8w.mongodb.net/"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!\n")
except Exception as e:
    print(e)

db = client['dubhacks']
uwwebsites = db['uwwebsites']

index_keys = [{'HASH_ID': doc['hash_id'], 'KEYS': doc['keys']}
              for doc in uwwebsites.find()]
print(index_keys)


def call(content):
    print(content)
    perplexity_api_key = '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'
    url = "https://api.perplexity.ai/chat/completions"

    payload = {
        "model": "llama-3.1-sonar-small-128k-online",
        "messages": [
            {
                "role": "system",
                "content": "Given a dictionary of hash_ids and lists of keywords at \"DICTIONARY\", return the HASH_ID where the keywords at KEYS best match the given \"PROMPT\". Return NOTHING except the \"HASH_ID\" from the \"DICTIONARY\" where the keywords at KEYS best match the \"PROMPT\". Do not explain your reasoning. Do not return the keywords. Your response should be formatted like this: \"Best Matching HASH_ID: <HASH_ID HERE>\"."
            },
            {
                "role": "user",
                "content": f"DICTIONARY: {index_keys}. PROMPT: {content}"
            }
        ],
        "max_tokens": 100,
        "temperature": 0.2,
        "top_p": 0.3,
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


def query_mongo(chat_response):
    print(chat_response)
    if 'HASH_ID' not in chat_response:
        return 'Try again'
    else:
        hash_id = chat_response.split('HASH_ID:')[-1].strip()
        print('HASH_ID:', type(hash_id))
        myquery = {"hash_id": hash_id}
        mydoc = list(uwwebsites.find(myquery))
        # print(mydoc)
        for i, doc in enumerate(mydoc):
            '''
            For some reason, you can't enter the list without 
            enumerate() so now we have this gross loop instead of a 
            simple mydoc[0]['sumamry] 
            :D
            '''
            if i == 0:  
                summary = doc.get('summary', 'No summary found')
                keys = doc.get('keys', 'No keys found')
                print('keys:', keys)
                break
        return {'summary': summary, 'keys': keys}


app = Flask(__name__)


@app.route('/run-code', methods=['GET'])
def run_code():
    input_text = request.args.get('input_text')
    # print(input_text)
    result = execute_python_code(input_text)
    return jsonify({"result": result})


def execute_python_code(input_text):
    print(input_text)
    response = call(input_text)
    # doc = query_mongo(response)
    # print(doc)
    # return response
    try:
        doc = query_mongo(response)
        if doc != 'Try again':
            doc['input'] = response
        return doc
    except Exception as e:
        return f"Exception: {e}"


if __name__ == '__main__':
    app.run(debug=True)
