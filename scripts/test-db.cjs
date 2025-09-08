require("dotenv").config();
const sequelize = require("../src/db/pool");
const {
  ensureSchema,
  ensureUserAndCart,
  ensureSeedProducts,
} = require("../src/db/bootstrap");

const USER_ID = process.env.USER_ID;

(async () => {
  try {
    const { Product, User, Cart } = sequelize.models;

    await sequelize.authenticate();
    await ensureSchema();
    await ensureUserAndCart(USER_ID);
    await ensureSeedProducts(USER_ID);

    const productData = await Product.findAll({
      attributes: [
        "id",
        "title",
        "price",
        "description",
        "imageUrl",
        "createdAt",
      ],
      order: [["id", "ASC"]],
      raw: true,
    });

    const userData = await User.findAll({
      attributes: ["name", "email", "createdAt"],
      order: [["id", "ASC"]],
      raw: true,
    });

    const cartData = await Cart.findAll({ raw: true });

    console.log("===== DB connection OK =====");
    console.log("--- Product data: ---", productData);
    console.log("--- User data: ---", userData);
    console.log("--- Cart data: ---", cartData);
  } catch (error) {
    console.error("===== DB connection FAILED =====");
    console.error(error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
})();
