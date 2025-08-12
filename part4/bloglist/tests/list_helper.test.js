const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { initialBlogs } = require("./test_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];
  const listWithOneBlogEqualsTheLikes = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 1,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of empty list is zero", () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlogEqualsTheLikes);
    assert.strictEqual(result, 1);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(initialBlogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("blog with the most likes", () => {
    const result = listHelper.favoriteBlog(initialBlogs);
    assert.deepStrictEqual(result, {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });
});

describe("most blogs", () => {
  test("author with the most blogs", () => {
    const result = listHelper.mostBlogs(initialBlogs);
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 });
  });
});

describe("most likes", () => {
  test("author with the most likes", () => {
    const result = listHelper.mostLikes(initialBlogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
