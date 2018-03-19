import tkinter as tk
import numpy as np
from tkinter import *
from tkinter import ttk
import scraper
from tkinter import font

class SampleApp(tk.Tk):

    def __init__(self):
        tk.Tk.__init__(self)
        self.list_search = tk.Listbox(self, selectmode=tk.SINGLE)
        self.entry = tk.Entry(self)
        self.button = tk.Button(self, text="Search", command=self.on_button)
        self.button.pack()
        self.entry.pack()

    def on_button(self):
        scrape_results = scraper.scrape(self.entry.get(), 'google', 1)

        titles = scrape_results[0]
        links = scrape_results[1]
        snippets = scrape_results[2]

        j = 0
        for i in range(len(titles)):
            self.list_search.insert(j, titles[i])
            j = j + 1
            self.list_search.insert(j, snippets[i])
            j = j + 1
        self.list_search.config(width=0)
        self.list_search.config(height=0)
        self.list_search.pack()


if __name__ == '__main__':

    w = SampleApp()
    w.mainloop()

