const ObjectId = require("mongodb").ObjectId;
const { mongoConnect, getDb, close } = require("../src/db/database");

const { User } = require("../models/user");
const { Product } = require("../models/product");

const USER_ID = new ObjectId(`${"68c59cebf2b7f6e17ff9ea08"}`);

(async () => {
  try {
    await mongoConnect();

    const db = getDb();
    const rawUser = await db.collection("users").findOne({ _id: USER_ID });
    if (!rawUser) {
      throw new Error(`Could not find user!`);
    }

    const productData = await Product.fetchAll();
    const userData = await db.collection("users").find().toArray();

    const user = new User(rawUser._id, rawUser.name, rawUser.email, rawUser.cart);
    const cartData = await user.getCart();

    console.log("===== DB connection OK =====");
    console.log("--- Product data: ---", productData);
    console.log("--- User data: ---", userData);
    console.log("--- Cart data: ---", cartData);
  } catch (error) {
    console.error("===== DB connection FAILED =====");
    console.error(error.message);
    process.exit(1);
  } finally {
    await close();
  }
})();
