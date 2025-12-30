const express = require("express");
const router = express.Router();
const { getUsers, getUserById } = require("../controllers/userController");


// GET all users
router.get("/", getUsers);

// GET user by ID
router.get("/:id", getUserById);

module.exports = router;    
