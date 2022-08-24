const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: false
    },
    comment:  {
        type: String,
        required: false
    },
    author:  {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    label: {
        type: String,
         
    },
    price: {
        type: String, 
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments:[commentSchema]
}, {
    timestamps: true
});


const favSchema = new Schema ({
    user : {    
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Favourite must have a user!" ]
    },
    dish : [ {    
        type: Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}
, {timestamps: true
});

var Favourites = mongoose.model('favourite', favSchema);
module.exports = Favourites;