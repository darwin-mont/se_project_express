const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ items })) // Fixed: removed braces and return
    .catch((err) =>
      res.status(500).send({ message: "get Items Failed", error: err })
    );
};

const getItem = (req, res) => {
  ClothingItem.find(req.params)
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

// module.exports.createClothingItem = (req, res) => {
//   console.log(req.user._id); // _id will become accessible
// };

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  // Get owner from authenticated user (NOT from request body)
  const owner = req.user._id; //

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
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
        .status(400)
        .send({ message: "create Item Failed", error: err });
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

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // Add user ID to likes array
    { new: true } // Return the updated document
  )
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
      return res.status(500).send({ message: "Like failed", error: err });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // Remove user ID from likes array
    { new: true } // Return the updated document
  )
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
      return res.status(500).send({ message: "Unlike failed", error: err });
    });
};

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
