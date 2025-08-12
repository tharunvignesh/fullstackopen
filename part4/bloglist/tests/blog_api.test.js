const { test, after, beforeEach, describe, afterEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const assert = require("node:assert");
const {
  initialBlogs,
  blogsInDb,
  initialUsers,
  addTestUser,
  testUser,
} = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany([]);
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
    await addTestUser();
  });
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.equal(response.body.length, initialBlogs.length);
  });

  test("verify that the unique identifier property of the blog posts is named id", async () => {
    const blogs = await blogsInDb();
    blogs.forEach((blog) => {
      assert.equal(blog.hasOwnProperty("id"), true);
      assert.equal(blog.hasOwnProperty("_id"), false);
    });
  });

  test("a valid blog can be added", async () => {
    const payload = {
      title: "Dummy",
      author: "dummy",
      url: "http://dummy.com",
      likes: 2,
    };
    const loginResponse = await api.post("/api/login").send(testUser);
    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + loginResponse.body.token)
      .send(payload)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await blogsInDb();

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
  });

  test("verify that if the likes property is missing from the request, it will default to the value 0", async () => {
    const payload = {
      title: "Payload with no likes property",
      author: "dummy",
      url: "http://dummy.com",
    };

    const loginResponse = await api.post("/api/login").send(testUser);

    const response = await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + loginResponse.body.token)
      .send(payload)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.equal(response.body.hasOwnProperty("likes"), true);
    assert.strictEqual(response.body.likes, 0);

    const blogsAtEnd = await blogsInDb();

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
  });

  test("verify bad request", async () => {
    const noUrlPayload = {
      title: "No url",
      author: "dummy",
    };

    const noTitlePayload = {
      author: "dummy",
      url: "https://google.com",
    };

    const loginResponse = await api.post("/api/login").send(testUser);

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + loginResponse.body.token)
      .send(noUrlPayload)
      .expect(400);

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + loginResponse.body.token)
      .send(noTitlePayload)
      .expect(400);

    const blogsAtEnd = await blogsInDb();

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });

  test("verify delete request", async () => {
    const loginResponse = await api.post("/api/login").send(testUser);
    const blogsAtStart = await blogsInDb();

    const newBlog = {
      title: "test",
      author: "test",
      url: "http://test.com",
      likes: 1,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + loginResponse.body.token)
      .send(newBlog);

    await api
      .delete("/api/blogs/" + response.body.id)
      .set("Authorization", "Bearer " + loginResponse.body.token)
      .expect(204);

    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
    // assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);
  });

  test("verify update functionality", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate["likes"] = 10;

    const updatedBlog = await api
      .put("/api/blogs/" + blogToUpdate.id)
      .send(blogToUpdate)
      .expect(200);

    assert.strictEqual(updatedBlog.body.likes, 10);

    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });

  test("adding a blog fails with the proper status code 401 Unauthorized if a token is not provided", async () => {
    const payload = {
      title: "No Token",
      author: "abc",
      url: "http://abc.com",
      likes: 3,
    };
    await api
      .post("/api/blogs")
      .send(payload)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await blogsInDb();

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
