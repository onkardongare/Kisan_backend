const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String},
  role: { type: String, enum: ['user', 'admin']},
  email: { type: String, required: true},
  password: { type:String, required: true},
  location: {
    latitude: { type: Number, required: true},
    longitude: { type: Number, required: true},
    address: { type: String, required: true},
  },
  salt: Buffer,

});

// to convert a _id to id for frontend simplicity
 userSchema.virtual('id').get(function() {
     return this._id;
 })

// Transform output when converting to JSON
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

exports.User = mongoose.model('User', userSchema);