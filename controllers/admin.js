const Product = require('../models/product');
exports.getAddProduct = (req, res) => {
    res.render('admin/editProduct', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};


exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        // console.log(prodId);

        res.render('admin/editProduct', {
            docTitle: 'edit product',
            path: '/admin/edit-products',
            editing: editMode,
            product: product
        });
    })
};
exports.getProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            docTitle: 'products list',
            path: '/admin/products',
            prods: products,
        });
    });
};