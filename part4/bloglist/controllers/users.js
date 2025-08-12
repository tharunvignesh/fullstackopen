const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const usersWithBlogs = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
  });

  response.json(usersWithBlogs);
});

usersRouter.get("/:id", async (request, response) => {
  const users = await User.findOne({ _id: request.params.id }).populate(
    "blogs");

  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;
    if (!password) {
      return response.status(400).json({ error: "password is required" });
    }
    if (password && password.length < 3) {
      return response.status(400).json({ error: "password is invalid" });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      name,
      passwordHash,
    });
    const newUser = await user.save();
    response.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
