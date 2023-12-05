var express = require('express');
var routerV1 = express.Router(); // for /api/v1/books
var routerV2 = express.Router(); // for /api/v2/books (book enhancements - added comments to books)
var routerV3 = express.Router(); // for /api/v3/books/categories (added categories in book schema)
var routerV4 = express.Router(); //  for /api/v3/books/tags (added tags in book schema)
const Book = require('../models/Book');
const auth = require('../middlewares/auth');

// Version 1: Endpoints for Books

// GET /api/v1/books - list of all books
routerV1.get('/', auth.verifyToken, async (req, res, next) => {
  try {
    var allBooks = await Book.find({});
    res.status(200).json({ allBooks });
  } catch (err) {
    next(err);
  }
}); // Tested postman

// GET /api/v1/books/:id - get single book
routerV1.get('/:id', async (req, res, next) => {
  try {
    var bookId = req.params.id;
    var book = await Book.findById(bookId);
    res.status(200).json({ book });
  } catch (err) {
    console.log(`In Catch`);
    next(`Cannot get this findByID User`);
  }
}); //Tested Postman

// POST /api/v1/books - create a book
routerV1.post('/', async (req, res, next) => {
  try {
    console.log(`Inside create book router`);

    console.log(req.body);
    var newBook = await Book.create(req.body);
    res.json({ newBook });
  } catch (err) {
    next(`Error inserting book into MongoDB`);
  }
}); //Tested with postman

// PUT /api/v1/books/:id - update a book
routerV1.put('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    // Find the book by ID and update it
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); //Tested

// DELETE /api/v1/books/:id - delete a book
routerV1.put('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    // Find the book by ID and update it
    const removedBook = await Book.findByIdAndRemove(bookId);

    if (!removedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ msg: 'Book Deleted Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); //Tested postman - issue

//-----------------------------------------------------------------------------------------//

// Version 2: Endpoints for Books and Comments  (routerV2 -> /api/v2/books)
// Comments handled separately in comments.js router

// 1. GET /api/v2/books - list of all books with comments (displayed on the dashboard page)
routerV2.get('/', async (req, res, next) => {
  try {
    var allBooksWithComments = await Book.find({}).populate('comments').exec();
    res.status(200).json({ allBooksWithComments });
  } catch (err) {
    next(err);
  }
});

// 2.  GET /api/v2/books/:id - get single book with comments (displayed on singleBook page)
routerV2.get('/:id', async (req, res, next) => {
  try {
    var bookId = req.params.id;
    var singleBook = await Book.findById(bookId).populate('comments').exec();
    res.status(200).json({ singleBook });
  } catch (err) {
    next('Cannot get this findById Book along with its comments');
  }
});

// Comments handled separately in -> comments.js router

//-----------------------------------------------------------------------------------------//
// Version 3: Endpoints for Book CATEGORIES

// POST /api/v3/books/categories  - create a category
routerV3.post('/', async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    console.log(categoryName);

    const existingCategory = await Book.findOne({ categories: categoryName });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = await Book.create({ categories: [categoryName] });

    res.status(201).json(newCategory.categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/v3/books/categories/:categoryId - edit a category
routerV3.put('/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { updatedCategoryName } = req.body;

    const updatedCategory = await Book.findByIdAndUpdate(
      categoryId,
      { name: updatedCategoryName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updatedCategory.name);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/v3/books/categories/:categoryId - delete a category
routerV3.delete('/:categoryId', async (req, res, next) => {
  const { categoryId } = req.params;

  try {
    var removedCategory = await Category.findByIdAndRemove(categoryId);

    if (!removedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/v3/books/categories - List all categories category
routerV3.get('/:bookid', async (req, res, next) => {
  console.log(
    `Inside router to list all categories. Means login is successful and token is obatined`
  );
  const bookId = req.params.bookId;

  try {
    var book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Display the categories for the specific book
    res.json({ categories: book.categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/v3/books/categories/:categoryName - list books by category
routerV3.get('/:categoryName', async (req, res, next) => {
  const categoryName = req.params.categoryName;

  try {
    var booksWithCategory = await Book.find({ categories: categoryName });

    if (booksWithCategory.length === 0) {
      return res
        .status(404)
        .json({ message: `No books found for category: ${categoryName}` });
    }

    res.json(booksWithCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/v3/books/categories/count - count books for each category
routerV3.get('/count', async (req, res, next) => {
  try {
    const allBooks = await Book.find();

    // Count books for each category
    const categoryCounts = allBooks.reduce((counts, book) => {
      book.categories.forEach((category) => {
        counts[category] = (counts[category] || 0) + 1; // (counts[category] || 0): This is a logical OR (||) expression. It checks if counts[category] is truthy. If it is, it uses that value as the current count. If it's falsy (undefined or 0), it uses 0 as a default value. This is a way to handle cases where the category hasn't been encountered before, and its count is not defined yet.
      });
      return counts;
    }, {});

    res.json({ categoryCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// This last one below has got nothing to do with category. So we wount be using routerV3 since that routes to  /api/v3/books/categories. Instead well use routerV2: /api/v3/books/
// GET /api/v3/books/authors/:authorName - list books by author
routerV2.get('/authors/:authorName', async (req, res, next) => {
  try {
    const authorName = req.params.authorName;

    // Find books by the specified author
    const booksByAuthor = await Book.find({ author: authorName });

    res.json({ books: booksByAuthor });
  } catch (error) {
    console.error('Error listing books by author:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//-----------------------------------------------------------------------------------------//
// Version 4: Endpoints for Book TAGS

// GET /api/v4/books/tags - list all tags

routerV4.get('/', async (req, res, next) => {
  try {
    var allBooks = await Book.find({});
    var alltags = allBooks.map((book) => book.tags);

    // Remove duplicate tags by converting to a Set and then back to an array
    const uniqueTags = [...new Set(allTags)];
    res.json({ uniqueTags });
  } catch (err) {
    next(err);
  }
});

// GET /api/v4/books/tags - list all tags in ascending order

routerV4.get('/', async (req, res, next) => {
  try {
    const allBooks = await Book.find({});
    const allTags = allBooks.flatMap((book) => book.tags);

    const uniqueTags = [...new Set(allTags)];

    // Sort the tags in ascending order
    const ascendingTags = uniqueTags.sort();

    res.json({ ascendingTags });
  } catch (err) {
    next(err);
  }
});

// GET /api/v4/books/tags/:tag - filter books by tag
routerV4.get('/:tag', async (req, res, next) => {
  try {
    const tagToFilter = req.params.tag;

    // Find books that contain the specified tag
    const filteredBooks = await Book.find({ tags: tagToFilter });

    res.json({ filteredBooks });
  } catch (err) {
    next(err);
  }
});

// GET /api/v4/books/tags/count - count books for each tag
routerV4.get('/count', async (req, res, next) => {
  try {
    // Use the aggregation framework to group and count books by tags
    const tagCounts = await Book.aggregate([
      { $unwind: '$tags' }, // creates separate doc for each tag
      { $group: { _id: '$tags', count: { $sum: 1 } } }, // groups the documents by tags and gives count for each tag document. eg.  [{ _id: 'Sci-Fi', count: 2 }, { _id: 'Adventure', count: 1 }, .....etc]
      { $project: { _id: 0, tag: '$_id', count: 1 } }, // projects what you want
    ]);

    res.json({ tagCounts });
  } catch (err) {
    next(err);
  }
});

module.exports = { routerV1, routerV2, routerV3, routerV4 };
