const express = require("express");

const router = express.Router();

const { auhtenticated } = require('../middlewares/auth');

const { uploadFile } = require('../middlewares/uploadFile');

const { register, login, checkAuth } = require('../controllers/auth');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/user');
const { getTodos, addTodo, getTodo, updateTodo, deleteTodo } = require('../controllers/todo');

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auhtenticated, checkAuth);

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user", auhtenticated, uploadFile("imageFile"), updateUser);
router.delete("/user/:id", deleteUser);

router.get("/todos", getTodos);
router.get("/todo/:id", getTodo);
router.post("/todo", addTodo);
router.patch("/todo/:id", updateTodo);
router.delete("/todo/:id", deleteTodo);

module.exports = router;