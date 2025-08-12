const { test, after, beforeEach, describe, afterEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const assert = require("node:assert");
const { initialUsers, usersInDb } = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);


describe("when there is initially some users saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(initialUsers);
  });
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const response = await api.get("/api/users");
    assert.equal(response.body.length, initialUsers.length);
  });

  test("a valid user can be added", async () => {
    const payload = {
      username: "test",
      name: "test",
      password: "Test@1234",
    };
    await api
      .post("/api/users")
      .send(payload)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const users = await usersInDb();
    
    assert.strictEqual(users.length, initialUsers.length + 1);
  });

  test("verify bad request", async () => {
    const noPasswordPayload = {
        username: "test",
        name: "test",
    };

    const noUsernamePayload = {
        name: "test",
        password: "Test@1234",
    };

    const usernameMinLengthError = {
        username: "te",
        password: "Test@1234",
    }

    const passwordMinLengthError = {
        username: "test",
        password: "Te",
    }

    await api.post("/api/users").send(noPasswordPayload).expect(400);
    await api.post("/api/users").send(noUsernamePayload).expect(400);
    await api.post("/api/users").send(usernameMinLengthError).expect(400);
    await api.post("/api/users").send(passwordMinLengthError).expect(400);

    const usersAtEnd = await usersInDb();

    assert.strictEqual(usersAtEnd.length, initialUsers.length);
  });

});

after(async () => {
  await mongoose.connection.close();
});
