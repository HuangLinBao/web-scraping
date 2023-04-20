# web-scraping

This task was assigned by Xngage during Bits & Bytes Hackathon that took place in An-Najah University.
The task was to scrape the website [books.toscraoe](https://books.toscrape.com/catalogue/category/books_1/index.html) and fetch certain data about all the books, store it in a database or any storage element and create APIs that fetch these books accordingly.

The data we have to fetch the books based on are Book title , prices, ratings and in-stock availability.

## Scraping and storing

I used python for this process and created 2 files each scrape and store but one stores the data in a local mysql database while the other one stores the data in a firebase Realtime databse.

Libraries used for this entire process are:
1. `requests` to perform the web request.
2. `BeautifulSoup` to store data from the request response and parse it as HTML
3. `json` and `pandas` to store fetched elements and data in a JSON file to be used later.
4. `sqlalchemy` to store the data in mysql database using ORMs instead of prepared statements.
5. `firebase-admin` for the file that stores scraped data in the firebase db.

## APIs

I used NodeJS with Express to create 2 separate projects (both are available within this repo) to create the same APIs.
One project fetches from the mysql database while the ohther fetches from firebase.

APIs created are:
  1. Fetch all books
  2. Fetch By the title.
  3. Fetch all books within a certain price range
  4. Fetch In or Out of stock books(One API per each)
  5, Mimic Realtime search "keep showing you results as you type the title in a search bar" (Not tested yet).
  
 I wasn't able to create APIs for the rating since the yeilded data from the scraping process was a string (in the form of "ONE", "TWO",..) instead of Numerical values
