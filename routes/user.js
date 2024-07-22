const express = require("express");
const router = require("express").Router();
const userController = require("../controller/user");
const { verifyToken } = require("../jwt");

// register a new user
router.post("/register", userController.registerUser);

// login a user
router.post("/login", userController.loginUser);

// update a user
router.put("/update", verifyToken, userController.updateUser);

// delete a user
router.delete("/delete/user/:id", verifyToken, userController.deleteUser);

// route pour obtenir tous les utilisateurs
router.get("/all/users", userController.getAllUsers);

// route pour obtenir un utilisateur par id
router.get("/user/:id", userController.getUserById);

// route pour générer un token de test
router.get("/generate/token", userController.generateTestToken);

module.exports = router;
