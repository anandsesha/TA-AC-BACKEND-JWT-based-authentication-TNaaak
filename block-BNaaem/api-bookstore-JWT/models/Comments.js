var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema({
  content: String,
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
});

var Comment = mongoose.model('Comment', commentsSchema);
module.exports = Comment;
