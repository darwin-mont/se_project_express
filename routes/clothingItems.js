const router = require("express").Router();

const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/items/:itemId", deleteItem);

module.exports = router;
