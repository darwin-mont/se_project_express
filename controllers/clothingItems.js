const ClothingItem = require("../models/clothingItem");
const {
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ items }))
    .catch((err) =>
      res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Get items failed", error: err.message })
    );
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      if (err.code === 11000) {
        return res
          .status(CONFLICT_STATUS_CODE)
          .send({ message: "Item with this name already exists" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Create item failed", error: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!req.user || !req.user._id) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Authentication required" });
  }

  if (!itemId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Item ID is required" });
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }

      // Check ownership
      if (item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN_STATUS_CODE)
          .send({ message: "You are not the owner of this item" });
      }

      // User owns the item, delete it
      return ClothingItem.deleteOne({ _id: itemId }).then(() =>
        res.status(200).send({ message: "Item deleted successfully" })
      );
    })

    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Delete item failed", error: err.message });
    });
  return res;
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Like failed", error: err.message });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Unlike failed", error: err.message });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
