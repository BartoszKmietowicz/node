const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);
module.exports = class Cart {
    static addProduct(id, productPrice) {
        //Fetch cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            //find if product exists in cart
            const existingProductIndex = cart.products.findIndex(
                (prod) => prod.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            //add new product/ update quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct };
                updatedProduct.quantity += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, quantity: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                // console.log(err);
            });
        });
    }
};