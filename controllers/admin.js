const Product = require('../models/product');
exports.getAddProduct = (req, res) => {
  res.render('admin/addProduct', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/products');
};

exports.getEditProduct = (req, res) => {
  res.render('admin/editProduct', {
    docTitle: 'edit product',
    path: '/admin/edit-products',
  });
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
