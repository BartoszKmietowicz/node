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
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render('admin/editProduct', {
      docTitle: 'edit product',
      path: '/admin/edit-products',
      editing: editMode,
      product: product,
    });
  });
};
exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    (imageUrl =
      'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'),
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};
exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
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

