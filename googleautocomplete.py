#!/usr/bin/python
# -*- coding: utf-8 -*-
from urllib.request import urlopen, quote
import urllib.parse as urlparse
import sys
import re
import numpy as np

# Source: http://stackoverflow.com/a/4391299
def urlEncodeNonAscii(b):
    return re.sub('[\x80-\xFF]', lambda c: '%%%02x' % ord(c.group(0)), b.decode('utf-8'))

# Source: http://stackoverflow.com/a/4391299
def iriToUri(iri):
    parts = urlparse.urlparse(iri)
    return urlparse.urlunparse(
        [urlEncodeNonAscii(part.encode('utf-8')) for part in parts]
    )

#==============================================================================
# autocompleteQuery()
#==============================================================================
def autocompleteQuery(query):
    client = "firefox"
    language = "en"
    url = "http://suggestqueries.google.com/complete/search?client=" + client \
            + "&q=" + query + "&hl=" + language
    iri = iriToUri(url)
    escaped_iri = quote(iri, safe="%/:=&?~#+!$,;'@()*[]")
    result = urlopen(escaped_iri).read().decode('iso8859-7')
    return result.split("[")[2].split("]]")[0].split(",")

#==============================================================================
# main()
#==============================================================================
def autocomp(query) :
    alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
     'x', 'y', 'z']
    autocompleted_queries = np.array([])
    for letter in alpha:
        new_query = query + ' ' + letter
        results = autocompleteQuery(new_query)
        stripped_results = np.array([])
        for r in results:
            stripped_results = np.append(stripped_results, np.array([r.strip('"')]))
        autocompleted_queries = np.append(autocompleted_queries, stripped_results)


    for r in autocompleted_queries:
        print(r)

    return np.unique(autocompleted_queries)

