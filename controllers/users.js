const mongodb = require("../data/database.js");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  //#swager.tags=['Users']
    const result = await mongodb.getDatabase().collection("users").find();
    result.toArray().then((users) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(users);
    });
};

const getSingle = async (req, res) => {
  //#swager.tags=['Users']
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection("users").find({_id: userId});
    result.toArray().then((users) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(users[0]);
    });
};


const createUser = async (req, res) => {
  //#swager.tags=['Users']
    try {
        if (!req.body || !req.body.username) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const user = {
            email: req.body.email,
            username: req.body.username,
            name: req.body.name,
            ipaddress: req.body.ipaddress
        };

        const response = await mongodb.getDatabase().collection("users").insertOne(user);

        if (response.acknowledged) {
            res.status(201).json({ id: response.insertedId });
        } else {
            res.status(500).json(response.error || "Some error occurred while creating the user.");
        }
    } catch (err) {
        console.error("❌ Error in createUser:", err);
        res.status(500).json({ message: err.message });
    }
};


const updateUser = async (req, res) => {
  //#swager.tags=['Users']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const userId = new ObjectId(id);

    const user = {
      email: req.body.email,
      username: req.body.username,
      name: req.body.name,
      ipaddress: req.body.ipaddress
    };

    const response = await mongodb.getDatabase().collection("users").replaceOne({ _id: userId }, user);

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "User updated successfully", user });
    } else {
      res.status(404).json({ error: "User not found or no changes made" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Some error occurred" });
  }
};

const deleteUser = async (req, res) => {
  //#swager.tags=['Users']
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const userId = new ObjectId(id);

    const response = await mongodb.getDatabase().collection("users").deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Some error occurred" });
  }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
}