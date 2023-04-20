import express from "express";
import http from "http";
import dotenv from "dotenv";
const app = express();
const port = 3000;
dotenv.config();
app.use(express.json());

import fetch_route from "./Controller/fetch.js";

app.use("/fetch", fetch_route);

const server = http.createServer(app);

server.listen(port, () => {
  console.log("Im Listening to port " + port);
});

export default app;
