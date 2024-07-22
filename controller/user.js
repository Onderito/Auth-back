const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../jwt");

// create a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Vérifiez si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    // Créez un nouvel utilisateur
    const newUser = new User({ name, email, password });
    await newUser.save();
    newUser.password = undefined;
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  const user = await User.findOne({ email });

  if (!existingUser) {
    bcrypt.hashSync(password, 10);
    return res.status(404).json({ message: "User not found" }); // if the user does not exist, return an error
  }
  if (!bcrypt.compareSync(password, existingUser.password)) {
    return res.status(401).json({ message: "Invalid credentials" }); // if the password is incorrect, return an error
  }

  const token = generateToken(user._id); // generate a token for the user
  res.status(200).json({ message: "User logged in successfully", token });
};

// update user
exports.updateUser = (req, res) => {
  const { name, email, password } = req.body; // Récupérer les données du corps de la requête

  User.findByIdAndUpdate(
    req.user.id,
    { $set: { name, email, password } },
    { new: true }
  ) // Utiliser { new: true } pour retourner le nouvel utilisateur mis à jour
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully", user });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    });
};

// delete a user
exports.deleteUser = (req, res) => {
  const { id } = req.params; // get id from the url params

  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully", user });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    });
};

// Nouvelle fonction pour générer et afficher un token
exports.generateTestToken = (req, res) => {
  const testUser = { _id: "testUserId" }; // Utilisateur de test
  const token = generateToken(testUser);
  console.log("Generated Token:", token); // Afficher le token dans la console
  res.status(200).json({ token });
};

// get all users
exports.getAllUsers =
  ("/all/users",
  async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ messsage: "Error getting all users", error: error });
    }
  });

// get user by id
exports.getUserById =
  ("/user/:id",
  async (req, res) => {
    try {
      const userId = await User.findOne({ _id: req.params.id });
      res.json(userId);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error getting user by id", error: error });
    }
  });
