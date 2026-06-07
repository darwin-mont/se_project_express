const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ items })) // Fixed: removed braces and return
    .catch((err) =>
      res.status(500).send({ message: "get Items Failed", error: err })
    ); // Fixed: removed braces and return
};

const getItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID format" });
      }
      if (err.name === "ValidationError") {
        // Added this check to fix consistent-return
        return res.status(500).send({ message: "get Item Failed", error: err });
      }
      return res.status(500).send({ message: "get Item Failed", error: err });
    });
};

const createItem = (req, res) => {
  const { name, avatar } = req.body;

  ClothingItem.create({ name, avatar })
    .then((item) => res.status(201).send({ data: item })) // Fixed: removed braces and return
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "Item with this name already exists" });
      }
      return res
        .status(500)
        .send({ message: "create User Failed", error: err });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID format" });
      }
      return res
        .status(500)
        .send({ message: "delete Item Failed", error: err });
    });
};

// likeItem and unlikeItem functions would be implemented here
const likeItem = (req, res) => {
  // Implementation for liking an item
};

const unlikeItem = (req, res) => {
  // Implementation for unliking an item
};

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
