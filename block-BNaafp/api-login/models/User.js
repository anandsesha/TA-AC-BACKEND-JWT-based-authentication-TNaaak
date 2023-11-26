var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, requied: true },
  email: { type: String, requied: true },
  password: { type: String, requied: true },
});

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    console.log(this, `inside pre-save hook`);
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password, cb) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (err) {
    return err;
  }
};

var User = mongoose.model('User', userSchema);
module.exports = User;
