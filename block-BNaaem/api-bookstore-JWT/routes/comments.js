var express = require('express');
var commentsRouterV2 = express.Router(); // commentsRouter added in app.js in version v2 -> for /api/v2/books/:id/comments
const Book = require('../models/Comments');
const { default: mongoose } = require('mongoose');

// POST /api/v2/books/ - add a comment to a book
commentsRouterV2.post('/:id/comments/', async (req, res, next) => {
  const bookId = req.params.id;
  try {
    var updatedBook = await Book.findByIdAndUpdate(
      bookObjectId,
      { $push: { comments: req.body } },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    var newComment = updatedBook.comments[updatedBook.comments.length - 1]; // Get the last added comment to send to res.json()

    res.json(newComment);
  } catch (err) {
    next(`Error adding comment to the book`);
  }
});

// Route changed in app.js from /api/v2/books/:id/comments to /api/v2/books/ for comments route well (same as books route)

// GET /api/v2/books/:id/comments - get all comments for a book
commentsRouterV2.get('/:id', async (req, res, next) => {
  const bookId = req.params.id;

  try {
    var book = await Book.findById(bookId).populate('comments').exec();

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ comments: book.comments });
  } catch (err) {
    next(`Error fetching comments for the book`);
  }
});

// PUT /api/v2/books/:id/comments/:commentId - edit a comment
commentsRouterV2.put('/:commentId', async (req, res) => {
  const { id, commentId } = req.params;

  try {
    var updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, {
      new: true,
    });

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Now update the comments array in the associated Book model
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $pull: { comments: commentId } }, // Remove the old comment from the array
      { new: true }
    ).populate('comments'); // Populate the updated comments array

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/v2/books/:id/comments/:commentId - delete a comment
commentsRouterV2.delete('/:commentId', async (req, res, next) => {
  const { id, commentId } = req.params;

  try {
    var removedComment = await Comment.findByIdAndRemove(commentId);

    if (!removedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update the book by removing the comment reference
    await Book.findByIdAndUpdate(id, { $pull: { comments: commentId } });

    res.json({ msg: 'Comment Deleted Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = commentsRouterV2;
