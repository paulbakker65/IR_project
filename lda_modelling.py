from __future__ import print_function
import nltk
from nltk.stem.snowball import SnowballStemmer
import re
import string
from nltk.tag import pos_tag
from gensim import corpora, models, similarities



def lda_topicmodeling(snippets, query):

    # load nltk's English stopwords as variable called 'stopwords'
    # nltk.download('stopwords')
    stopwords = nltk.corpus.stopwords.words(['dutch', 'english'])

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


    def strip_proppers(text):
        # first tokenize by sentence, then by word to ensure that punctuation is caught as it's own token
        tokens = [word for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent) if word.islower()]
        return "".join(
            [" " + i if not i.startswith("'") and i not in string.punctuation else i for i in tokens]).strip()


    def strip_proppers_POS(text):
        tagged = pos_tag(text.split())  # use NLTK's part of speech tagger
        non_propernouns = [word for word, pos in tagged if pos != 'NNP' and pos != 'NNPS']
        return non_propernouns

    # remove proper names
    preprocess = [strip_proppers(doc) for doc in snippets]

    # tokenize
    tokenized_text = [tokenize_and_stem(text) for text in preprocess]

    # remove stop words
    texts = [[word for word in text if word not in stopwords] for text in tokenized_text]

    # create a Gensim dictionary from the texts
    dictionary = corpora.Dictionary(texts)

    # remove extremes (similar to the min/max df step used when creating the tf-idf matrix)
    dictionary.filter_extremes(no_below=1, no_above=0.8)

    # convert the dictionary to a bag of words corpus for reference
    corpus = [dictionary.doc2bow(text) for text in texts]

    lda = models.LdaModel(corpus, num_topics=5,
                          id2word=dictionary,
                          update_every=5,
                          chunksize=10000,
                          passes=100)

    print(lda.show_topics())


    #topic_words = topics_matrix[:, :, 1]
    #for i in topic_words:
    #    print([str(word) for word in i])
    #    print()
