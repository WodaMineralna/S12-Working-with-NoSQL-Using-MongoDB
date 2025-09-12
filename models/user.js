const { getDb } = require("../src/db/database");

// ! User authentication will be implemented in the future
class User {
  constructor(id, username, email, cart) {
    this._id = id;
    this.name = username;
    this.email = email;
    this.cart = cart; // { items: [{cartItem}, {cartItem}] }
  }

  async save() {
    try {
      const db = getDb();
      const result = await db.collection("users").insertOne(this);
      console.log("DB collection 'users' .save() result:", result); // DEBUGGING
      return result;
    } catch (err) {
      const error = new Error("Failed to save user");
      error.details = err;
      throw error;
    }
  }

  getCart() {
    try {
      const cartItems = this.cart.items;
      console.log("Cart items:", cartItems); // DEBUGGING

      return cartItems;
    } catch (err) {
      const error = new Error("Failed to get cart data");
      error.details = err;
      throw error;
    }
  }

  async addToCart(product) {
    try {
      // console.log("Added Product:", product); // DEBUGGING

      // ! conversion to string is needed, comparing two 'ObjectId' objects won't work
      const existingProductIndex = this.cart.items.findIndex((prod) => {
        return prod._id.toString() === product._id.toString();
      });
      // console.log("Existing prod index:", existingProductIndex); // DEBUGGING

      let updatedCart;

      // ^ if cart product already exists, increase quantity
      if (existingProductIndex !== -1) {
        updatedCart = { items: [...this.cart.items] };
        updatedCart.items[existingProductIndex].quantity += 1;
      } else {
        updatedCart = {
          items: [...this.cart.items, { ...product, quantity: 1 }],
        };
      }

      // console.log("Updated Cart:", updatedCart); // DEBUGGING

      const db = getDb();
      const result = await db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });

      // console.log("Result of adding to Cart:", result); // DEBUGGING
      return result;
    } catch (err) {
      const error = new Error("Failed to add item to cart");
      error.details = err;
      throw error;
    }
  }

  static async findUserById(id) {
    try {
      const db = getDb();
      const user = await db.collection("users").findOne({ _id: id });
      console.log("Found user:", user);
      return user;
    } catch (err) {
      const error = new Error("Failed to save product");
      error.details = err;
      throw error;
    }
  }
}

module.exports = { User };
