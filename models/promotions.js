const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;


var promoSchema = new Schema({
    name:  {
        type:  String,
        required: true,
        unique: true
        
    },
    images:  {
        type: String,
        required: false      
    },
    label:  {
        type: String,
        required: true
    },
    price :{
        type: String, //Currency,        
        required: false,
        min: 0
    },
    description: {
        type: String,
        required: false
    },
    featured: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
});

var Promotions = mongoose.model('Promotion', promoSchema);
module.exports = Promotions;