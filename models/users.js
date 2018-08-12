let mongoose = require('mongoose');

const Schema = mongoose.Schema;
 
const Users = new Schema({
  username: {
      type: String,
      required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
      type:String,
      required: true
  },
  created: {
      type: Date,
      default: Date.now
  },
  userType: {
      type: String,
      default: 'customer'
  }
});

module.exports = mongoose.model('Users', Users)