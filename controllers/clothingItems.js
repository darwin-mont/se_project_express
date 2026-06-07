const ClothingItem = require("../models/clothingItem");

// the getItems request handler
const getItems = (req, res) => {
  ClothingItem.find(req.params.itemId)
    .then((item) => res.status(200).send({ data: item }))
    .catch((error) => {
      console.error(`Error with item ${req.params.itemId}:`, error);
    });
};

// the createItem request handler - FIXED VERSION
const createItem = (req, res) => {
  const { name, imageUrl, weather, owner } = req.body; // ← ADDED weather and owner

  ClothingItem.create({ name, imageUrl, weather, owner }) // ← ADDED weather and owner
    .then((item) => res.status(201).send({ data: item }))
    .catch((error) =>
      res.status(500).send({ message: "create Item Failed", error })
    );
};

// the deleteItem request handler
const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .then(() => res.status(200).send({ message: "Item deleted successfully" }))
    .catch((error) =>
      res.status(500).send({ message: "delete Item Failed", error })
    );
};

module.exports = { getItems, createItem, deleteItem };
