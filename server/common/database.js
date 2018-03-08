const mongoose = require('mongoose')
mongoose.Promise = global.Promise

var url = process.env.MONGO_URL
var mongodatabase = process.env.MONGO_DATABASE

class Database {
    constructor(){
        try {
            if (process.env.NODE_ENV == "test") {
                const Mockgoose = require('mockgoose').Mockgoose;
                const mockgoose = new Mockgoose(mongoose);

                mockgoose.prepareStorage().then(function() {
                    mongoose.connect("https://localhost:27017/teste?socketTimeoutMS=120000", function(err) {
                        console.log('connected');
                    });
                });
            } else {
                if(url) {
                    url = `mongodb://${url}/${mongodatabase}`
                } else {
                    url = `mongodb://localhost/${mongodatabase}`
                }
                
                mongoose.connect(url);
                var db = mongoose.connection;
                db.on('error', console.error.bind(console, 'connection error:'));
                db.once('open', function callback () { console.log ("Database connected")});
            }
        }catch(e) {
            throw e;
        }
    }
}

module.exports = Database;