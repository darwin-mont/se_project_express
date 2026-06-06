const clothingItem = require("../models/clothingItem");

router.get("/", (req, res) => {
  // search the database
  clothingItem
    .find({})
    // return the found data to the user
    .then((users) => res.send({ data: users }))
    // if the record was not found, display an error message
    .catch((err) => res.status(500).send({ message: "Error" }));
});

router.post("/", (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Error" }));
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  clothingItem.findByIdAndDelete(id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Error" }));
});

module.exports = router;
