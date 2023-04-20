import express from "express";

import Book from "../sql_connection.js";

const router = express.Router();

router.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll(); // fetch all books from the database
    res.status(200).json(books); // respond with a JSON array of books
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/books/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const book = await Book.findOne({ where: { title: title } }); // fetch the book with the specified title
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json(book); // respond with a JSON object of the book
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/books_in_stock", async (req, res) => {
  try {
    const books = await Book.findAll({
      where: {
        stock_availability: "In stock",
      },
    }); // fetch books that are currently in stock
    res.status(200).json(books); // respond with a JSON array of books
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/books_out_of_stock", async (req, res) => {
  try {
    const books = await Book.findAll({
      where: {
        stock_availability: "Out of Stock",
      },
    }); // fetch all books that are out of stock from the database
    res.status(200).json(books); // respond with a JSON array of books
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/books/price/:minPrice/:maxPrice", async (req, res) => {
  const { minPrice, maxPrice } = req.params;
  try {
    const books = await Book.findAll({
      where: {
        price: {
          [Op.between]: [minPrice, maxPrice],
        },
      },
    });
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/books", async (req, res) => {
  try {
    const searchString = req.query.q; // get the substring query parameter
    const books = await Book.findAll({
      where: {
        title: {
          [Op.like]: `%${searchString}%`, // case-insensitive search for substring in title column
        },
      },
    });
    res.status(200).json(books); // respond with a JSON array of matching books
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
