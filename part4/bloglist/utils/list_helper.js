const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const _mapTotalToKey = (groupedObject, identifierKeyName, totalKeyName) => {
  const arr = [];
  Object.keys(groupedObject).forEach((item, index) => {
    const obj = {};
    obj[identifierKeyName] = item;
    obj[totalKeyName] = groupedObject[item].reduce((accumulator, item) => accumulator + item.likes, 0);
    arr.push(obj);
  });
  return arr;
};

const _mapCollectionLengthToKey = (groupedObject, keyName) => {
  const arr = [];
  Object.keys(groupedObject).forEach((item, index) => {
    const obj = {};
    obj[keyName] = item;
    obj["total"] = groupedObject[item].length;
    arr.push(obj);
  });
  return arr;
};

const favoriteBlog = (blogs) => {
  if (blogs.length) {
    // const groupByAuthor = _groupBy(blogs, "author");
    // const totalLikesByAuthor = _mapTotalToKey(groupByAuthor, "author", "likes")
    
    const result = blogs.sort((a, b) => {
      return b.likes - a.likes;
    });
    return result[0];
  } else return null;
};

const mostLikes = (blogs) => {
  if (blogs.length) {
    const groupByAuthor = _groupBy(blogs, "author");
    const totalLikesByAuthor = _mapTotalToKey(groupByAuthor, "author", "likes")
    
    const result = totalLikesByAuthor.sort((a, b) => {
      return b.likes - a.likes;
    });
    return result[0];
  } else return null;
};

const mostBlogs = (blogs) => {
  if (blogs.length) {
    const groupByAuthor = _groupBy(blogs, "author");
    const totalBlogsByAuthor = _mapCollectionLengthToKey(groupByAuthor, "author").map(
      (item) => {
        return { author: item.author, blogs: item.total };
      }
    );
    const result = totalBlogsByAuthor.sort((a, b) => {
      return b.blogs - a.blogs;
    });
    return result[0];
  } else return null;
};

const _groupBy = (collection, iteratee) => {
  return collection.reduce((accumulator, item) => {
    let key = item[iteratee];
    if (accumulator.hasOwnProperty(key)) {
      accumulator[key].push(item);
    } else {
      accumulator[key] = [];
      accumulator[key].push(item);
    }
    return accumulator;
  }, {});
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs
};
