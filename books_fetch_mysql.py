
from doctest import OutputChecker
from numpy import outer
import requests

from bs4 import BeautifulSoup

import json

import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

# for ORMs
import sqlalchemy as sqlalchemy
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_URI = f"mysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"



engine = create_engine(DB_URI)
Session = sessionmaker(bind=engine)
session = Session()



books = []



#Scraping the data from the website

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
    books.append({'Title': title, 'Star Rating': star, 'Price': price, 'Stock Availability': availability, 'url': url})



with open('./data/books.json', 'w') as f:
    json.dump(books, f)


# Define the Book model
Base = sqlalchemy.orm.declarative_base()
class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    star_rating = Column(String(255))
    price = Column(Float)
    stock_availability = Column(String(255))
    url = Column(String(255))

    def __repr__(self):
        return f"<Book(title='{self.title}', star_rating='{self.star_rating}', price='{self.price}', stock_availability='{self.stock_availability}', url='{self.url}')>"
    

Base.metadata.create_all(engine)

# Read in the data from the JSON file
with open('./data/books.json') as f:
    books = json.load(f)

    for book in books:
        title = book['Title']
        star_rating = book['Star Rating']
        price = book['Price']
        stock_availability = book['Stock Availability']
        url = book['url']
        new_book = Book(title=title, star_rating=star_rating, price=price, stock_availability=stock_availability, url=url)
        session.add(new_book)


# Commit the changes and close the session
session.commit()
session.close()
