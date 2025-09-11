// const { DataTypes } = require("sequelize");
// const sequelize = require("../src/db/database");

const mongodb = require("mongodb");
const { getDb } = require("../src/db/database");

// ! User authentication will be implemented in the future
class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
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

// const User = sequelize.define("User", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

module.exports = { User };
