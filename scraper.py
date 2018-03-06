import GoogleScraper
from GoogleScraper.database import ScraperSearch

if __name__ == '__main__':
    config = {
        'use_own_ip': True,
        'keyword': 'Let\'s go bubbles!',
        'search_engines': ['google'],
        'num_pages_for_keyword': 1,
        'scrape_method': 'selenium',
        'sel_browser': 'chrome',
        'do_caching': False
    }
    sqlalchemy_session = GoogleScraper.scrape_with_config(config);

    for search in sqlalchemy_session.query(ScraperSearch).all():
        for serp in search.serps:
            print(serp)
            for link in serp.links:
                print(link)
