const path = require("path");
const express = require("express");
require("dotenv").config();

// const {
//   ensureSchema,
//   ensureUserAndCart,
//   ensureSeedProducts,
// } = require("./src/db/bootstrap");

const { User } = require("./models/user");

const errorController = require("./controllers/error");

const { mongoConnect } = require("./src/db/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const catchErrAsync = require("./utils/catchErrAsync");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// dummy User selector
const USER_ID = "68c31b5b641635d03c40d60c";

// ! user authentication will be implemented in the future
app.use(
  catchErrAsync(async (req, res, next) => {
    const user = await User.findUserById(USER_ID);
    if (!user) {
      throw new Error(`Could not find user!`);
    }
    req.user = user;
    next();
  })
);

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
app.use(errorController.getErrorPage);

// ^ setting up MongoDB connection
mongoConnect(() => {
  app.listen(3000);
});

// // ! IIFE
// // * creates tables for all Sequelize Models and defines their associations, creates User and Cart if doesn't exist
// (async () => {
//   try {
//     await ensureSchema();
//     await ensureUserAndCart(USER_ID);

//     if (process.env.SEED_PRODUCTS === "true") {
//       await ensureSeedProducts({ ownerUserId: USER_ID });
//     }
//   } catch (error) {
//     console.log("Startup failed:", error);
//     process.exit(1);
//   }
// })();

// app.listen(3000);
