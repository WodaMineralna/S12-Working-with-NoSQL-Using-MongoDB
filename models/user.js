const { getDb } = require("../src/db/database");

const ObjectId = require("mongodb").ObjectId;

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
      // console.log("Cart items:", cartItems); // DEBUGGING

      return cartItems;
    } catch (err) {
      const error = new Error("Failed to get cart data");
      error.details = err;
      throw error;
    }
  }

  async deleteItemFromCart(productId) {
    try {
      const updatedCartItems = this.cart.items.filter((cartItem) => {
        return cartItem._id.toString() !== productId.toString();
      });
      // console.log("Updated cart items:", updatedCartItems); // DEBUGGING

      const db = getDb();
      const result = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(`${this._id}`) },
          { $set: { cart: { items: updatedCartItems } } }
        );

      return result;
    } catch (err) {
      const error = new Error("Failed to delete product from cart");
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

  // ! bonus validation / snapshot for cart items is required and will be implemented in the futue
  // * if user adds a product to cart, and then the product data gets modified, the change wont be reflected both in addToCart and in addOrder    -    which is a problem!

  async addOrder() {
    try {
      const db = getDb();
      const order = {
        user: {
          _id: new ObjectId(`${this._id}`),
          name: this.name,
          email: this.email,
        },
        items: this.cart.items,
      };
      const result = await db.collection("orders").insertOne(order);
      console.log("Result of adding an order:", result); // DEBUGGING

      if (!result) new Error("Failed to add an order");

      // delete all cart items
      this.cart = { items: [] };
      return await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(`${this._id}`) },
          { $set: { cart: { items: [] } } }
        );
    } catch (err) {
      const error = new Error("Failed to add an order");
      error.details = err;
      throw error;
    }
  }

  async getOrders() {
    try {
      const db = getDb();
      const orders = await db
        .collection("orders")
        .find({ "user._id": new ObjectId(`${this._id}`) })
        .toArray();

      console.log("Result of getting orders:", orders); // DEBUGGING

      return orders;
    } catch (err) {
      const error = new Error("Failed to add an order");
      error.details = err;
      throw error;
    }
  }

  static async findUserById(id) {
    try {
      const db = getDb();
      const user = await db.collection("users").findOne({ _id: id });
      // console.log("Found user:", user); // DEBUGGING
      return user;
    } catch (err) {
      const error = new Error("Failed to find user by ID:", id);
      error.details = err;
      throw error;
    }
  }
}

module.exports = { User };
