import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "successgirl123@",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});


app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const listTitle = req.body.listTitle;

  try {
    const addItem = "INSERT INTO items (title) VALUES ($1)";
    const addedItem = await db.query(addItem, [item]);

    console.log("Item successfully added");

    items.push({ title: item });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding item");
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const newTitle = req.body.updatedItemTitle;
  try {
    const editQuery = "UPDATE items SET title = $1 WHERE id = $2";
    const editedQuery = await db.query(editQuery, [newTitle, id]);

    console.log("Item edited successfully");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error editing item");
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;

  try {
    const deleteQuery = "DELETE FROM items WHERE id = $1";
    const deletedItem = await db.query(deleteQuery, [id]);

    console.log("Item deleted successfully");
    res.redirect("/"); 
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Error deleting item");
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
