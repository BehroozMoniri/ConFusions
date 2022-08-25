var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    }, 
    // favorites: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : 'dish',
    //     required:false,
    // },
    facebookId:  String,
    admin:   {
        type: Boolean,
        default: false
    }
});
module.exports = User

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);

