require("dotenv").config();
const { MongoClient } = require("mongodb");

function required(name) {
  const v = process.env[name];

  if (!v) throw new Error(`Missing .env var: ${name}`);
  return v;
}

let _db;

// * connecting to the 'shop' database
async function mongoConnect(callback) {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${required("MONGO_USER")}:${required(
        "MONGO_PASSWORD"
      )}@nodejs-course-s12.dktw6kd.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeJS-Course-S12`
    );
    _db = client.db();
    return callback();
  } catch (error) {
    throw new Error(
      "An error occured whilst trying to connect to Mongo Datase:",
      error
    );
  }
}

const getDb = () => {
  if (_db) {
    return _db;
  } else throw new Error("No database found!");
};

module.exports = { mongoConnect, getDb };

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   required("DB_NAME"),
//   required("DB_USER"),
//   required("DB_PASSWORD"),
//   {
//     dialect: "mysql",
//     host: required("DB_HOST"),
//     port: Number(required("DB_PORT")),
//   }
// );

// module.exports = sequelize;
