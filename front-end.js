const express = require('express'); //designed for building web applications and APIs
const app = express();
const axios = require('axios');
const port = 3000;
const path = require("path");
const basePath = path.join(__dirname, 'templates');
const { menu, backMenu } = require('./routesProduct/menuNav');

//General Functions
function listProductTemplate (product){ // --> talvez seja melhor colocar no menuNav ? a ver 
    let msg ="";
    msg+=`<div style= 'margin-left: 20px; fo  nt-size: 20px'>
        <p>Name: ${product.name || "Sorry there is no info"}</p>
        <p>Price: ${product.price || "Sorry there is no info"}</p>
        <p>Model: ${product.model|| "Sorry there is no info"}</p>
        <p>Brand: ${product.brand|| "Sorry there is no info"}</p>`
    if (product.pictures) {
        msg += `<p>Picture: <a href="${product.pictures}" alt="Product Image">Click to open image.</a></p>`;
    } else {
        msg += `<p>Picture: Sorry there is no info</p>`;
    }
    msg+= `<p>Specs: </p>`;
    msg += `<ul> `
    msg += `<li><p>Namespecs: ${product.specs.namespecs || "Sorry there is no info"}</p>`;
    msg += `<li><p>Value: ${product.specs.value ||"Sorry there is no info"}</p>`;
    msg += `<li><p>Option Description: ${product.specs.optionDescription || "Sorry there is no info"}</p></ul>`;
    msg += `<p>Rating: ${product.rating || "Sorry there is no info"}</p><br></div>`;
    return msg;
};

function apiURL (port,path){
    return `http://localhost:${port}/listaroperacoes/${path}`;
}

// Middleware to parse request bodies with URL-encoded and Json payloads.
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

// Routes:

//Redirects the users to the create page
app.get('/add_product', (req, res) => { 
    res.sendFile(`${basePath}/add_product.html`)
});


// Redirects the users to the delete page
app.get('/remove_product', (req, res) => {
    res.sendFile(`${basePath}/remove_product.html`);
});


//Redirects the users to the update page

app.get('/updateproduct', (req, res) => {
    res.sendFile(`${basePath}/update_product.html`);
});


//Redirects the users to the list of operations page
app.get('/listaroperacoes', (req, res) => {
    res.sendFile(`${basePath}/products_operations.html`)
});


// Route to list all products
app.get('/listaroperacoes/M1', (req, res) => {
    axios.get(apiURL(port,"M1/result"))
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            msg += '<h1>List of Products</h1>';
            
            if (success) {
                data.forEach(dataproduct => {
                    msg += listProductTemplate(dataproduct);
                });
            } else {
                msg += `<h1>${message}</h1>`;
            }
            res.send(msg);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('<p>Internal server error.</p>');
        });
});


// Redirects the users to the search product page
app.get('/listaroperacoes/M2', (req, res) => {
    res.sendFile(`${basePath}/find_product.html`)
});


// Route to list all products
app.post('/listaroperacoes/M2/result', (req, res) => {
    const id = req.body.findId;
    axios.post(apiURL(port,"M2/resultdata"), { findId: id })
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            if (success) {
                msg+=`<h1> Searched Product </h1>`;
                msg+= listProductTemplate(data);
            } else {
                msg += `<h1>${message}</h1>`;
            }
            res.send(`${msg} ${backMenu("/listaroperacoes/M2", "Search")}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(`<p>Internal server error.</p> ${backMenu("/listaroperacoes/M2", "Search")}`);
        });
});




//Route to the average product rating page
app.get('/listaroperacoes/M3', (req, res) => {
    axios.get(apiURL(port,"M3/result"))
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            if (success) {
                const media = data[0].avg_val
                msg+=`<h1> The average product rating is: ${media.toFixed(2)} </h1>`
            } else {
                msg += `<h1>${message}</h1>`;
            }
            res.send(`${msg} ${backMenu("/listaroperacoes", "List")}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(`<p>Internal server error.</p> ${backMenu("/listaroperacoes", "List")}`);
        });
});

// Redirects the users to the search product by price page
app.get('/listaroperacoes/M4', (req, res) => {
    res.sendFile(`${basePath}/higher.html`)
});

