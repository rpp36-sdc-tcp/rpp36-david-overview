const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/sdc");

let productsSchema = new mongoose.Schema({
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number
});

let reviewSchema = new mongoose.Schema({
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: {type: String, default: null},
  helpfulness: {type: Number, default: 0},
  report: {type: Boolean, default: false},
  photos: [{
    id: Number,
    url: String,
  }],
  characteristics: {
    Size: {
      id: Number,
      value: String
    },
    Width: {
      id: Number,
      value: String
    },
    Comfort: {
      id: Number,
      value: String
    },
    Quality: {
      id: Number,
      value: String
    },
    Fit: {
      id: Number,
      value: String
    },
    Length: {
      id: Number,
      value: String
    },
  }
});


const Products = mongoose.model('Products', productsSchema);
const Reviews = mongoost.model('Reviews', reviewSchema);








let save = (item, callback) => {

}

let get = (cb) => {

}

let deleteAll = () => {

}


module.exports.save = save;
module.exports.get = get;
module.exports.deleteAll = deleteAll

