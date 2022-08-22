
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;


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
        type: String, //mongoose.Schema.Types.ObjectsId,
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
var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;