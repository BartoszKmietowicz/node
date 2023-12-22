const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const Product = require('../models/product');
exports.getAddProduct = (req, res) => {
  res.render('admin/editProduct', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  let imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title,
    price,
    (imageUrl =
      imageUrl ||
      `https://picsum.photos/seed/${encodeURIComponent(
        title.toLowerCase().trim()
      )}/400/600`),
    description,
    null,
    req.user._id
  );
  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/editProduct', {
      docTitle: 'edit product',
      path: '/admin/edit-products',
      editing: editMode,
      product: product,
    });
  });
};
exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId,
    updatedTitle = req.body.title,
    updatedPrice = req.body.price,
    updatedDesc = req.body.description,
    updatedUrl = req.body.image;
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedUrl,
    updatedDesc,
    new ObjectId(prodId)
  );
  product
    .save()
    .then(() => {
      console.log('Updated Product');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        docTitle: 'products list',
        path: '/admin/products',
        prods: products,
      });
    })
    .catch((err) => console.log(err));
};
exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('deleted product');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
