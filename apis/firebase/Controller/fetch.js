import { ref, get } from "firebase/database";
import { database } from "../firebase_init.js";
import express from "express";

const router = express.Router();

router.get("/books", async (req, res) => {
  try {
    const dataRef = ref(database, "books");
    const snapshot = await get(dataRef);
    const data = snapshot.val();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/books/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const dataRef = ref(database, "books");
    const snapshot = await get(dataRef);
    const data = snapshot.val();
    const filteredData = Object.values(data).filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
    res.json({ data: filteredData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/books/price/:minPrice/:maxPrice", async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.params;
    const dataRef = ref(database, "books");
    const snapshot = await get(dataRef);
    const data = snapshot.val();
    const filteredData = Object.values(data).filter(
      (book) => book.price >= minPrice && book.price <= maxPrice
    );
    res.json({ data: filteredData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/in_stock", async (req, res) => {
  try {
    const dataRef = ref(database, "books");
    const snapshot = await get(dataRef);
    const data = snapshot.val();
    const booksInStock = Object.values(data).filter(
      (book) => book.stock_availability === "In Stock"
    );
    res.json({ booksInStock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/out_of_stock", async (req, res) => {
  try {
    const dataRef = ref(database, "books");
    const snapshot = await get(dataRef);
    const data = snapshot.val();
    const booksInStock = Object.values(data).filter(
      (book) => book.stock_availability === "Out Of Stock"
    );
    res.json({ booksInStock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/books", async (req, res) => {
  try {
    const searchString = req.query.q; // get the substring query parameter
    const dataRef = ref(database, "books");
    const snapshot = await get(dataRef);
    const booksData = snapshot.val();

    // Filter the books that match the search string
    const matchingBooks = Object.values(booksData).filter((book) =>
      book.title.toLowerCase().includes(searchString.toLowerCase())
    );

    res.status(200).json(matchingBooks); // respond with a JSON array of matching books
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
