from __future__ import print_function
import GoogleScraper
import numpy as np


def scrape(keywords, search_engine : str, num_pages: int) -> object:
    scrape_results = []
    titles = []
    links = []
    snippets = []

    config = {
        'use_own_ip': True,
        'keywords': keywords,
        'search_engines': [search_engine],
        'num_pages_for_keyword': num_pages,
        'scrape_method': 'http',
        'sel_browser': 'chrome',
        'do_caching': False,
        'num_workers': 1
    }
    search = GoogleScraper.scrape_with_config(config)

    for serp in search.serps:
        print(serp)
        for link in serp.links:
            titles.append(link.title)
            links.append(link.link)
            snippets.append(str(link.snippet))
            """
            #print(link.title + '\n')
            #print(link.link + '\n')
            #print(link.snippet + '\n')
            """

    scrape_results.append(titles)
    scrape_results.append(links)
    scrape_results.append(snippets)
    return scrape_results


def multiScrape(queries):

    all_results = np.array([])
    for query in queries:
        results = scrape(query, 'google', 5)
        all_results = np.append(all_results, results)

    return all_results
