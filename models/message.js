var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = mongoose.Schema({
	username: String,
    content: String,
    room: String,
    created: { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('msg', MessageSchema);