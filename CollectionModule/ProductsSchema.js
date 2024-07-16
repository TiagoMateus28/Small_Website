const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; //Our schema 

const specs = new Schema({
    namespecs: {
        type: String,
        required: true
    },
    value : {
        type: Number,
        required: true
    },
    optionDescription: {
        type: String,
        required: true
    },
}, {_id: false}); //we do not want the id of this subschema


const productSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    pictures: {
      type: String,
    },
    specs: specs,
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  }, { timestamps: true }); //This feature gves the created and upadated time by the user.


// Defining our database model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
