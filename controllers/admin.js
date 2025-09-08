const {
  fetchAll,
  findProductById,
  updateProduct,
  addProduct,
  deleteProduct,
} = require("../models/product");

exports.getProductsPage = async (req, res, next) => {
  const products = await fetchAll(req.user);
  res.render("admin/products", {
    products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const id = req.params.productId;
  const product = await findProductById(id, req.user);

  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product,
  });
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.productId;
  const { title, imageUrl, description, price } = req.body;
  const product = { id, title, imageUrl, description, price };

  console.log("controllers/admin.js | Edited productId: ", id);
  await updateProduct(product);
  res.redirect("/");
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const product = { title, imageUrl, description, price };
  const addedProductId = await addProduct(req.user, product);
  res.redirect(`/products/${addedProductId}`);
};

exports.postDeleteProduct = async (req, res, next) => {
  const id = req.body.productId;
  await deleteProduct(id);
  res.redirect("/admin/products");
};
