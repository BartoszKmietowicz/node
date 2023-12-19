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
  req.user
    .createProduct({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl
        ? imageUrl
        : 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
      userId: req.user.id,
    })
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
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
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
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedUrl
        ? updatedUrl
        : 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png';
      return product.save();
    })
    .then((result) => {
      console.log('Updated Product');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
exports.getProducts = (req, res) => {
  req.user
    .getProducts()
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
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log('deleted product');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};


