var mongoose = require('mongoose'),
Schema = mongoose.Schema;

  /**
    * @module  System
    * @description System schema
  */

var SystemSchema = new Schema({
  isStarted: {type: Boolean, default:false}
});

var system = mongoose.model('application', SystemSchema);


/** export schema */
module.exports = system;