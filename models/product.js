const mongodb = require("mongodb");
const { getDb } = require("../src/db/database");

class Product {
  constructor(id, title, price, description, imageUrl, userId) {
    if (id && mongodb.ObjectId.isValid(id)) {
      this._id = new mongodb.ObjectId(`${id}`);
    }
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  async save() {
    const db = getDb();
    try {
      let result;

      // ^ if this._id field exists, it means a product was meant to be updated
      if (this._id) {
        const { _id, ...fieldsToUpdate } = this;
        result = await db.collection("products").updateOne(
          { _id: this._id },
          {
            $set: fieldsToUpdate,
          }
        );
      } else result = await db.collection("products").insertOne(this);

      console.log("DB collection 'products' .save() result:", result); // DEBUGGING
      return result;
    } catch (err) {
      const error = new Error("Failed to save product");
      error.details = err;
      throw error;
    }
  }

  // if userId was provided, admin products were meant to be fetched - only showing those made by the logged admin
  static async fetchAll(userId) {
    try {
      const db = getDb();
      // ^ pagination is currently unnecessary, app won't be handling thousands of products at once (because there aren't so many)
      let products;
      if (!userId) {
        products = await db.collection("products").find().toArray();
      } else {
        products = await db
          .collection("products")
          .find({ userId: userId })
          .toArray();
      }

      // console.log(products); // DEBUGGING
      return products;
    } catch (err) {
      const error = new Error("Failed to fetch products");
      error.details = err;
      throw error;
    }
  }

  static async findProductById(id) {
    try {
      const db = getDb();
      const product = await db
        .collection("products")
        .find({ _id: new mongodb.ObjectId(`${id}`) })
        .next();
      console.log("Found product:", product); // DEBUGGING
      return product;
    } catch (err) {
      const error = new Error("Failed to fetch product with ID:", id);
      error.details = err;
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      const db = getDb();
      const result = await db
        .collection("products")
        .deleteOne({ _id: new mongodb.ObjectId(`${id}`) });
      console.log("Deleted product:", result); // DEBUGGING
      return result;
    } catch (err) {
      const error = new Error("Failed to delete product with ID:", id);
      error.details = err;
      throw error;
    }
  }
}

async function addOrder(user) {
  try {
    const cart = await fetchAll(user, "cart");
    const order = await user.createOrder();
    if (!cart || !order) {
      throw new Error("Could not fetch cart or create a new order");
    }

    // console.log("Created order:", order); // DEBUGGING
    await order.addProducts(
      cart.map((product) => {
        product.OrderItem = { quantity: product.CartItem.quantity };
        return product;
      })
    );
    const cartInstance = await user.getCart();
    return await cartInstance.setProducts(null);
  } catch (error) {
    throw new Error(`An error occurred while adding a new order! --- ${error}`);
  }
}

module.exports = {
  Product,
  addOrder,
};
