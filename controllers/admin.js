const mongodb = require('mongodb');
const Product = require('../models/product');
const { validationResult } = require('express-validator');
const product = require('../models/product');
const fileHelper = require('../util/file');

//GET
exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render('admin/products', {
        docTitle: 'products list',
        path: '/admin/products',
        prods: products,
      });
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
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  });
};
exports.getAddProduct = (req, res) => {
  res.render('admin/editProduct', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};
//POST
exports.deleteProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error('Product not found'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      res.status(200).json({
        message: 'success',
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'failed' });
    });
};
exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId,
    updatedTitle = req.body.title,
    updatedPrice = req.body.price,
    updatedDesc = req.body.description,
    image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/editProduct', {
      docTitle: 'edit product',
      path: '/admin/edit-products',
      editing: true,
      hasError: true,
      product: {
        _id: prodId,
        title: updatedTitle,
        imageUrl: image.path,
        price: updatedPrice,
        description: updatedDesc,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.mapped(),
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.price = updatedPrice;
      product.description = updatedDesc;
      return product.save().then(() => {
        console.log('Updated Product');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  let image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render('admin/editProduct', {
      docTitle: 'add product',
      path: '/admin/add-products',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/editProduct', {
      docTitle: 'add product',
      path: '/admin/add-products',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.mapped(),
    });
  }
  const imageUrl = image.path;
  const product = new Product({
    title,
    price,
    imageUrl: imageUrl,
    description,
    userId: req.session.user,
  });
  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};




