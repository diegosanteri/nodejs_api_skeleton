import  mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate';

/**
* @module  UserSchema
* @description User schema
*/
const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true, min: 5, max: 50 },
    lastname: { type: String, required: true, min: 5, max: 250 },
    cellphone: { type: String,  min: 12, max: 13 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, required: true },
    photo: { type: String },
    description: { type: String, max: 500 },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'permission' }],
    createdDate: { type: Date, default: Date() }
});

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(mongoosePaginate);
var User = mongoose.model('user', UserSchema);

module.exports = User;