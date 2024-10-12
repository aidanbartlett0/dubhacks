
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


'''
Format for data in Mongo:

{
website_title: 'title',
keywords: ["Go", "Hadoop", "Spark", "Vue.js"],
summary: 'text',
raw_text: 'big text'
}

we could also add some other stuff like questions: [{question: x, answer: y}]
That could be cool and just depend how intense yall make the front end
'''

# documents = [
#     {"title": "informatics", 
#      'keywords': ["Go", "Hadoop", "Spark"], 
#      'summary': 'These are data engineering things', 'text': 'idk text'},

#     {"title": "informatics", 
#      'keywords': ["Python", "JavaScript", "Java", "SQL", "R", "C++"], 
#      'summary': 'programming languages', 'text': 'idk text'},

#     {"title": "informatics", 
#      'keywords': ["Agile", "Cybersecurity", "Analytics", "Cloud Computing"], 
#      'summary': 'industry terms', 'text': 'idk text'},

#     {"title": "informatics", 
#      'keywords': ["Tableau", "Looker"], 
#      'summary': 'These are data viz', 'text': 'idk text'}


# ]
# uwwebsites.insert_many(documents)


for doc in uwwebsites.find():
    print(doc)

'''
Then you can do something like this so you can say
return the one that best matches the keywords.
'''
# query = {"keywords": {"$gt": 25}}  # Find documents where age > 25
# for doc in uwwebsites.find(query):
#     print(doc)

'''
Example of finding "matching" 
We could end up using Word2Vec or tf-idf but I think im the only one who could implement that so idk if well have time. 
It should be pretty easy to simply ask Perplexity to do this for us so likely do that
'''

query = ["AWS", "Azure", "Google Cloud", 'Python']
sites = [doc for doc in uwwebsites.find()]
returned_site = {}

for site in sites:
    for i in query:
        if i in set(site['keywords']):
            print('site found!')
            returned_site = site
            print('Website:', returned_site['title'])
            print('Summary:', returned_site['summary'])
