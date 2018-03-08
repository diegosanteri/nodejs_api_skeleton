var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* @module  Role
* @description Role Schema
*/

var RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

var role = mongoose.model('role', RoleSchema);

/** export schema */
module.exports = role;