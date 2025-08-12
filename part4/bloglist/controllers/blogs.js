const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");
const blogsRouter = require("express").Router();

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });

    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", userExtractor, async (request, response, next) => {
  try {
    const { likes, author, url, title } = request.body;

    const user = request["user"];

    if (!user) {
      return response
        .status(400)
        .json({ error: "userId missing or not valid" });
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save({ validateModifiedOnly: true });
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response, next) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }
    const user = request["user"];

    if (!user) {
      return response
        .status(400)
        .json({ error: "userId missing or not valid" });
    }
    
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(id);
      response.status(204).end();
    } else {
      return response.status(401).json({ error: "user unauthorized" });
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { likes, author, url, title } = request.body;
  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }
  blog["likes"] = likes;
  blog["author"] = author;
  blog["url"] = url;
  blog["title"] = title;
  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

module.exports = blogsRouter;
