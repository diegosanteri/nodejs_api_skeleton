var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* @module  PermissionSchema
* @description Permission schema
*/
var PermissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role' }]
});

var permission = mongoose.model('permission', PermissionSchema);


/** export schema */
module.exports = permission;