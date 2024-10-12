# Dubhacks Team!

## Our team;
- Aidan Bartlett
- Nathan Dang
- 
- 

# Goal/Project Description
A website summarizer (UW-focused) to work on easy education and accessibility.

- Scrape UW websites, collect and summarize information into a Mongo DB
    - Web crawler through websites
    - Use perplexity AI ? to process and clean text
- Make an API from Mongo to a website (side track) (React would be so easy)
- Use perplexity AI to interpret a user query based on a prompt (side track)
- then query the Mongo via API
- Return current information to the user

Stretch goals:

- Allow users to put in their own URLs to be scraped and summarized.
- Use Auth0 to ensure users are UW students before they query the UW database. (Sidetrack)



# How does the data collection work?
We want to fill our MongoDB with data summarizing the main student help information from the [UW student guide](https://www.washington.edu/students/). 
1. We walk through every link on this page (its basically just links)
2. In every link is a help guide, so we ask Perplexity AI to generate a list of 10 keyword phrases to represent the site (this will help with our search later on) and a short, 3 paragraph summary of the site.
3. Once the summary and keywords are generated, we upload the site's raw text, the summary, keywords, and url to the MongoDB
\
This has been done, and our database is populated with essentially a summarized UW student guide

# How will the "Search Engine" work?
We are not going to use any SEO models, even simple ones like tf-idf, we are instead going to test the possibilities of Perplexity AI by asking it to be our search engine. 
1. User will input a query they want to learn about. 
2. Perplexity will interpret their query and compare it to the known keywords from our database.
3. Perplexity will output the id of the index that the user is most likely interested in.
4. The 3 paragraph summary will be displayed.
5. Optionally - We could add another button that could display the whole raw text to the user.
6. Stretch goal - Allow the user to search for any UW website, this will summarize the site and add the sites summary to our existing corpus.
7. Stretch goal - Use a Word2Vec model to improve the search engine results. 
