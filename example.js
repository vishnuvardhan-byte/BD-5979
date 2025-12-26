const express = require("express");
const app = express();

app.use(express.json());

const products = [
  {
    id: 1,
    name: "vishnu",
    email: "vishnu@gmail.com",
  },
  {
    id: 2,
    name: "vardhan",
    email: "vardhan@gmail.com",
  },
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const newData = products.filter(
    (item) => item.id.toString() === req.params.id
  );
  return res.send(newData);
});

app.post("/addproducts", (req, res) => {
  const { id, name } = req.body;
  console.log(id, name);
  return res.send("Data Stored");
});

app.listen(3000, () => {
  console.log("Server is Running..");
});
