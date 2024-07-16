const express = require('express'); //designed for building web applications and APIs
const router = express.Router();
const Product = require('../CollectionModule/ProductsSchema');
const axios = require('axios');
const port = 3000;
const { menu, backMenu } = require('./menuNav');
const connectToMongoDB = require('./mongodb');
connectToMongoDB();


// Middleware to parse request bodies with URL-encoded and Json payloads.
router.use(
    express.urlencoded({
        extended: true
    })
)
router.use(express.json())


// Routes:

// Route to create a new product
router.post('/save_product', (req, res) => {
    const product = new Product(req.body);
    product.save()
        .then(result => {
            res.send(`
                ${menu()}
                <h1>Product successfully Saved.</h1>
                ${backMenu("/add_product", "Save")}`)
        })
        .catch(err => {
            console.error(err);
        });
});

// Route to a Delete a product by id
// This route handles the form submission and converts it to a DELETE request using axios
router.post('/remove_product', (req, res) => {
    const id = req.body.deleteProductId;
    axios.delete(`http://localhost:${port}/products/remove_product/${id}`)
        .then(response => {
            const deleteData = response.data;
            if(deleteData.success){
                res.send(`
                    ${menu()}
                    <h1>${deleteData.message}</h1>
                    ${backMenu("/remove_product", "Delete")}`
                );}
            else{
                res.send(`
                    ${menu()}
                    <h1>${deleteData.message}</h1>
                    ${backMenu("/remove_product", "Delete")}`
            )}
        })
});

// This route handles the DELETE request
router.delete('/remove_product/:id', (req, res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                // Sending JSON response with success status
                res.json({ success: true, message: "Product successfully deleted." });
            } else {
                // Sending JSON response with failure status
                res.json({ success: false, message: "Product not found!" });
            }
        })
        .catch(err => {
            console.error(err);
            // Sending JSON response with error status
            res.json({ success: false, message: "Product not found!" });
        });
});

// Route to update a product
// This route handles the form submission and converts it to a Patch request using axios
router.post('/updateproduct', (req, res) => {
    const id = req.body.updateProductId;
    const contentBody = req.body;
    axios.patch(`http://localhost:${port}/products/updateproduct/${id}`, contentBody)
        .then(response => {
            const patchData = response.data;
            if(patchData.success){
                res.send(`
                    ${menu()}
                    <h1>${patchData.message}</h1>
                    ${backMenu("/updateproduct", "Update")}`
                );}
            else{
                res.send(`
                    ${menu()}
                    <h1>${patchData.message}</h1>
                    ${backMenu("/updateproduct", "Update")}`
            )}
        })
});

//This function verifies if any fields were updated, except the id
function validateContent (contentBody, chave){
    for(const key in contentBody){
        if(contentBody[key] !== '' && key !== chave){
            if(key === "specs"){
                const contentSpecs = contentBody[key]
                for(const keySpecs in contentSpecs){
                    if(contentSpecs[keySpecs] !== ''){
                        return true
                    }
                }    
            }
            else{
                return true
            };}
    } return false
}

// This route handles the Update  request
router.patch ('/updateproduct/:id'  , (req, res) => {
    const id = req.params.id;
    const contentBody = req.body;
    const updateContent = {};
    for(const key in contentBody){
        if(contentBody[key] !== ""){
            updateContent[key] = contentBody[key];
        }
    }
    //Verifying if any fields were updated, except the id
    if(validateContent(contentBody, "updateProductId")){ //it searchs for all keys in our req.body
        Product.findByIdAndUpdate(id, {$set: updateContent})
            .then(result => {
                if (result) {
                    // Sending JSON response with success status
                    res.json({ success: true, message: "Product successfully updated." });
                } else {
                    // Sending JSON response with failure status
                    res.json({ success: false, message: "Product not found!" });
                }
            })
            .catch(err => {
                console.error(err);
                // Sending JSON response with error status
                res.json({ success: false, message: "Product not found!" });
            });}
    else{
        // Sending JSON response with failure status
        res.json({ success: false, message: "Product found, but nothing to update!" });
    }
});

module.exports = router;

