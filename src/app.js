const express = require("express");

const app = express();

app.use(express.json());

// Serve static files from the public folder
app.use(express.static("public"));

// Routes
const productRoutes = require("./routes/productRoutes");

app.use("/products", productRoutes);

module.exports = app;