
from doctest import OutputChecker
from numpy import outer
import requests

from bs4 import BeautifulSoup

import json

import pandas as pd
import os
from dotenv import load_dotenv
load_dotenv()
#Firebase Stuff
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


cred = credentials.Certificate("./firebase/Private_key.json")

firebase_admin.initialize_app(cred, {
   'databaseURL': os.getenv('DB_URL')
})


ref = db.reference('books')

books_list = []




for i in range(1,50):
#the line below is case specific to the website I'm working with since the first page is labled as index.html instead of the page number
  url = f"https://books.toscrape.com/catalogue/page-{i}.html" if i > 1 else f"https://books.toscrape.com/catalogue/category/books_1/index.html"
  response = requests.get(url)
  response = response.content
  availability = ""

  soup = BeautifulSoup(response, 'html.parser')
  ol = soup.find('ol')
  articles = ol.find_all('article', class_='product_pod')
  for article in articles:
    image = article.find('img')
    anchor = article.find('a')
    url = anchor['href']
    title = image.attrs['alt']
    starTag = article.find('p')
    star = starTag['class'][1]
    availability_element = article.find('p', class_='availability')
    if availability_element and 'in stock' in availability_element.text.lower():
        availability = 'In Stock'
    else:
        availability = 'Out of Stock'
    price = article.find('p', class_='price_color').text
    price = float(price[1:])
    books_list.append({'Title': title, 'Star Rating': star, 'Price': price, 'Stock Availability': availability, 'url': url})



with open('./data/books.json', 'w') as f:
    json.dump(books_list, f)


with open('./data/books.json') as f:
    books_list = json.load(f)

    for book in books_list:
        title = book['Title']
        star_rating = book['Star Rating']
        price = book['Price']
        stock_availability = book['Stock Availability']
        url = book['url']
        new_book = {
            'title': title,
            'star_rating': star_rating,
            'price': price,
            'stock_availability': stock_availability,
            'url': url
        }
        ref.push(new_book)