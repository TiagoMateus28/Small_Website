const express = require('express'); //designed for building web applications and APIs
const router = express.Router();
const Product = require('../CollectionModule/ProductsSchema');
const connectToMongoDB = require('./mongodb');
connectToMongoDB();


// Middleware to parse request bodies with URL-encoded and Json payloads.
router.use(
    express.urlencoded({
        extended: true
    })
)
router.use(express.json())


// Route to find all products
router.get('/M1/result', (req, res) => {
    Product.find()
        .then(result => {
            if(result[0]){
                res.json({ success: true,message: "Products found.", data: result});
            }
            else{
                res.json({ success: false, message: "Products not found.", data: result});
            }
    })
        .catch(err => {
            console.error(err);
    });
});


// Route to searched product
router.post('/M2/resultdata', (req, res) => {
    const id = req.body.findId;
    Product.findById(id) 
        .then(product => {
            if (product) {
                res.json({ success: true,message: "Product found.", data: product});
            }
            else{
                res.json({ success: false, message: "Product not found.",data: product });
            };
    })
        .catch(err => {
            console.error(err);
            res.json({ success: false, message: "Product not found.",data: product });
    });
});


// Route to get average product rating 
router.get('/M3/result', (req, res) => {
    Product.aggregate([{$group: {_id:null, avg_val:{$avg:"$rating"}}}])
        .then(result => {
            if(result){
                res.json({ success: true,message: "Average product rating found.", data: result});
            }
            else{
                res.json({ success: false, message: "Products not found.", data: result});
            }
    })
        .catch(err => {
            console.error(err);
            res.json({ success: false, message: "Products not found.",data: result });
    });
});



// Route to post the searched product by price 
router.post('/M4/resultdata', (req, res) => {
    const price_input = req.body.findPrice;
    Product.find({ price : {$gt: price_input} })
        .then(result => {
            if (result[0]){
                res.json({ success: true,message: "Product found.", data: result});}
            else {
                res.json({ success: false, message: "Product not found.",data: result });
            }
    })
        .catch(err => {
            console.error(err);
            res.json({ success: false, message: "Product not found.",data: result});
    });
});


// Route to post the searched product by brand and price 
router.post('/M5/resultdata', (req, res) => {
    const price_input = req.body.findPriceM5;
    const brand_input = req.body.findBrand;
    Product.find({ price : {$gt: price_input} , brand : brand_input})
        .then(result => {
            if (result[0]){
                res.json({ success: true,message: "Product found.", data: result});}
            else {
                res.json({ success: false, message: "Product not found.",data: result });
            }
    })
        .catch(err => {
            console.error(err);
            res.json({ success: false, message: "Product not found.",data: result});
    });
});

// Route to post the searched product by brand 
router.post('/M6/resultdata', (req, res) => {
    const brand_input = req.body.findBrandM6;
    Product.find({ brand : brand_input})
        .then(result => {
            if (result[0]){
                res.json({ success: true,message: "Product found.", data: result});}
            else {
                res.json({ success: false, message: "Product not found.",data: result });;
            }
    })
        .catch(err => {
            console.error(err);
            res.json({ success: false, message: "Product not found.",data: result});
    });
});

// Route to get the search product sorted in descending order 
router.get('/M7/result', (req, res) => {
    Product.find().sort({rating: -1 })
        .then(result => {
            if (result[0]){
                res.json({ success: true,message: "List of Products sorted in descending order found.", data: result});}
            else {
                res.json({ success: false, message: "There are no products in the database.", data: result});
            }
    })
        .catch(err => {
            console.error(err);
            res.json({ success: false, message: "There are no products in the database.", data: result});
    });
});


// Route to get a page the number of records in the database
router.get('/M8/result', (req, res) => {
    Product.find().count()
        .then(product => {
            if (product) {
                res.json({ success: true,message: "Products found.", data: product});
            }
            else{
                res.json({ success: true,message: "No products found.", data: product});
            };
    })
        .catch(err => {
            console.error(err);
            res.json({ success: false, message: "There are no products in the database.", data: product});
    });
});

// Route to get products that have images
router.get('/M9/result', (req, res) => {
    Product.find({pictures : {$exists : true, $ne: ""}})
        .then(result => {
            if (result[0]){
                res.json({ success: true,message: "Products with images found.", data: result});
            }
            else {
                res.json({ success: true,message: "There are no products in the database .", data: result});
            }
    })
        .catch(err => {
            console.error(err);
            res.json({ success: true,message: "There are no products in the database .", data: result});
    });
});


module.exports = router;