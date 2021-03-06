import numpy as np
import scraper as sc
import kmeans as km
import json
import googleautocomplete as ga
import wikipedia
import sys
import lda_modelling as lm

if __name__ == '__main__':

    queries = ['jaguar', 'hertz', 'shell', 'apple', 'fish', 'mouse', 'bear', 'duck']

    for query in queries:

        try:
            page = wikipedia.summary(query + ' disambiguation')
            queries_temp = np.append([query], wikipedia.search(query, results=10))
        except wikipedia.exceptions.DisambiguationError as e:
            queries_temp = np.append([query], e.options[:10])

        # queries_temp = ga.autocomp(query)
        result_scrape = sc.scrape(queries_temp, 'google', 3)

        results_cluster = km.kmeans(result_scrape, query)
        # lm.lda_topicmodeling(result_scrape[2], query)

        with open(query + '.json', 'w') as f:
            json.dump(results_cluster, f)