//Route to the searched product by price page
app.post('/listaroperacoes/M4/result', (req, res) => {
    const price_input = req.body.findPrice;
    axios.post(apiURL(port,"M4/resultdata"), { findPrice: price_input })
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            if (success) {
                msg+=`<h1>List of Products with a price higher than ${price_input}</h1>`;
                data.forEach(product =>{
                    msg+= listProductTemplate(product);
                })
            } else {
                msg += `<h1>There are no products with a price higher than ${price_input}</h1>`;
            }
            res.send(`${msg} ${backMenu("/listaroperacoes/M4", "Search")}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(`<p>Internal server error.</p> ${backMenu("/listaroperacoes/M4", "Search")}`);
        });
});

// Redirects the users to the search product by brand and price page
app.get('/listaroperacoes/M5', (req, res) => {
    res.sendFile(`${basePath}/brandprice.html`)
});

//Route to the searched product by brand and price page
app.post('/listaroperacoes/M5/result', (req, res) => {
    const price_input = req.body.findPriceM5;
    const brand_input = req.body.findBrand;
    axios.post(apiURL(port,"M5/resultdata"), { findPriceM5: price_input, findBrand: brand_input})
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            if (success) {
                msg+=`<h1>List of Products with a price higher than ${price_input} and brand equal to ${brand_input} </h1>`;
                data.forEach(product =>{
                    msg+= listProductTemplate(product);
                })
            } else {
                msg += `<h1>There are no products with a price higher than ${price_input} and brand equal to ${brand_input}</h1> `;
            }
            res.send(`${msg} ${backMenu("/listaroperacoes/M5", "Search")}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(`<p>Internal server error.</p> ${backMenu("/listaroperacoes/M5", "Search")}`);
        });
});

//Route to the search product by brand page
app.get('/listaroperacoes/M6', (req, res) => {
    res.sendFile(`${basePath}/find_brand.html`)
});

// Route to the searched product by brand page

app.post('/listaroperacoes/M6/result', (req, res) => {
    const brand_input = req.body.findBrandM6;
    axios.post(apiURL(port,"M6/resultdata"), {findBrandM6: brand_input})
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            if (success) {
                msg+=`<h1>List of Products with the Brand: ${brand_input}</h1>`;
                data.forEach(product =>{
                    msg+= listProductTemplate(product);
                })
            } else {
                msg += `<h1>There are no products with a brand equal to ${brand_input}</h1> `;
            }
            res.send(`${msg} ${backMenu("/listaroperacoes/M6", "Search")}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(`<p>Internal server error.</p> ${backMenu("/listaroperacoes/M6", "Search")}`);
        });
});

// Route to  the search product sorted in descending order page
app.get('/listaroperacoes/M7', (req, res) => {
    axios.get(apiURL(port,"M7/result"))
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            if (success) {
                msg+='<h1>List of Products sorted in descending order</h1>';
                data.forEach(product =>{
                    msg+= listProductTemplate(product);
                })
            } else {
                msg += `<h1>${message}</h1>`;
            }
            res.send(`${msg} ${backMenu("/listaroperacoes", "List")}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(`<p>Internal server error.</p> ${backMenu("/listaroperacoes", "List")}`);
        });
});



// Route to a page the number of records in the database
app.get('/listaroperacoes/M8', (req, res) => {
    axios.get(apiURL(port,"M8/result"))
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            if (success) {
                msg+=`<h1 style= ' font-size: 20px'> The number of records in the Database is : ${data} </h1>`
            } else {
                msg += `<h1>${message}</h1>`;
            }
            res.send(`${msg} ${backMenu("/listaroperacoes", "List")}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(`<p>Internal server error.</p> ${backMenu("/listaroperacoes", "List")}`);
        });
});

// Route to a page with products that have images
app.get('/listaroperacoes/M9', (req, res) => {
    axios.get(apiURL(port,"M9/result"))
        .then((response) => {
            let msg = menu();
            const { success, message, data } = response.data;
            if (success) {
                msg+='<h1>List of Products with images</h1>';
                data.forEach(product =>{
                    msg+= listProductTemplate(product);
                });
            } else {
                msg += `<h1>${message}</h1>`;
            }
            res.send(`${msg} ${backMenu("/listaroperacoes", "List")}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(`<p>Internal server error.</p> ${backMenu("/listaroperacoes", "List")}`);
        });
});


//Root page
app.get('/', (req, res) => { 
    res.sendFile(`${basePath}/introduction_page.html`)
});



//Middleware for the status(404), productRouter and operationsRouter
const productRouter = require('./routesProduct/products');
const operationsRouter = require('./routesProduct/listaroperacoes');
app.use('/products',productRouter);
app.use('/listaroperacoes', operationsRouter);
app.use((req, res) => {
    res.status(404).sendFile(`${basePath}/404.html`);
  });
  

// Port listener
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

