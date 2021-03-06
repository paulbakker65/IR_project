from __future__ import print_function
import pandas as pd
import nltk
from nltk.stem.snowball import SnowballStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import re
import numpy as np


def kmeans(scrape_results, query):
    titles = scrape_results[0]
    links = scrape_results[1]
    snippets = scrape_results[2]
    #pages = []

    #for link in links :
    #    html = requests.get(link).text
    #    content = BeautifulSoup(html, 'lxml').getText().rstrip()
    #    pages.append(content)

    ranks = []

    for i in range(0, len(titles)):
        ranks.append(i)

    # load nltk's English stopwords as variable called 'stopwords'
    #nltk.download('stopwords')
    stopwords = nltk.corpus.stopwords.words(['dutch', 'english', 'german'])

    # load nltk's Snowball stemmer
    stemmer = SnowballStemmer("dutch")

    def tokenize_and_stem(text):
        # first tokenize by sentence, then by word to ensure that punctuation is caught as it's own token
        #nltk.download('punkt')
        tokens = [word.lower() for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
        filtered_tokens = []
        # filter out any tokens not containing letters (e.g., numeric tokens, raw punctuation)
        for token in tokens:
            if re.search('[a-zA-Z]', token) and token not in stopwords and token is not query:
                filtered_tokens.append(token)
        stems = [stemmer.stem(t) for t in filtered_tokens]
        return stems

    def tokenize_only(text):
        # first tokenize by sentence, then by word to ensure that punctuation is caught as it's own token
        tokens = [word.lower() for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
        filtered_tokens = []
        # filter out any tokens not containing letters (e.g., numeric tokens, raw punctuation)
        for token in tokens:
            if re.search('[a-zA-Z]', token) and token not in stopwords and token is not query:
                filtered_tokens.append(token)
        return filtered_tokens

    totalvocab_stemmed = []
    totalvocab_tokenized = []

    for i in snippets:
        allwords_stemmed = tokenize_and_stem(i)
        totalvocab_stemmed.extend(allwords_stemmed)

        allwords_tokenized = tokenize_only(i)
        totalvocab_tokenized.extend(allwords_tokenized)

    vocab_frame = pd.DataFrame({'words': totalvocab_tokenized}, index=totalvocab_stemmed)

    #Calcute TF-IDF
    tfidf_vectorizer = TfidfVectorizer(max_df=0.8, max_features=200000,
                                       min_df=0.01, stop_words='english',
                                       use_idf=True, tokenizer=tokenize_and_stem, ngram_range=(1, 3))

    tfidf_matrix = tfidf_vectorizer.fit_transform(snippets)
    terms = tfidf_vectorizer.get_feature_names()
    dist = 1 - cosine_similarity(tfidf_matrix)

    num_clusters = 5

    km = KMeans(n_clusters=num_clusters)
    km.fit(tfidf_matrix)

    clusters = km.labels_.tolist()

    documents = {'title': titles, 'rank': ranks, 'snippet': snippets, 'cluster': clusters, 'link': links}

    frame = pd.DataFrame(documents, index=[clusters], columns=['rank', 'title', 'cluster'])

    print("Top terms per cluster:")
    print()
    order_centroids = km.cluster_centers_.argsort()[:, ::-1]
    for i in range(num_clusters):
        print("Cluster %d words:" % i, end='')
        for ind in order_centroids[i, :6]:
            print(' %s' % vocab_frame.ix[terms[ind].split(' ')].values.tolist()[0][0].encode('utf-8', 'ignore'),
                  end=',')
        print()
        print()
        print("Cluster %d titles:" % i, end='')
        for title in frame.ix[i]['title'].values.tolist():
            print(' %s,' % title, end='')
        print()
        print()

    result = []
    result.append(titles)
    result.append(links)
    result.append(snippets)
    result.append(clusters)

    return result






