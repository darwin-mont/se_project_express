const ClothingItem = require("../models/clothingItem");

// the getItems request handler

const getItems = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => res.status(200).send({ data: item }))
    .catch((error) => {
      console.error(
        `Error ${error.name} with the message ${error.message} has occurred while executing the code`
      );
      // does not run because no error was thrown
    });
};

// the createItem request handler

const createItem = (req, res) => {
  const { name, imageUrl } = req.body;

  ClothingItem.create({ name, imageUrl })
    .then((item) => res.status(201).send({ data: item }))
    .catch((error) =>
      res.status(500).send({ message: "create Item Failed", error: error })
    );
};

// the deleteItem request handler

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .then(() => res.status(200).send({ message: "Item deleted successfully" }))
    .catch((error) =>
      res.status(500).send({ message: "delete Item Failed", error: error })
    );
};

module.exports = { getItems, createItem, deleteItem };
