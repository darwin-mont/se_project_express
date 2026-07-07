const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} = require("../utils/errors");

// === GET ITEMS === //
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ items }))
    .catch(next);
};

// === CREATE ITEM === //
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      next(err);
    });
};

// === DELETE ITEM === //
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  // CHECK AUTHENTICATION //
  if (!req.user || !req.user._id) {
    return next(new UnauthorizedError("Authentication required"));
  }

  // CHECK IF ITEMID IS PROVIDED
  if (!itemId) {
    return next(new BadRequestError("Item ID is required"));
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }

      // Check ownership
      if (item.owner.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError("You are not the owner of this item"));
      }

      // User owns the item, delete it
      return ClothingItem.deleteOne({ _id: itemId }).then(() =>
        res.status(200).send({ message: "Item deleted successfully" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      next(err);
    });
};

// === LIKE ITEM === //
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      next(err);
    });
};

// === UNLIKE ITEM === //
const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
