Books and Comments API

This repository contains an Express.js application that provides API endpoints for managing books and their comments. The API supports two versions: v1 and v2.

API Routes

<!-- Version 1 (v1) -->

Books Endpoints:

1. GET /api/v1/books: List all books.
2. GET /api/v1/books/:id: Get details of a single book.

<!-- Version 2 (v2) -->

Books Endpoints:

1. GET /api/v2/books: List all books "with comments".
2. GET /api/v2/books/:id: Get details of a single book "with comments".

Comments Endpoints:

1. POST /api/v2/books/:id/comments: Add a comment to a book.
2. GET /api/v2/books/:id/comments: Get all comments for a book.
3. PUT /api/v2/books/:id/comments/:commentId: Edit a comment.
4. DELETE /api/v2/books/:id/comments/:commentId: Delete a comment.

<!-- Clarify (Versioning in this Express API server -> api-bookstore) -->

v1 -> '/api/v1/books' - Book list single,list all, get, update, delete handled

v2 -> '/api/v2/books' - Book and comments(which are added to books) "common" routes handled - list all books with comments, list single book with all its comments.
v2 -> '/api/v2/books/:id/comments' - Also, a separate router added in v2 to handle comments specific routes (which won't be routing through books) - add, get, edit, delete a comment.

v3 -> '/api/v3/books/categories' - To handle routes specific to book categories which are modeled now. No separate router file, all category code in books.js route.

v4 -> '/api/v3/books/tags' - To handle routes specific to book tags which are added to schema after V3. No separate router file, all category code in books.js route.

<!-- JWT token authentication for this Bookstore 😎 -->

<!--
Goal: Modify book-store app from APIs basics chapter to do the follwing:

1. add login/registration for users using JWT tokens  
✅Solution: Here we have implemented token verification only for /login route not for /register. i.e a when a user register's he simple gets a success message back not a token. 

2. only a logged in user can create book, category and comment on any book.
✅Solution: After the user logs in (and has a token), only then he can access the books, comments or categories realted routes. Handled in app.js using "auth.verifyToken" in app.use() middleware. 

3. only a logged in user can edit his own book as well as comment.
✅Solution: edit a book authenticated using the same approach above. For comments as well. But, Comments routers (comments.js) handled incorrectly.  


Pending
4. for each book add price and quantity
✅Solution: Price and quantity added in model schema. Routes (fetching inside each book) and Views yet to be handled.  


5. add cart option for each user to buy books, where:
a. each user will have one cart
b. logged in user can add books to his cart
c. logged user can remove books from his cart

const userSchema = new mongoose.Schema({
  ...
  ..
  ..
  cart: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      quantity: { type: Number, default: 1 },
    },
  ],
});

- Also handle routes to allow logged in user (basically, with token) to add to cart and remove from cart.
- Handle views accordingly.
>
